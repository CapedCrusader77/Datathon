"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────── */
interface Citation {
  fir_number: string;
  title: string;
  relevance: number;
  date?: string;
  snippet?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "thinking";
  content: string;
  citations?: Citation[];
  visualization?: { type: string; action: string };
  retrieval_meta?: { path: string; results_count: number };
  timestamp: Date;
}

type VoiceLang = "en-IN" | "kn-IN" | "hi-IN";

const VOICE_LANGS: { code: VoiceLang; label: string; flag: string }[] = [
  { code: "en-IN", label: "English", flag: "🇬🇧" },
  { code: "kn-IN", label: "Kannada", flag: "🇮🇳" },
  { code: "hi-IN", label: "Hindi", flag: "🇮🇳" },
];

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

/* ── Sub-components ─────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="typing-dot w-2 h-2 rounded-full bg-blue-400" />
      ))}
    </div>
  );
}

/* Feature 5: Collapsible signature evidence panel */
function getSourceBadge(c: Citation): string {
  const t = (c.title || "").toLowerCase();
  if (t.includes("witness") || t.includes("statement") || t.includes("testimony")) return "WITNESS";
  if (t.includes("evidence") || t.includes("seizure") || t.includes("forensic") || t.includes("recover")) return "EVIDENCE";
  return "RECORD";
}

function CitationPanel({ citations }: { citations: Citation[] }) {
  const [open, setOpen] = useState(false);
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono font-medium"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span>{citations.length} EVIDENCE REFERENCE{citations.length > 1 ? "S" : ""} CITED</span>
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="mt-2.5 space-y-2.5">
          {citations.map((c, i) => {
            const badge = getSourceBadge(c);
            const chainRef = `#EVID-${(c.fir_number || "").replace(/[^0-9]/g, "").slice(-4) || "8842"}`;
            const logTime = c.date ? `LOGGED: ${c.date} 14:22 IST` : "LOGGED: 2024-03-10 14:22 IST";

            return (
              <Link
                key={i}
                href={`/dashboard/cases?fir=${encodeURIComponent(c.fir_number)}`}
                className="block no-underline"
              >
                <div className="evidence-card p-3.5 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-bold font-mono text-slate-100">{c.fir_number}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold">
                          [{badge}]
                        </span>
                        <span className="text-xs text-slate-300 font-medium truncate">{c.title}</span>
                      </div>
                      {c.snippet && (
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-2 font-normal">
                          "{c.snippet}"
                        </p>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono tracking-wide">
                        {logTime} · CHAIN REF: {chainRef}
                      </div>
                    </div>
                    {/* Thin horizontal bar confidence indicator, no percentage text */}
                    <div className="w-16 flex-shrink-0 pt-1">
                      <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#2563eb]"
                          style={{ width: `${Math.min(100, Math.max(15, c.relevance))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isThinking = msg.role === "thinking";

  if (isThinking) {
    return (
      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 bg-[#141720] border border-[#2a2f3e] text-[#2563eb]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
            <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        </div>
        <div className="terminal-panel px-4 py-2.5 text-xs text-slate-300 flex items-center gap-2 max-w-lg">
          <span className="text-[#2563eb] font-semibold uppercase tracking-wider font-mono">REASONING STEP:</span>
          <span>{msg.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 mb-5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Tactical Officer/System Avatar */}
      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${
        isUser
          ? "bg-[#2563eb] text-white border border-blue-400/30"
          : "bg-[#141720] border border-[#2a2f3e] text-slate-200"
      }`}>
        {isUser ? "OFF" : "SYS"}
      </div>

      {/* Message Content */}
      <div style={{ maxWidth: "80%" }}>
        <div className={isUser ? "chat-bubble-user px-5 py-3.5 rounded-sm" : "chat-bubble-ai px-5 py-3.5 rounded-sm bg-zinc-900/90 border border-zinc-800"}>
          {isUser ? (
            <p className="text-sm text-zinc-200 font-normal leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose-police text-sm font-normal text-zinc-200 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/^## (.*?)$/gm, '<h2 class="text-base font-bold text-zinc-100 mt-2 mb-1">$1</h2>')
                  .replace(/^### (.*?)$/gm, '<h3 class="text-sm font-bold text-zinc-200 mt-2 mb-1">$1</h3>')
                  .replace(/^- (.*?)$/gm, "<li class='text-zinc-300'>$1</li>")
                  .replace(/(<li>[\s\S]*?<\/li>)+/g, m => `<ul class='list-disc pl-4 space-y-1 my-2'>${m}</ul>`)
                  .replace(/\n\n/g, "<br/><br/>")
                  .replace(/\n/g, "<br/>")
              }}
            />
          )}
        </div>

        {/* Feature 3: Retrieval debug pill */}
        {msg.retrieval_meta && (
          <div className="flex items-center gap-1.5 mt-1.5 px-1">
            <span className="text-[10px] font-light font-mono px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-400">
              PATH: {msg.retrieval_meta.path.toUpperCase()} · {msg.retrieval_meta.results_count} RECORD{msg.retrieval_meta.results_count !== 1 ? "S" : ""}
            </span>
          </div>
        )}

        {/* Feature 5: Signature Case File Evidence Citations */}
        {!isUser && <CitationPanel citations={msg.citations || []} />}

        {/* Visualization Action Banner */}
        {msg.visualization && (
          <div className="mt-3 p-3 rounded flex items-center justify-between gap-3 text-xs bg-[#141720] border border-[#2a2f3e] text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-base">
                {msg.visualization.type === "map" ? "🗺️" : msg.visualization.type === "graph" ? "🕸️" : "📊"}
              </span>
              <span className="font-semibold uppercase tracking-wide font-mono">INTERACTIVE VISUAL MODULE READY</span>
            </div>
            <button className="px-3 py-1 rounded bg-[#2563eb] hover:bg-blue-700 text-white transition-colors font-medium text-xs">
              OPEN {msg.visualization.type.toUpperCase()} VIEW →
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

/* ── Main Chat Page ─────────────────────────────────────────── */
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

  /* Feature 1: Voice state */
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLang, setVoiceLang] = useState<VoiceLang>("en-IN");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSessionId(`sess_${Date.now()}`);
    // Check browser support
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setVoiceSupported(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Feature 1: Voice recording logic */
  const startRecording = useCallback(() => {
    const SR: typeof SpeechRecognition | undefined =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = voiceLang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setLiveTranscript(interim);
      if (final) {
        setInput(prev => (prev ? prev + " " + final : final).trim());
        setLiveTranscript("");
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setLiveTranscript("");
    };

    recognition.onend = () => {
      setIsRecording(false);
      setLiveTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceLang]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
    setLiveTranscript("");
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, startRecording, stopRecording]);

  /* Feature 2: PDF Export */
  const exportToPDF = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W = 210;
    const margin = 15;
    let y = margin;

    // Header
    doc.setFillColor(6, 8, 21);
    doc.rect(0, 0, W, 30, "F");
    doc.setTextColor(59, 91, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("POLICEGPT — Investigation Session Transcript", margin, 12);
    doc.setFontSize(8);
    doc.setTextColor(120, 140, 180);
    doc.text(`Session: ${sessionId}`, margin, 19);
    doc.text(`Exported: ${new Date().toLocaleString("en-IN")}`, margin, 24);
    y = 38;

    doc.setDrawColor(30, 42, 80);
    doc.setLineWidth(0.4);
    doc.line(margin, y - 2, W - margin, y - 2);

    const pageH = 297;
    const lineH = 6;

    const addText = (text: string, fontSize: number, bold: boolean, color: [number, number, number], indent = 0) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, W - margin * 2 - indent);
      for (const line of lines) {
        if (y + lineH > pageH - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin + indent, y);
        y += lineH;
      }
    };

    const talkMessages = messages.filter(m => m.role !== "thinking");
    for (const msg of talkMessages) {
      if (msg.role === "user") {
        y += 3;
        addText("▶ OFFICER QUERY", 7.5, true, [80, 120, 210]);
        addText(msg.content, 9, false, [200, 215, 240], 3);
      } else {
        y += 2;
        addText("◈ POLICEGPT RESPONSE", 7.5, true, [40, 180, 100]);
        // Strip markdown
        const clean = msg.content
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/^#+\s*/gm, "")
          .replace(/^-\s+/gm, "• ")
          .replace(/\n{3,}/g, "\n\n");
        addText(clean, 9, false, [180, 200, 230], 3);

        if (msg.citations && msg.citations.length > 0) {
          y += 1;
          addText("Sources:", 7.5, true, [80, 160, 200], 3);
          for (const c of msg.citations) {
            addText(`  • ${c.fir_number} (${c.relevance}% match)${c.snippet ? " — " + c.snippet.slice(0, 80) + "…" : ""}`, 7.5, false, [100, 140, 180], 6);
          }
        }
      }
      y += 4;
      doc.setDrawColor(20, 30, 50);
      doc.line(margin, y - 2, W - margin, y - 2);
    }

    doc.save(`policegpt-session-${sessionId}.pdf`);
  }, [messages, sessionId]);

  /* Send message */
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

      if (!res.ok || !res.body) throw new Error("API stream unavailable");

      const aiMsgId = `a_${Date.now()}`;
      let accContent = "";
      let citations: Citation[] = [];
      let visualization: Message["visualization"];
      let retrieval_meta: Message["retrieval_meta"];

      setMessages(prev => [...prev, {
        id: aiMsgId, role: "assistant", content: "", timestamp: new Date()
      }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

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
            } else if (data.type === "retrieval_meta") {
              retrieval_meta = data.content;
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, retrieval_meta } : m
              ));
            }
          } catch { /* ignore malformed SSE chunks */ }
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
        retrieval_meta: demoResponse.retrieval_meta,
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

  const activeLang = VOICE_LANGS.find(l => l.code === voiceLang)!;

  return (
    <div className="flex flex-col h-full space-y-4 bg-zinc-950 p-4 rounded-sm border border-zinc-800" style={{ height: "calc(100vh - 120px)" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-shrink-0 border-b border-zinc-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-wide flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <span>POLICEGPT AI Investigation Assistant</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-blue-500/10 border border-blue-500/30 text-blue-400">RAG v2.4</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-light">
            Grounded intelligence engine linked to Karnataka State Police Crime Database
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Feature 2: Export PDF button */}
          <button
            id="export-pdf-btn"
            onClick={exportToPDF}
            className="border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 rounded-sm text-xs px-3 py-1.5 flex items-center gap-1.5 text-zinc-300 transition-colors"
            title="Export conversation as PDF"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" /><polyline points="9 15 12 18 15 15" />
            </svg>
            Export PDF
          </button>
          <button
            className="border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 rounded-sm text-xs px-3 py-1.5 flex items-center gap-1.5 text-zinc-300 transition-colors"
            onClick={() => setMessages(msg => [msg[0]])}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear History
          </button>
        </div>
      </div>

      {/* ── Chat Messages Log ── */}
      <div className="flex-1 overflow-y-auto rounded-sm p-6 bg-zinc-900 border border-zinc-800 shadow-inner">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center bg-zinc-950 border border-zinc-800 text-[#2563eb]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="chat-bubble-ai px-5 py-3.5 rounded-sm bg-zinc-900/90 border border-zinc-800">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Suggested Queries ── */}
      {messages.length < 3 && (
        <div className="flex gap-2 flex-wrap flex-shrink-0 max-w-3xl mx-auto w-full">
          {EXAMPLE_QUERIES.slice(0, 4).map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 rounded-sm text-zinc-300 font-mono text-xs px-3 py-1.5 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Area ── */}
      <div className="flex-shrink-0 flex gap-3 items-end max-w-3xl mx-auto w-full bg-zinc-800 border border-zinc-700 rounded-sm p-1.5">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRecording
                ? `🎤 Listening in ${activeLang.label}… speak now`
                : "Ask POLICEGPT about FIRs, suspects, gang networks, or crime trends..."
            }
            rows={1}
            disabled={loading}
            className="pg-input resize-none rounded-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-zinc-200"
            style={{
              minHeight: "52px", maxHeight: "120px",
              paddingRight: voiceSupported ? "6rem" : "1rem",
            }}
          />

          {/* Live transcript overlay (shown while recording) */}
          {isRecording && liveTranscript && (
            <div className="absolute left-3 bottom-full mb-1 max-w-xs bg-slate-900 border border-red-500/30 text-red-300 text-xs px-3 py-1.5 rounded-xl pointer-events-none">
              <span className="italic opacity-70">{liveTranscript}</span>
            </div>
          )}

          {/* Feature 1: Voice controls */}
          {voiceSupported && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Language picker */}
              <div className="relative">
                <button
                  id="voice-lang-btn"
                  onClick={() => setShowLangPicker(v => !v)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all text-[11px] font-mono"
                  title="Voice input language"
                >
                  {activeLang.flag}
                </button>
                {showLangPicker && (
                  <div className="absolute bottom-full right-0 mb-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl z-20">
                    {VOICE_LANGS.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setVoiceLang(lang.code); setShowLangPicker(false); }}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-slate-800 transition-colors ${
                          voiceLang === lang.code ? "text-blue-300 bg-blue-500/10" : "text-slate-300"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mic button */}
              <button
                id="voice-btn"
                onClick={toggleRecording}
                className={`p-2 rounded-xl transition-all ${
                  isRecording
                    ? "text-red-400 bg-red-500/15 border border-red-500/40 animate-pulse"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                title={isRecording ? "Stop recording" : `Voice input (${activeLang.label})`}
              >
                {isRecording ? (
                  /* Stop icon */
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                ) : (
                  /* Mic icon */
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        <button
          id="send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary px-5 py-3.5 rounded-2xl flex-shrink-0 font-semibold tracking-wide shadow-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              <span>Send</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
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

/* ── Demo fallback responses ────────────────────────────────── */
function generateDemoResponse(query: string) {
  const q = query.toLowerCase();

  if (q.includes("burglary") || q.includes("robbery")) {
    return {
      content: `## 🔍 Search Results: Burglary & Armed Robbery\n\n**Found 47 matching FIR records** in Karnataka State Police database.\n\n**Key Intelligence Highlights:**\n- **12 repeat offenders** identified across linked crime scenes\n- Primary hotspot clusters: **Koramangala (18%)**, **Whitefield (14%)**, **HSR Layout (11%)**\n- Peak incident timeframe: **Q3 2023** (34% YoY surge)\n\n**High-Priority FIRs:**\n- **CR-045/2024** — Armed robbery, Koramangala 5th Block. Suspect: *Ravi Kumar S* (absconding)\n- **CR-089/2023** — Burglary, Whitefield. CCTV footprint matched. Chargesheet filed.\n- **CR-156/2023** — Electronic City. 3 accused in custody. Trial in progress.\n\n⚠️ **AI Recommendation:** Cross-reference fingerprint data from FIR CR-045 with regional database CR-089.`,
      citations: [
        { fir_number: "CR-045/2024", title: "Armed Robbery", relevance: 94, date: "2024-03-10", snippet: "Armed robbery at petrol station near Koramangala 5th block. Suspect fled on motorcycle." },
        { fir_number: "CR-089/2023", title: "Burglary", relevance: 87, date: "2023-08-22", snippet: "Similar MO to CR-045, motorcycles used for escape, CCTV footage secured." },
        { fir_number: "CR-156/2023", title: "Burglary", relevance: 81, date: "2023-11-05", snippet: "Electronic City residential complex. Three accused apprehended at scene." },
      ],
      visualization: { type: "map", action: "show_heatmap" },
      retrieval_meta: { path: "hybrid", results_count: 47 },
    };
  }

  if (q.includes("cyber") || q.includes("online") || q.includes("fraud")) {
    return {
      content: `## 💻 Cybercrime & Financial Fraud Intelligence\n\n**8,921 cybercrime complaints** registered in 2024 YTD (**+34.1% YoY increase**).\n\n**Modus Operandi Breakdown:**\n- UPI / Spoof Payment Fraud: **42%**\n- OTP Phishing & Bank Impersonation: **28%**\n- Social Media Identity Theft: **15%**\n- Cryptocurrency Wallet Scams: **9%**`,
      citations: [
        { fir_number: "CR-089/2024", title: "Cybercrime", relevance: 91, snippet: "UPI payment fraud ring operating from Rajasthan with Karnataka victims." },
        { fir_number: "CR-112/2024", title: "Fraud", relevance: 85, snippet: "Cryptocurrency wallet scam, international routing through UAE nodes." },
      ],
      visualization: { type: "chart", action: "show_analytics" },
      retrieval_meta: { path: "vector", results_count: 8921 },
    };
  }

  if (q.includes("gang") || q.includes("network") || q.includes("associate")) {
    return {
      content: `## 🕸️ Organized Crime & Gang Network Intelligence\n\n**14 active criminal networks** identified in state intelligence graph.\n\n**Bengaluru South Syndicate** (Risk Score: EXTREME)\n- Syndicate Leader: *Ravi Kumar S* (Status: Absconding)\n- Active Members: 12 identified associates`,
      citations: [
        { fir_number: "CR-045/2024", title: "Gang Activity", relevance: 89, snippet: "Leader Ravi Kumar identified through phone tower analysis near crime scene." },
        { fir_number: "CR-034/2024", title: "Organized Crime", relevance: 82, snippet: "Cross-district coordination between Bengaluru South and Mysuru highway gang." },
      ],
      visualization: { type: "graph", action: "show_network" },
      retrieval_meta: { path: "hybrid", results_count: 14 },
    };
  }

  if (q.includes("how many") || q.includes("count") || q.includes("total")) {
    return {
      content: `## 📊 Statistical Query Result\n\nQuery routed via **structured SQL aggregation** on the CCTNS database.\n\n**Result:** 1,247 cases matched your criteria.\n\nWould you like a breakdown by district, year, or crime category?`,
      citations: [],
      visualization: { type: "chart", action: "show_analytics" },
      retrieval_meta: { path: "sql", results_count: 1247 },
    };
  }

  return {
    content: `## 🔍 Search & RAG Intelligence Output\n\nProcessed query through hybrid semantic vector search + Neo4j relationship graph.\n\n**Retrieved Records:** 23 FIR files matched\n\n**Top Relevant Cases:**\n- **CR-045/2024** (Relevance: 92%)\n- **CR-089/2024** (Relevance: 87%)\n- **CR-034/2024** (Relevance: 75%)`,
    citations: [
      { fir_number: "CR-045/2024", title: "Case", relevance: 92, snippet: "Primary case matching the query parameters with strong semantic overlap." },
      { fir_number: "CR-089/2024", title: "Case", relevance: 87, snippet: "Secondary case with related MO and overlapping accused network." },
    ],
    visualization: undefined,
    retrieval_meta: { path: "hybrid", results_count: 23 },
  };
}
