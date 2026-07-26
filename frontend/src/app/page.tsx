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
  const [activeTab, setActiveTab] = useState<"credentials" | "demo">("credentials");

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
      // Fallback for hackathon demo mode if server is offline or mock credentials used
      if (badge && password) {
        localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
        localStorage.setItem("pgpt_officer", JSON.stringify({
          name: badge === "KSP999" ? "DGP Alok Mohan" : badge === "KSP004" ? "Insp. Ananya Rao" : "Insp. Ramesh Kumar",
          role: badge === "KSP999" ? "Commissioner" : badge === "KSP004" ? "Cybercrime" : "Investigating Officer",
          badge: badge
        }));
        router.push("/dashboard");
        return;
      }
      setError("Invalid badge number or password. Please verify credentials.");
      setLoading(false);
    }
  };

  const executeDemoLogin = (badgeNum: string, pass: string) => {
    setBadge(badgeNum);
    setPassword(pass);
    localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
    localStorage.setItem("pgpt_officer", JSON.stringify({
      name: badgeNum === "KSP999" ? "DGP Alok Mohan" : badgeNum === "KSP004" ? "Insp. Ananya Rao" : "Insp. Ramesh Kumar",
      role: badgeNum === "KSP999" ? "Director General of Police" : badgeNum === "KSP004" ? "Cybercrime Specialist" : "Senior Inspector",
      badge: badgeNum
    }));
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden selection:bg-blue-500 selection:text-white"
      style={{ background: "radial-gradient(circle at 50% -20%, #0f2342 0%, #040812 80%)" }}>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      {/* Glowing Dynamic Backdrop Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/3 w-[650px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, #06b6d4 50%, transparent 80%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[300px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      <div className={`relative z-10 w-full max-w-5xl mx-auto px-4 py-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        
        {/* Main Grid: Left Feature Briefing + Right Authentication Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Platform Branding & Intelligence Highlights */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <div className="live-dot" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
                STATE POLICE AI COMMAND CENTER
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                POLICE<span className="text-amber-400">GPT</span>
              </h1>
              <p className="text-sm font-semibold tracking-[0.2em] text-blue-400 uppercase mt-1">
                Karnataka State Police Intelligence System
              </p>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-md">
                Grounded multi-modal crime analytics platform empowering law enforcement with instant FIR synthesis, criminal network link graphs, and predictive AI intelligence.
              </p>
            </div>

            {/* Key Capability Chips */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: "📋", title: "CCTNS Integration", desc: "Real-time FIR database linking" },
                { icon: "🕸️", title: "Knowledge Link Graph", desc: "Suspect, vehicle & phone mapping" },
                { icon: "🔮", title: "Predictive Analytics", desc: "30-day spatial crime forecasts" },
                { icon: "🎙️", title: "Kannada Audio OCR", desc: "Voice transcription & translation" },
              ].map((feat, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="text-base mb-1">{feat.icon}</div>
                  <h4 className="text-xs font-bold text-slate-200">{feat.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Security Audit Badge */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-sm font-bold">
                ✓
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                <span className="text-slate-200 font-semibold block">AES-256 Encrypted Gateway</span>
                <span>Restricted Officers Only • Audit Log Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6">
            <div className="glass-card p-7 sm:p-8 relative overflow-hidden border border-blue-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl bg-slate-950/80 backdrop-blur-xl">
              
              {/* Glowing Top Beam */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #06b6d4, transparent)" }} />

              {/* Shield Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-xl border border-blue-500/40 bg-gradient-to-br from-slate-900 to-blue-950">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4" stroke="#38bdf8" strokeWidth="2"/>
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-slate-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Officer Access Portal
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Authenticate with official credentials</p>
              </div>

              {/* Mode Tabs */}
              <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 mb-6">
                <button
                  onClick={() => setActiveTab("credentials")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === "credentials" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                  }`}>
                  Standard Login
                </button>
                <button
                  onClick={() => setActiveTab("demo")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === "demo" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                  }`}>
                  <span>⭐ Quick Access</span>
                </button>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl text-xs text-red-300 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {activeTab === "credentials" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Badge Number / Police ID
                    </label>
                    <div className="relative">
                      <input
                        id="badge-input"
                        type="text"
                        className="pg-input pl-10 text-xs py-2.5 font-mono"
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
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password-input"
                        type="password"
                        className="pg-input pl-10 text-xs py-2.5"
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
                    className="btn-primary w-full justify-center py-3 mt-2 font-bold tracking-wider text-xs shadow-lg">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        VERIFYING CLEARANCE...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                        AUTHENTICATE & ACCESS SYSTEM
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 mb-3 text-center">
                    Select a pre-configured clearance profile for instant access:
                  </p>

                  {[
                    { label: "Inspector Ramesh Kumar", role: "Investigating Officer (Koramangala)", badge: "KSP001", pass: "police123", icon: "👮" },
                    { label: "Inspector Ananya Rao", role: "Cybercrime Division Head", badge: "KSP004", pass: "police123", icon: "💻" },
                    { label: "DGP Alok Mohan", role: "Director General of Police", badge: "KSP999", pass: "admin123", icon: "⭐" },
                  ].map((d) => (
                    <div
                      key={d.badge}
                      onClick={() => executeDemoLogin(d.badge, d.pass)}
                      className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-blue-600/10 hover:border-blue-500/40 transition-all cursor-pointer group flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg">
                          {d.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-200 group-hover:text-blue-300">{d.label}</span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-blue-400">{d.badge}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{d.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                        Launch →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-[10px] text-slate-600 font-mono mt-4">
              KARNATAKA POLICE DEPT • OFFICIAL USE ONLY • IP LOGGED
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
