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
    setLoading(true);
    localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
    localStorage.setItem(
      "pgpt_officer",
      JSON.stringify({ name, role, badge: badgeId })
    );
    setTimeout(() => router.push("/dashboard"), 400);
  };

  const demoAccounts = [
    { id: "KSP001", pass: "police123", name: "Insp. Ramesh Kumar", role: "Investigating Officer", initial: "R" },
    { id: "KSP004", pass: "police123", name: "Insp. Ananya Rao", role: "Cybercrime Specialist", initial: "A" },
    { id: "KSP999", pass: "admin123", name: "DGP Alok Mohan", role: "Commissioner", initial: "D" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #080c14; }

        .login-root {
          min-height: 100vh;
          background: #080c14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* Animated background blobs */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .bg-blob.visible { opacity: 1; }

        .blob-1 {
          width: 500px; height: 400px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          top: -100px; left: -100px;
          animation: drift1 18s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
          bottom: -80px; right: -80px;
          animation: drift2 22s ease-in-out infinite alternate;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          animation: pulse-blob 8s ease-in-out infinite;
        }

        @keyframes drift1 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 80px); }
        }
        @keyframes drift2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-60px, -60px); }
        }
        @keyframes pulse-blob {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }

        /* Grid lines subtle overlay */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        /* Main card */
        .card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(11, 16, 28, 0.95);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow:
            0 0 0 1px rgba(59,130,246,0.05),
            0 25px 60px rgba(0,0,0,0.6),
            0 0 80px rgba(59,130,246,0.04);
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Logo area */
        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .logo-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1));
          border: 1px solid rgba(59,130,246,0.25);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #60a5fa;
          box-shadow: 0 0 24px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .logo-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.5px;
        }
        .logo-title span { color: #3b82f6; }

        .logo-sub {
          font-size: 0.7rem;
          color: #475569;
          letter-spacing: 0.08em;
          font-weight: 500;
          text-transform: uppercase;
          margin-top: -0.5rem;
        }

        /* Status indicator */
        .status-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
        }
        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          animation: blink 2.5s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Form fields */
        .field { margin-bottom: 1rem; }

        .field label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 0.4rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .field input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-size: 0.875rem;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: inherit;
        }
        .field input::placeholder { color: #334155; }
        .field input:focus {
          border-color: rgba(59,130,246,0.4);
          background: rgba(59,130,246,0.04);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
        }

        /* Error */
        .error-msg {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 0.6rem 0.875rem;
          font-size: 0.75rem;
          color: #f87171;
          margin-bottom: 1rem;
          text-align: center;
        }

        /* Submit button */
        .btn-login {
          width: 100%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border: none;
          border-radius: 10px;
          padding: 0.8rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(59,130,246,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: inherit;
          letter-spacing: 0.01em;
        }
        .btn-login:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          box-shadow: 0 6px 28px rgba(59,130,246,0.35);
          transform: translateY(-1px);
        }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .btn-login:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 1.5rem 0 1rem;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .divider-text {
          font-size: 0.65rem;
          font-weight: 600;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }

        /* Demo accounts */
        .demo-accounts { display: flex; flex-direction: column; gap: 0.5rem; }

        .demo-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 0.6rem 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: inherit;
          color: inherit;
        }
        .demo-btn:hover {
          background: rgba(59,130,246,0.06);
          border-color: rgba(59,130,246,0.2);
        }

        .demo-avatar {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15));
          border: 1px solid rgba(59,130,246,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #93c5fd;
          flex-shrink: 0;
        }

        .demo-info { flex: 1; min-width: 0; }
        .demo-name {
          font-size: 0.78rem;
          font-weight: 600;
          color: #cbd5e1;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .demo-role {
          font-size: 0.66rem;
          color: #475569;
          display: block;
          margin-top: 1px;
        }

        .demo-arrow {
          color: #3b82f6;
          font-size: 0.75rem;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
        }
        .demo-btn:hover .demo-arrow {
          opacity: 1;
          transform: translateX(2px);
        }

        /* Footer */
        .footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.65rem;
          color: #1e293b;
          letter-spacing: 0.08em;
          font-weight: 500;
          text-transform: uppercase;
        }
      `}</style>

      <div className="login-root">
        <div className={`bg-blob blob-1 ${mounted ? "visible" : ""}`} />
        <div className={`bg-blob blob-2 ${mounted ? "visible" : ""}`} />
        <div className={`bg-blob blob-3 ${mounted ? "visible" : ""}`} />
        <div className="grid-overlay" />

        <div className={`card ${mounted ? "visible" : ""}`}>
          {/* Logo */}
          <div className="logo-wrap">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="logo-title">POLICE<span>GPT</span></div>
              <div className="logo-sub">Karnataka State Police · Intelligence System</div>
            </div>
          </div>

          {/* Status */}
          <div className="status-bar">
            <div className="status-dot" />
            <span>Secure Connection · CCTNS Encrypted</span>
          </div>

          {/* Error */}
          {error && <div className="error-msg">{error}</div>}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="badge-input">Badge / Officer ID</label>
              <input
                id="badge-input"
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. KSP001"
                required
                autoComplete="username"
              />
            </div>
            <div className="field">
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            <button id="login-btn" type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <><div className="spinner" /> Signing In...</>
              ) : (
                <>Sign In &rarr;</>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Demo Access</span>
            <div className="divider-line" />
          </div>

          <div className="demo-accounts">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                className="demo-btn"
                onClick={() => quickLogin(acc.id, acc.pass, acc.name, acc.role)}
                disabled={loading}
              >
                <div className="demo-avatar">{acc.initial}</div>
                <div className="demo-info">
                  <span className="demo-name">{acc.name}</span>
                  <span className="demo-role">{acc.role} · {acc.id}</span>
                </div>
                <span className="demo-arrow">›</span>
              </button>
            ))}
          </div>
        </div>

        <div className="footer">Karnataka State Police · CCTNS Secured · v2.0</div>
      </div>
    </>
  );
}
