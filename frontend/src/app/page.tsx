"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

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
      // Demo fallback for local offline / hackathon testing
      if (badge && password) {
        localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
        localStorage.setItem(
          "pgpt_officer",
          JSON.stringify({
            name:
              badge === "KSP999"
                ? "Alok Mohan, IPS"
                : badge === "KSP004"
                ? "Insp. Ananya Rao"
                : "Insp. Ramesh Kumar",
            role:
              badge === "KSP999"
                ? "Director General & IGP"
                : badge === "KSP004"
                ? "Cybercrime Division"
                : "Station House Officer",
            badge: badge,
          })
        );
        router.push("/dashboard");
        return;
      }
      setError("Authentication failed. Check your Police ID and Password.");
      setLoading(false);
    }
  };

  const handleQuickSelect = (id: string, pass: string, name: string, role: string) => {
    setBadge(id);
    setPassword(pass);
    setSelectedProfile(id);
    setLoading(true);
    localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
    localStorage.setItem(
      "pgpt_officer",
      JSON.stringify({
        name,
        role,
        badge: id,
      })
    );
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar / Gov Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          {/* Official Emblem / Crest Graphic */}
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs tracking-wider shadow-sm">
            KSP
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Karnataka State Police
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              Crime & Investigation Intelligence Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-mono text-slate-400">
            CCTNS Node #8902 Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Card Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Officer Login
              </h2>
              <span className="text-[10px] font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-semibold">
                POLICEGPT v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Enter your official credentials to access criminal records and intelligence tools.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Police ID / Badge Number
              </label>
              <input
                id="badge-input"
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. KSP001"
                required
                className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#090d16] border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In to Portal"
              )}
            </button>
          </form>

          {/* Quick Demo Access (Clean minimal selector) */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
            <p className="text-[11px] font-medium text-slate-400">
              Quick Demo Accounts:
            </p>
            <div className="space-y-1.5">
              {[
                {
                  id: "KSP001",
                  pass: "police123",
                  name: "Insp. Ramesh Kumar",
                  role: "Station House Officer (Koramangala)",
                },
                {
                  id: "KSP004",
                  pass: "police123",
                  name: "Insp. Ananya Rao",
                  role: "Cybercrime Division Head",
                },
                {
                  id: "KSP999",
                  pass: "admin123",
                  name: "Alok Mohan, IPS",
                  role: "Director General & IGP",
                },
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() =>
                    handleQuickSelect(acc.id, acc.pass, acc.name, acc.role)
                  }
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                    selectedProfile === acc.id
                      ? "bg-blue-950/60 border-blue-600 text-blue-200"
                      : "bg-[#090d16] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900">
                      {acc.id}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        {acc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{acc.role}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Auto-Fill →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <p>Government of Karnataka • Department of Home Affairs</p>
        <p className="font-mono text-[10px]">
          FOR AUTHORIZED OFFICIAL USE ONLY
        </p>
      </footer>
    </div>
  );
}
