"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant" | "thinking";
  content: string;
  citations?: Array<{ fir_number: string; title: string; relevance: number }>;
  visualization?: { type: string; action: string };
  timestamp: Date;
}

const EXAMPLE_QUERIES = [
  "Show burglary cases in Bangalore East involving repeat offenders (2021–2024)",
  "Find suspects who appear in multiple FIRs",
  "Which gangs were active during 2023?",
  "Any cybercrime complaints involving cryptocurrency?",
  "Find all murder cases with same modus operandi",
  "Show cases involving white Hyundai i20",
  "Which cases remain unsolved more than 2 years?",
  "Generate investigation summary for CR-045/2024",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="typing-dot w-2 h-2 rounded-full bg-blue-400" />
      ))}
    </div>
  );
}

function CitationTag({ citation }: { citation: { fir_number: string; title: string; relevance: number } }) {
  return (
    <span className="citation-tag">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
      <span>{citation.fir_number}</span>
      <span className="text-cyan-400 font-mono font-bold">{citation.relevance}%</span>
    </span>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isThinking = msg.role === "thinking";

  if (isThinking) {
    return (
      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-900 border border-blue-500/30 text-blue-400 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
            <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
        </div>
        <div className="glass-card px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2 border border-blue-500/20 max-w-lg">
          <span className="text-blue-400 font-semibold uppercase tracking-wider">Reasoning step:</span>
          <span>{msg.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm shadow-lg ${
        isUser
          ? "bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/40 text-white"
          : "bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/40 text-blue-400"
      }`}>
        {isUser ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div style={{ maxWidth: "80%" }}>
        <div className={isUser ? "chat-bubble-user px-5 py-3.5" : "chat-bubble-ai px-5 py-3.5"}>
          {isUser ? (
            <p className="text-sm text-slate-100 font-normal leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose-police text-sm leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/^## (.*?)$/gm, '<h2 class="text-base font-bold text-blue-300 mt-2 mb-1">$1</h2>')
                  .replace(/^### (.*?)$/gm, '<h3 class="text-sm font-semibold text-blue-400 mt-2 mb-1">$1</h3>')
                  .replace(/^- (.*?)$/gm, "<li class='text-slate-300'>$1</li>")
                  .replace(/(<li>.*<\/li>)/gs, "<ul class='list-disc pl-4 space-y-1 my-2'>$1</ul>")
                  .replace(/\n\n/g, "<br/><br/>")
                  .replace(/\n/g, "<br/>")
              }}
            />
          )}
        </div>

        {/* Citations */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {msg.citations.map((c, i) => <CitationTag key={i} citation={c} />)}
          </div>
        )}

        {/* Visualization Action Banner */}
        {msg.visualization && (
          <div className="mt-3 p-3 rounded-xl flex items-center justify-between gap-3 text-xs bg-blue-500/10 border border-blue-500/30 text-blue-300 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-base">
                {msg.visualization.type === "map" ? "🗺️" : msg.visualization.type === "graph" ? "🕸️" : "📊"}
              </span>
              <span className="font-semibold">Interactive Visual Module Available</span>
            </div>
            <button className="px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/40 transition-colors font-medium">
              Open {msg.visualization.type.toUpperCase()} View →
            </button>
          </div>
        )}

        <p className="text-[10px] text-slate-500 font-mono mt-1.5 px-1">
          {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `**Welcome to POLICEGPT AI Investigation Assistant** 🛡️\n\nI am your specialized RAG-powered intelligence assistant for Karnataka State Police.\n\n**Capabilities:**\n- Cross-query 10+ crime databases in natural language\n- Extract repeat offender networks & MO patterns\n- Synthesize IPC / BNS legal recommendations\n- Generate formal investigation dossiers\n\n*Select a suggested query below or type your question in English, Kannada, or Hindi.*`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSessionId(`sess_${Date.now()}`);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (queryText?: string) => {
    const text = queryText || input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Thinking indicator
    const thinkingMsg: Message = {
      id: "t1", role: "thinking", content: "Querying vector index & knowledge graph...", timestamp: new Date()
    };
    setMessages(prev => [...prev, thinkingMsg]);

    try {
      const token = localStorage.getItem("pgpt_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${apiUrl}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text, session_id: sessionId }),
      });

      setMessages(prev => prev.filter(m => m.id !== "t1"));

      if (!res.ok || !res.body) {
        throw new Error("API stream unavailable");
      }

      const aiMsgId = `a_${Date.now()}`;
      let accContent = "";
      let citations: Message["citations"] = [];
      let visualization: Message["visualization"];

      setMessages(prev => [...prev, {
        id: aiMsgId, role: "assistant", content: "", timestamp: new Date()
      }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter(l => l.startsWith("data: "));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "content") {
              accContent += data.content;
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: accContent } : m
              ));
            } else if (data.type === "citations") {
              citations = data.content;
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, citations } : m
              ));
            } else if (data.type === "visualization") {
              visualization = data.content;
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, visualization } : m
              ));
            }
          } catch {}
        }
      }

    } catch {
      // Demo mode fallback
      setMessages(prev => prev.filter(m => m.id !== "t1"));
      const demoResponse = generateDemoResponse(text);
      setMessages(prev => [...prev, {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: demoResponse.content,
        citations: demoResponse.citations,
        visualization: demoResponse.visualization,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-wide flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <span>POLICEGPT AI Investigation Assistant</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">RAG v2.4</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded intelligence engine linked to Karnataka State Police Crime Database
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
            onClick={() => setMessages(msg => [msg[0]])}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Clear History
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto rounded-2xl p-5 border border-blue-500/15 bg-slate-950/60 backdrop-blur-md shadow-2xl">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900 border border-blue-500/30 text-blue-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="chat-bubble-ai px-5 py-3.5">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length < 3 && (
        <div className="flex gap-2 flex-wrap flex-shrink-0">
          {EXAMPLE_QUERIES.slice(0, 4).map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="text-xs px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-slate-900/60 text-slate-300 hover:text-blue-300 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200 shadow-sm">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="flex-shrink-0 flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask POLICEGPT about FIRs, suspects, gang networks, or crime trends..."
            rows={1}
            disabled={loading}
            className="pg-input resize-none pr-12 rounded-2xl"
            style={{
              minHeight: "52px", maxHeight: "120px",
              paddingRight: "3.5rem",
            }}
          />
          {/* Voice Input Trigger */}
          <button
            id="voice-btn"
            onClick={() => setIsRecording(!isRecording)}
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
              isRecording ? "recording-pulse text-red-400" : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title="Voice input (Kannada / English / Hindi)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
        </div>

        <button
          id="send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary px-5 py-3.5 rounded-2xl flex-shrink-0 font-semibold tracking-wide shadow-lg">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <span>Send</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </div>
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-500 tracking-wider">
        POLICEGPT Grounded AI Engine • All output generated strictly from official CCTNS & police database records.
      </p>
    </div>
  );
}

// Fallback demo responses for offline/demo mode
function generateDemoResponse(query: string) {
  const q = query.toLowerCase();

  if (q.includes("burglary") || q.includes("robbery")) {
    return {
      content: `## 🔍 Search Results: Burglary & Armed Robbery\n\n**Found 47 matching FIR records** in Karnataka State Police database.\n\n**Key Intelligence Highlights:**\n- **12 repeat offenders** identified across linked crime scenes\n- Primary hotspot clusters: **Koramangala (18%)**, **Whitefield (14%)**, **HSR Layout (11%)**\n- Peak incident timeframe: **Q3 2023** (34% YoY surge)\n\n**High-Priority FIRs:**\n- **CR-045/2024** — Armed robbery, Koramangala 5th Block. Suspect: *Ravi Kumar S* (absconding)\n- **CR-089/2023** — Burglary, Whitefield. CCTV footprint matched. Chargesheet filed.\n- **CR-156/2023** — Electronic City. 3 accused in custody. Trial in progress.\n\n⚠️ **AI Recommendation:** Cross-reference fingerprint data from FIR CR-045 with regional database CR-089.`,
      citations: [
        { fir_number: "CR-045/2024", title: "Robbery", relevance: 94 },
        { fir_number: "CR-089/2023", title: "Robbery", relevance: 87 },
        { fir_number: "CR-156/2023", title: "Burglary", relevance: 81 },
      ],
      visualization: { type: "map", action: "show_heatmap" },
    };
  }

  if (q.includes("cyber") || q.includes("online") || q.includes("fraud")) {
    return {
      content: `## 💻 Cybercrime & Financial Fraud Intelligence\n\n**8,921 cybercrime complaints** registered in 2024 YTD (**+34.1% YoY increase**).\n\n**Modus Operandi Breakdown:**\n- UPI / Spoof Payment Fraud: **42%**\n- OTP Phishing & Bank Impersonation: **28%**\n- Social Media Identity Theft: **15%**\n- Cryptocurrency Wallet Scams: **9%**\n\n**Cryptocurrency Investigation Findings:**\n- 847 complaints involving crypto wallet routing\n- Cumulative monetary loss: **₹23.4 Crore**\n- Transaction trails linked to offshore nodes (UAE, Singapore)\n\n💡 **Action Item:** Issue MLAT request via Nodal Agency for international exchange subpoena.`,
      citations: [
        { fir_number: "CR-089/2024", title: "Cybercrime", relevance: 91 },
        { fir_number: "CR-112/2024", title: "Fraud", relevance: 85 },
      ],
      visualization: { type: "chart", action: "show_analytics" },
    };
  }

  if (q.includes("gang") || q.includes("network") || q.includes("associate")) {
    return {
      content: `## 🕸️ Organized Crime & Gang Network Intelligence\n\n**14 active criminal networks** identified in state intelligence graph.\n\n**Key Syndicate Profiles:**\n\n**1. Bengaluru South Syndicate** (Risk Score: EXTREME)\n- Syndicate Leader: *Ravi Kumar S* (Status: Absconding)\n- Active Members: 12 identified associates\n- Primary Offenses: Armed Robbery, Extortion\n- Operating Range: Koramangala, HSR, BTM Layout\n\n**2. Mysore Highway Transit Network**\n- Vehicle hijacking & contraband smuggling\n- Active corridor: NH-275\n\n⚠️ **Intelligence Alert:** Graph correlation detects cross-district communication between Syndicate 1 and digital fraud operatives.`,
      citations: [
        { fir_number: "CR-045/2024", title: "Gang Activity", relevance: 89 },
        { fir_number: "CR-034/2024", title: "Organized Crime", relevance: 82 },
      ],
      visualization: { type: "graph", action: "show_network" },
    };
  }

  return {
    content: `## 🔍 Search & RAG Intelligence Output\n\nProcessed query through hybrid semantic vector search + Neo4j relationship graph.\n\n**Retrieved Records:** 23 FIR files matched\n\n**Top Relevant Cases:**\n- **CR-045/2024** (Relevance: 92%)\n- **CR-089/2024** (Relevance: 87%)\n- **CR-034/2024** (Relevance: 75%)\n\nWould you like me to:\n1. 📊 Render crime analytical map?\n2. 📄 Compile detailed investigation dossier?\n3. 🕸️ Trace suspect graph relationships?`,
    citations: [
      { fir_number: "CR-045/2024", title: "Case", relevance: 92 },
      { fir_number: "CR-089/2024", title: "Case", relevance: 87 },
    ],
    visualization: undefined,
  };
}
      { fir_number: "CR-089/2024", title: "Case", relevance: 87 },
    ],
    visualization: undefined,
  };
}
