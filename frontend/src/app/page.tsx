"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      setError("Invalid badge number or password. Please verify credentials.");
      setLoading(false);
    }
  };

  const demoLogin = (badgeNum: string, pass: string) => {
    setBadge(badgeNum);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center relative overflow-hidden selection:bg-blue-500 selection:text-white"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0c1a32 0%, #040812 70%)" }}>

      {/* Atmospheric Glowing Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, rgba(6, 182, 212, 0.4) 40%, transparent 80%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-10 w-[500px] h-[350px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className={`relative z-10 w-full max-w-md px-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        
        {/* Header Emblem & Branding */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            {/* Outer radar glow ring */}
            <div className="absolute -inset-3 rounded-full opacity-30 animate-pulse-glow"
              style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
            
            {/* Shield Container */}
            <div className="relative w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #0f2342 100%)",
                border: "1px solid rgba(96, 165, 250, 0.4)",
                boxShadow: "0 0 35px rgba(59, 130, 246, 0.35)"
              }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4" stroke="#38bdf8" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold tracking-wider mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <span className="gradient-text-blue">POLICE</span>
            <span className="text-amber-400 ml-1">GPT</span>
          </h1>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Karnataka State Police
          </p>
          <p className="text-[11px] text-slate-500 tracking-wider mt-0.5">
            NATIONAL CRIME & INVESTIGATION INTELLIGENCE PLATFORM
          </p>

          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800">
            <div className="live-dot" />
            <span className="text-[11px] font-medium tracking-widest text-emerald-400 uppercase">
              CCTNS SECURE GATEWAY
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 relative overflow-hidden border border-blue-500/20 shadow-2xl">
          {/* Top accent beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #06b6d4, transparent)" }} />

          <h2 className="text-base font-semibold mb-6 text-center text-slate-200 flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Officer Authentication
          </h2>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-xs text-red-300 flex items-start gap-2.5"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Badge Number / Officer ID
              </label>
              <div className="relative">
                <input
                  id="badge-input"
                  type="text"
                  className="pg-input pl-10"
                  placeholder="e.g. KSP001"
                  value={badge}
                  onChange={e => setBadge(e.target.value)}
                  required
                  autoComplete="username"
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type="password"
                  className="pg-input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2 font-semibold tracking-wide">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  ACCESS SYSTEM
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Chips */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-center text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
              Quick Hackathon Credentials
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "Inspector Ramesh", role: "Inspector", badge: "KSP001", pass: "police123", icon: "👮" },
                { label: "Cyber Expert Ananya", role: "Cybercrime", badge: "KSP004", pass: "police123", icon: "💻" },
                { label: "Commissioner DGP", role: "Commissioner", badge: "KSP999", pass: "admin123", icon: "⭐" },
              ].map((d) => (
                <button
                  key={d.badge}
                  onClick={() => demoLogin(d.badge, d.pass)}
                  className="group flex items-center justify-between text-xs py-2 px-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    <span>{d.icon}</span>
                    <span className="font-mono text-slate-300 font-medium group-hover:text-blue-300">{d.badge}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{d.label}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-blue-400">Autofill →</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-slate-600 text-[11px] tracking-wider leading-relaxed">
          GOVERNMENT OF KARNATAKA • DEPARTMENT OF HOME AFFAIRS<br />
          RESTRICTED ACCESS • ALL AUDIT LOGS MONITORED
        </p>
      </div>
    </div>
  );
}
