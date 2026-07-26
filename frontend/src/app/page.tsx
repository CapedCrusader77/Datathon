"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanLine, setScanLine] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setScanLine(true), 500);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new URLSearchParams();
      form.append("username", badge);
      form.append("password", password);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/login`,
        { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form }
      );
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("pgpt_token", data.access_token);
      localStorage.setItem("pgpt_officer", JSON.stringify({
        name: data.officer_name, role: data.officer_role, badge: data.badge_number
      }));
      router.push("/dashboard");
    } catch {
      setError("Invalid badge number or password. Please try again.");
      setLoading(false);
    }
  };

  const demoLogin = (badgeNum: string, pass: string) => {
    setBadge(badgeNum);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050a14 0%, #070d1a 50%, #0a1628 100%)" }}>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)", filter: "blur(60px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)", filter: "blur(60px)" }} />
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Scan line */}
        {scanLine && (
          <div className="absolute left-0 right-0 h-px opacity-30"
            style={{
              background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
              animation: "scan-line 4s linear infinite",
              top: "0"
            }} />
        )}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo & Branding */}
        <div className="text-center mb-10">
          {/* Karnataka Police Emblem placeholder */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center animate-float"
            style={{
              background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
              border: "2px solid rgba(59,130,246,0.5)",
              boxShadow: "0 0 30px rgba(59,130,246,0.3)"
            }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M22 4L38 12V24C38 33 30 40 22 42C14 40 6 33 6 24V12L22 4Z"
                stroke="#60a5fa" strokeWidth="2" fill="none" />
              <circle cx="22" cy="22" r="7" fill="#3b82f6" opacity="0.8" />
              <path d="M22 15V22L26 26" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-1" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.1em" }}>
            <span className="gradient-text-blue">POLICE</span>
            <span style={{ color: "#f59e0b" }}>GPT</span>
          </h1>
          <p className="text-sm font-medium mb-1" style={{ color: "#94a3b8", letterSpacing: "0.2em" }}>
            KARNATAKA STATE POLICE
          </p>
          <p style={{ color: "#475569", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
            INTELLIGENT CRIME INVESTIGATION SYSTEM
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="live-dot" />
            <span style={{ color: "#10b981", fontSize: "0.7rem", letterSpacing: "0.15em" }}>
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #06b6d4, transparent)" }} />

          <h2 className="text-lg font-semibold mb-6 text-center" style={{ color: "#e2e8f0" }}>
            🔐 Officer Authentication
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm text-red-400"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#94a3b8", letterSpacing: "0.05em" }}>
                BADGE NUMBER / OFFICER ID
              </label>
              <input
                id="badge-input"
                type="text"
                className="pg-input"
                placeholder="e.g., KSP001"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "#94a3b8", letterSpacing: "0.05em" }}>
                PASSWORD
              </label>
              <input
                id="password-input"
                type="password"
                className="pg-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
              style={{ fontSize: "0.875rem", letterSpacing: "0.05em" }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <span>🚔</span> SECURE LOGIN
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(30,64,120,0.4)" }}>
            <p className="text-center text-xs mb-3" style={{ color: "#475569" }}>
              DEMO CREDENTIALS (HACKATHON MODE)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "👮 Inspector", badge: "KSP001", pass: "police123" },
                { label: "💻 Cyber Expert", badge: "KSP004", pass: "police123" },
                { label: "⭐ Commissioner", badge: "KSP999", pass: "admin123" },
              ].map((d) => (
                <button key={d.badge}
                  onClick={() => demoLogin(d.badge, d.pass)}
                  className="text-xs py-2 px-3 rounded-lg text-left transition-all duration-200"
                  style={{
                    background: "rgba(59,130,246,0.05)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    color: "#94a3b8"
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.15)";
                    (e.currentTarget as HTMLElement).style.color = "#60a5fa";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                  }}>
                  <span className="font-mono">{d.badge}</span>
                  <span className="mx-2 opacity-40">|</span>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6" style={{ color: "#1e3a5f", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
          GOVERNMENT OF KARNATAKA • DEPARTMENT OF HOME AFFAIRS<br />
          CLASSIFIED SYSTEM — AUTHORIZED ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
