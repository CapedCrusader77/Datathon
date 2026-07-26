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
    <div className="flex items-center gap-1.5 py-2 px-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="typing-dot w-2 h-2 rounded-full" style={{ background: "var(--accent-blue)" }} />
      ))}
    </div>
  );
}

function CitationTag({ citation }: { citation: { fir_number: string; title: string; relevance: number } }) {
  return (
    <span className="citation-tag">
      <span>📎</span>
      {citation.fir_number}
      <span className="opacity-60">{citation.relevance}%</span>
    </span>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isThinking = msg.role === "thinking";

  if (isThinking) {
    return (
      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>🤔</div>
        <div className="glass-card px-4 py-2 text-xs" style={{ color: "var(--text-muted)", maxWidth: "70%" }}>
          <span style={{ color: "var(--accent-blue)" }}>⚡ </span>
          {msg.content}
          <span className="animate-pulse">...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm
        ${isUser ? "text-white" : ""}`}
        style={isUser
          ? { background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }
          : { background: "linear-gradient(135deg,#1e3a5f,#1e40af)", border: "1px solid rgba(59,130,246,0.4)" }
        }>
        {isUser ? "👮" : "🤖"}
      </div>

      {/* Message */}
      <div style={{ maxWidth: "75%" }}>
        <div className={isUser ? "chat-bubble-user px-4 py-3" : "chat-bubble-ai px-4 py-3"}>
          {isUser ? (
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>{msg.content}</p>
          ) : (
            <div className="prose-police text-sm"
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/^## (.*?)$/gm, '<h2 class="text-base">$1</h2>')
                  .replace(/^### (.*?)$/gm, '<h3 class="text-sm">$1</h3>')
                  .replace(/^- (.*?)$/gm, "<li>$1</li>")
                  .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
                  .replace(/\n\n/g, "<br/><br/>")
                  .replace(/\n/g, "<br/>")
              }}
            />
          )}
        </div>

        {/* Citations */}
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {msg.citations.map((c, i) => <CitationTag key={i} citation={c} />)}
          </div>
        )}

        {/* Visualization hint */}
        {msg.visualization && (
          <div className="mt-2 p-2 rounded-lg flex items-center gap-2 text-xs"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "var(--accent-blue)" }}>
            <span>{msg.visualization.type === "map" ? "🗺️" : msg.visualization.type === "graph" ? "🕸️" : "📊"}</span>
            <span>Visualization available — </span>
            <button className="underline hover:no-underline">Open {msg.visualization.type}</button>
          </div>
        )}

        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
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
      content: `**Welcome to POLICEGPT** 🛡️\n\nI am your AI-powered crime investigation assistant for Karnataka State Police.\n\nI can help you:\n- Search FIRs by location, category, date, or suspect\n- Analyze crime patterns and hotspots\n- Generate investigation summaries and reports\n- Look up suspects, vehicles, and phone records\n- Find cases with similar modus operandi\n- Recommend applicable IPC/BNS sections\n\nAsk me anything in plain English, Kannada, or Hindi.`,
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

    // Add thinking indicator messages
    const thinkingMsgs: Message[] = [
      { id: "t1", role: "thinking", content: "Analyzing query and detecting intent", timestamp: new Date() },
    ];
    setMessages(prev => [...prev, thinkingMsgs[0]]);

    try {
      const token = localStorage.getItem("pgpt_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Streaming response
      const res = await fetch(`${apiUrl}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: text, session_id: sessionId }),
      });

      // Remove thinking message
      setMessages(prev => prev.filter(m => m.id !== "t1"));

      if (!res.ok || !res.body) {
        throw new Error("API unavailable — using demo mode");
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
    <div className="flex flex-col h-full" style={{ height: "calc(100vh - 128px)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold gradient-text-blue" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            POLICEGPT AI Chat
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Ask crime data in natural language • Multi-turn conversation • RAG-powered
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-xs" style={{ color: "#10b981" }}>AI Online</span>
          <button className="btn-ghost text-xs px-3 py-1.5 ml-2"
            onClick={() => setMessages(msg => [msg[0]])}>
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl p-4 mb-4"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)" }}>

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg,#1e3a5f,#1e40af)", border: "1px solid rgba(59,130,246,0.4)" }}>
              🤖
            </div>
            <div className="chat-bubble-ai px-4 py-3">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Example queries */}
      {messages.length < 3 && (
        <div className="mb-3 flex gap-2 flex-wrap flex-shrink-0">
          {EXAMPLE_QUERIES.slice(0, 4).map((q, i) => (
            <button key={i}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                color: "var(--text-secondary)"
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.2)";
                (e.currentTarget as HTMLElement).style.color = "var(--accent-blue-bright)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.1)";
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}>
              {q.length > 50 ? q.slice(0, 48) + "…" : q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… e.g. 'Show robbery cases in Mysore involving repeat offenders'"
            rows={1}
            disabled={loading}
            className="pg-input resize-none pr-12"
            style={{
              minHeight: "48px", maxHeight: "120px",
              paddingRight: "3rem",
              fontFamily: "var(--font-sans)",
            }}
          />
          {/* Voice button */}
          <button
            id="voice-btn"
            onClick={() => setIsRecording(!isRecording)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isRecording ? "recording-pulse" : "hover:bg-blue-600/20"
            }`}
            style={{ color: isRecording ? "#ef4444" : "var(--text-muted)" }}
            title="Voice input">
            🎤
          </button>
        </div>
        <button
          id="send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary px-4 py-3 flex-shrink-0"
          style={{ minWidth: "80px" }}>
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Send ↗</span>
          )}
        </button>
      </div>

      <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
        POLICEGPT may make mistakes. Always verify critical information from CCTNS/official records.
      </p>
    </div>
  );
}

// Demo response generator for hackathon demo mode
function generateDemoResponse(query: string) {
  const q = query.toLowerCase();

  if (q.includes("burglary") || q.includes("robbery")) {
    return {
      content: `## 🔍 Search Results: Burglary / Robbery Cases\n\n**Found 47 matching cases** in the database for your query.\n\n**Key Findings:**\n- **12 repeat offenders** identified across linked cases\n- Top locations: Koramangala (18%), Whitefield (14%), HSR Layout (11%)\n- Most active period: **Q3 2023** (spike of 34%)\n\n**High-Priority Cases:**\n- **CR-045/2024** — Armed robbery, Koramangala 5th Block. Suspect: Ravi Kumar S (absconding)\n- **CR-089/2023** — Similar MO, Whitefield. CCTV evidence strong. Chargesheet filed.\n- **CR-156/2023** — Electronic City. 3 accused. Trial in progress.\n\n⚠️ **AI Recommendation:** MO analysis indicates same gang operating in South Bangalore. Cross-reference fingerprint data from CR-045 with CR-089.`,
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
      content: `## 💻 Cybercrime Analysis\n\n**8,921 cybercrime cases** registered in 2024 YTD — **34% increase** from 2023.\n\n**Top Categories:**\n- UPI/Banking Fraud: 42%\n- OTP Phishing: 28%\n- Social Media Fraud: 15%\n- Cryptocurrency Scams: 9%\n- Others: 6%\n\n**Cryptocurrency Cases:**\n- 847 complaints involving crypto transactions\n- Total loss: ₹23.4 Crore\n- Majority traced to offshore accounts (UAE, Singapore)\n\n**Active Investigations:**\n- CR-089/2024: Bitcoin wallet linked to Silk Road variant\n- CR-112/2024: Fake crypto exchange — 156 victims\n\n💡 **Next Steps:** File MLAT request with CBI for international crypto tracing.`,
      citations: [
        { fir_number: "CR-089/2024", title: "Cybercrime", relevance: 91 },
        { fir_number: "CR-112/2024", title: "Fraud", relevance: 85 },
      ],
      visualization: { type: "chart", action: "show_analytics" },
    };
  }

  if (q.includes("gang") || q.includes("network") || q.includes("associate")) {
    return {
      content: `## 🕸️ Gang Activity Analysis — 2023\n\n**14 organized criminal networks** were active in Karnataka during 2023.\n\n**Most Active Gangs:**\n\n**1. Bengaluru South Gang** (Risk: EXTREME)\n- Leader: Ravi Kumar S (absconding)\n- Members: 12 identified\n- Activities: Robbery, Extortion\n- Territory: Koramangala, HSR, BTM\n- FIRs: 34\n\n**2. Mysore Highway Network**\n- Vehicle theft & smuggling\n- Active in NH-275 corridor\n- FIRs: 21\n\n**3. Cyber Fraud Collective**\n- Online banking fraud ring\n- 3 members arrested, 2 absconding\n- Loss caused: ₹8.7 Crore\n\n⚠️ **Intelligence Alert:** Cross-district coordination between Gang 1 & 3 suspected.`,
      citations: [
        { fir_number: "CR-045/2024", title: "Gang Activity", relevance: 89 },
        { fir_number: "CR-034/2024", title: "Organized Crime", relevance: 82 },
      ],
      visualization: { type: "graph", action: "show_network" },
    };
  }

  // Default
  return {
    content: `## 🔍 Search Results\n\nBased on your query, I found relevant cases in the Karnataka crime database.\n\n**Summary:** Your query has been processed using semantic search + knowledge graph lookup.\n\n**Matching Records:** 23 cases found\n\n**Top Results:**\n- CR-045/2024 (Relevance: 92%)\n- CR-089/2024 (Relevance: 87%)\n- CR-034/2024 (Relevance: 75%)\n\nWould you like me to:\n1. 📊 Show a visual analysis?\n2. 📄 Generate an investigation report?\n3. 🕸️ Display the suspect relationship graph?\n4. 🗺️ Show the crime heatmap?\n\nPlease specify for more detailed analysis.`,
    citations: [
      { fir_number: "CR-045/2024", title: "Case", relevance: 92 },
      { fir_number: "CR-089/2024", title: "Case", relevance: 87 },
    ],
    visualization: undefined,
  };
}
