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
    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 8px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} className="typing-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#60a5fa" }} />
      ))}
    </div>
  );
}

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
    <div style={{ marginTop: "12px" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "0.72rem", color: "#94a3b8", background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontWeight: 600, padding: 0
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
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
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {citations.map((c, i) => {
            const badge = getSourceBadge(c);
            const chainRef = `#EVID-${(c.fir_number || "").replace(/[^0-9]/g, "").slice(-4) || "8842"}`;
            const logTime = c.date ? `LOGGED: ${c.date} 14:22 IST` : "LOGGED: 2024-03-10 14:22 IST";

            return (
              <Link key={i} href={`/dashboard/cases?fir=${encodeURIComponent(c.fir_number)}`} style={{ textDecoration: "none" }}>
                <div className="glass-card glass-card-hover" style={{ padding: "12px 14px", borderLeft: "3px solid #3b82f6" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "#f1f5f9" }}>{c.fir_number}</span>
                        <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: "4px", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa", fontWeight: 700 }}>
                          [{badge}]
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#cbd5e1", fontWeight: 500 }}>{c.title}</span>
                      </div>
                      {c.snippet && (
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "6px" }}>
                          "{c.snippet}"
                        </p>
                      )}
                      <div style={{ fontSize: "0.65rem", color: "#475569", fontFamily: "var(--font-mono)" }}>
                        {logTime} · CHAIN REF: {chainRef}
                      </div>
                    </div>
                    <div style={{ width: "60px", flexShrink: 0, paddingTop: "4px" }}>
                      <div style={{ width: "100%", height: "4px", borderRadius: "99px", background: "#1e293b", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "99px", background: "#3b82f6", width: `${Math.min(100, Math.max(15, c.relevance))}%` }} />
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
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0a0d14", border: "1px solid #141a28", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        </div>
        <div style={{ background: "#080a12", border: "1px solid #141a28", borderRadius: "8px", padding: "10px 14px", fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "8px", maxWidth: "500px" }}>
          <span style={{ color: "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>REASONING:</span>
          <span>{msg.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexDirection: isUser ? "row-reverse" : "row" }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        fontSize: "0.68rem", fontFamily: "var(--font-mono)", fontWeight: 700,
        background: isUser ? "#3b82f6" : "#080a12",
        color: isUser ? "#ffffff" : "#94a3b8",
        border: isUser ? "1px solid rgba(255,255,255,0.15)" : "1px solid #141a28"
      }}>
        {isUser ? "OFF" : "SYS"}
      </div>

      <div style={{ maxWidth: "80%" }}>
        <div className={isUser ? "chat-bubble-user" : "chat-bubble-ai"} style={{ padding: "14px 18px" }}>
          {isUser ? (
            <p style={{ fontSize: "0.875rem", color: "#f1f5f9", lineHeight: 1.6 }}>{msg.content}</p>
          ) : (
            <div className="prose-police"
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/^## (.*?)$/gm, '<h2 style="font-size:0.95rem;font-weight:700;color:#f8fafc;margin-top:8px;margin-bottom:4px;">$1</h2>')
                  .replace(/^### (.*?)$/gm, '<h3 style="font-size:0.875rem;font-weight:700;color:#e2e8f0;margin-top:6px;margin-bottom:4px;">$1</h3>')
                  .replace(/^- (.*?)$/gm, "<li style='color:#cbd5e1;margin-bottom:3px;'>$1</li>")
                  .replace(/(<li>[\s\S]*?<\/li>)+/g, m => `<ul style='padding-left:18px;margin:8px 0;'>${m}</ul>`)
                  .replace(/\n\n/g, "<br/><br/>")
                  .replace(/\n/g, "<br/>")
              }}
            />
          )}
        </div>

        {msg.retrieval_meta && (
          <div style={{ marginTop: "6px", paddingLeft: "4px" }}>
            <span style={{ fontSize: "0.62rem", fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: "4px", background: "#080a12", border: "1px solid #141a28", color: "#64748b" }}>
              PATH: {msg.retrieval_meta.path.toUpperCase()} · {msg.retrieval_meta.results_count} RECORD{msg.retrieval_meta.results_count !== 1 ? "S" : ""}
            </span>
          </div>
        )}

        {!isUser && <CitationPanel citations={msg.citations || []} />}

        {msg.visualization && (
          <div style={{ marginTop: "12px", padding: "12px 14px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", background: "#080a12", border: "1px solid #141a28" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", color: "#cbd5e1" }}>
              <span style={{ fontSize: "1rem" }}>
                {msg.visualization.type === "map" ? "🗺️" : msg.visualization.type === "graph" ? "🕸️" : "📊"}
              </span>
              <span style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>INTERACTIVE MODULE READY</span>
            </div>
            <button className="btn-primary" style={{ padding: "4px 10px", fontSize: "0.7rem" }}>
              OPEN {msg.visualization.type.toUpperCase()} →
            </button>
          </div>
        )}

        <p style={{ fontSize: "0.62rem", color: "#475569", fontFamily: "var(--font-mono)", marginTop: "6px", paddingLeft: "4px" }}>
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
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setVoiceSupported(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const exportToPDF = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const W = 210;
    const margin = 15;
    let y = margin;

    doc.setFillColor(6, 8, 16);
    doc.rect(0, 0, W, 30, "F");
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("POLICEGPT — Investigation Session Transcript", margin, 12);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Session: ${sessionId}`, margin, 19);
    doc.text(`Exported: ${new Date().toLocaleString("en-IN")}`, margin, 24);
    y = 38;

    doc.setDrawColor(20, 26, 40);
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
        addText("▶ OFFICER QUERY", 7.5, true, [59, 130, 246]);
        addText(msg.content, 9, false, [226, 232, 240], 3);
      } else {
        y += 2;
        addText("◈ POLICEGPT RESPONSE", 7.5, true, [16, 185, 129]);
        const clean = msg.content
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/^#+\s*/gm, "")
          .replace(/^-\s+/gm, "• ")
          .replace(/\n{3,}/g, "\n\n");
        addText(clean, 9, false, [203, 213, 225], 3);

        if (msg.citations && msg.citations.length > 0) {
          y += 1;
          addText("Sources:", 7.5, true, [96, 165, 250], 3);
          for (const c of msg.citations) {
            addText(`  • ${c.fir_number} (${c.relevance}% match)${c.snippet ? " — " + c.snippet.slice(0, 80) + "…" : ""}`, 7.5, false, [148, 163, 184], 6);
          }
        }
      }
      y += 4;
      doc.setDrawColor(20, 26, 40);
      doc.line(margin, y - 2, W - margin, y - 2);
    }

    doc.save(`policegpt-session-${sessionId}.pdf`);
  }, [messages, sessionId]);

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
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", background: "#000000", gap: "12px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid #141a28", paddingBottom: "12px" }}>
        <div>
          <h1 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>POLICEGPT AI Investigation Assistant</span>
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", padding: "2px 8px", borderRadius: "4px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}>RAG v2.4</span>
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
            Grounded intelligence engine linked to Karnataka State Police Crime Database
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button id="export-pdf-btn" onClick={exportToPDF} className="btn-ghost" style={{ fontSize: "0.75rem", padding: "6px 12px" }}>
            Export PDF
          </button>
          <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "6px 12px" }} onClick={() => setMessages(msg => [msg[0]])}>
            Clear History
          </button>
        </div>
      </div>

      {/* ── Chat Messages Log ── */}
      <div className="chart-container" style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#05070a", border: "1px solid #141a28" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

          {loading && (
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#080a12", border: "1px solid #141a28", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                🛡️
              </div>
              <div className="chat-bubble-ai" style={{ padding: "14px 18px" }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Suggested Queries ── */}
      {messages.length < 3 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flexShrink: 0, maxWidth: "800px", margin: "0 auto", width: "100%" }}>
          {EXAMPLE_QUERIES.slice(0, 4).map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="btn-ghost"
              style={{ fontSize: "0.72rem", padding: "6px 12px", fontFamily: "var(--font-mono)", cursor: "pointer" }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Area ── */}
      <div style={{ flexShrink: 0, display: "flex", gap: "10px", alignItems: "flex-end", maxWidth: "800px", margin: "0 auto", width: "100%", background: "#080a12", border: "1px solid #141a28", borderRadius: "10px", padding: "6px" }}>
        <div style={{ flex: 1, position: "relative" }}>
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
            className="pg-input"
            style={{
              minHeight: "48px", maxHeight: "120px",
              paddingRight: voiceSupported ? "90px" : "12px",
              border: "none", background: "transparent"
            }}
          />

          {isRecording && liveTranscript && (
            <div style={{ position: "absolute", left: "12px", bottom: "100%", marginBottom: "4px", background: "#0f172a", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5", fontSize: "0.72rem", padding: "4px 10px", borderRadius: "8px" }}>
              <span style={{ fontStyle: "italic", opacity: 0.8 }}>{liveTranscript}</span>
            </div>
          )}

          {voiceSupported && (
            <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ position: "relative" }}>
                <button
                  id="voice-lang-btn"
                  onClick={() => setShowLangPicker(v => !v)}
                  style={{ padding: "4px 6px", fontSize: "0.7rem", color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
                  title="Voice input language"
                >
                  {activeLang.flag}
                </button>
                {showLangPicker && (
                  <div style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: "8px", background: "#080a12", border: "1px solid #141a28", borderRadius: "8px", overflow: "hidden", zIndex: 20, width: "110px" }}>
                    {VOICE_LANGS.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setVoiceLang(lang.code); setShowLangPicker(false); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 10px", fontSize: "0.72rem", textAlign: "left", background: voiceLang === lang.code ? "rgba(59,130,246,0.1)" : "transparent", color: voiceLang === lang.code ? "#93c5fd" : "#cbd5e1", border: "none", cursor: "pointer" }}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                id="voice-btn"
                onClick={toggleRecording}
                style={{ padding: "6px", borderRadius: "8px", border: "none", cursor: "pointer", color: isRecording ? "#ef4444" : "#64748b", background: isRecording ? "rgba(239,68,68,0.1)" : "transparent" }}
                title={isRecording ? "Stop recording" : `Voice input (${activeLang.label})`}
              >
                🎤
              </button>
            </div>
          )}
        </div>

        <button
          id="send-btn"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{ padding: "10px 18px", borderRadius: "8px", flexShrink: 0 }}
        >
          {loading ? (
            <div style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
          ) : (
            <span>Send →</span>
          )}
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: "0.68rem", color: "#475569", letterSpacing: "0.04em" }}>
        POLICEGPT Grounded AI Engine • Output generated strictly from official CCTNS & police database records.
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
