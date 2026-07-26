"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form,
        }
      );

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("pgpt_token", data.access_token);
      localStorage.setItem(
        "pgpt_officer",
        JSON.stringify({
          name: data.officer_name,
          role: data.officer_role,
          badge: data.badge_number,
        })
      );
      router.push("/dashboard");
    } catch {
      // Demo fallback for instant offline/hackathon testing
      if (badge && password) {
        localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
        localStorage.setItem(
          "pgpt_officer",
          JSON.stringify({
            name:
              badge === "KSP999"
                ? "DGP Alok Mohan"
                : badge === "KSP004"
                ? "Insp. Ananya Rao"
                : "Insp. Ramesh Kumar",
            role:
              badge === "KSP999"
                ? "Commissioner"
                : badge === "KSP004"
                ? "Cybercrime"
                : "Investigating Officer",
            badge: badge,
          })
        );
        router.push("/dashboard");
        return;
      }
      setError("Invalid badge number or password.");
      setLoading(false);
    }
  };

  const quickLogin = (badgeId: string, pass: string, name: string, role: string) => {
    setBadge(badgeId);
    setPassword(pass);
    setLoading(true);
    localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
    localStorage.setItem(
      "pgpt_officer",
      JSON.stringify({ name, role, badge: badgeId })
    );
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Centered Login Card */}
      <div className="w-full max-w-sm bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-7 shadow-2xl relative z-10 space-y-6">
        
        {/* Top Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              POLICE<span className="text-blue-500">GPT</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Karnataka State Police Intelligence System
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Badge Number / ID
            </label>
            <input
              id="badge-input"
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. KSP001"
              required
              className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        {/* Quick Demo Access Pills */}
        <div className="pt-4 border-t border-slate-800/60 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Quick Demo Accounts
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              { id: "KSP001", pass: "police123", label: "Insp. Ramesh (KSP001)", role: "Investigating Officer" },
              { id: "KSP004", pass: "police123", label: "Insp. Ananya (KSP004)", role: "Cybercrime Specialist" },
              { id: "KSP999", pass: "admin123", label: "DGP Alok Mohan (KSP999)", role: "Commissioner" },
            ].map((acc) => (
              <button
                key={acc.id}
                onClick={() => quickLogin(acc.id, acc.pass, acc.label, acc.role)}
                className="w-full text-left py-2 px-3 rounded-xl bg-[#030712] border border-slate-800/80 hover:border-blue-500/50 hover:bg-blue-950/20 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group"
              >
                <span className="font-mono text-[11px]">{acc.label}</span>
                <span className="text-[10px] text-blue-400 group-hover:translate-x-0.5 transition-transform">
                  Login →
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Subtle Footer */}
      <footer className="mt-8 text-center text-[11px] text-slate-600 font-mono">
        Karnataka State Police • CCTNS Secured
      </footer>
    </div>
  );
}
