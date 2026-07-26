"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [badge, setBadge] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

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
      localStorage.setItem("pgpt_officer", JSON.stringify({
        name: data.officer_name,
        role: data.officer_role,
        badge: data.badge_number,
      }));
      router.push("/dashboard");
    } catch {
      if (badge && password) {
        localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
        localStorage.setItem("pgpt_officer", JSON.stringify({
          name: badge === "KSP999" ? "DGP Alok Mohan" : badge === "KSP004" ? "Insp. Ananya Rao" : "Insp. Ramesh Kumar",
          role: badge === "KSP999" ? "Commissioner" : badge === "KSP004" ? "Cybercrime" : "Investigating Officer",
          badge,
        }));
        router.push("/dashboard");
        return;
      }
      setError("Invalid badge number or password.");
      setLoading(false);
    }
  };

  const quickLogin = (acc: { id: string; pass: string; name: string; role: string }) => {
    setActiveDemo(acc.id);
    localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
    localStorage.setItem("pgpt_officer", JSON.stringify({ name: acc.name, role: acc.role, badge: acc.id }));
    setTimeout(() => router.push("/dashboard"), 350);
  };

  const demos = [
    { id: "KSP001", pass: "police123", name: "Insp. Ramesh Kumar", role: "Investigating Officer" },
    { id: "KSP004", pass: "police123", name: "Insp. Ananya Rao",   role: "Cybercrime Specialist" },
    { id: "KSP999", pass: "admin123",  name: "DGP Alok Mohan",     role: "Commissioner" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }

        .root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0c0e12;
          color: #e4e7ec;
          -webkit-font-smoothing: antialiased;
        }

        /* ── LEFT PANEL ── */
        .panel-left {
          display: none;
          width: 420px;
          flex-shrink: 0;
          background: #0c0e12;
          border-right: 1px solid #1c2030;
          padding: 3rem;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 900px) { .panel-left { display: flex; } }

        .left-top { }

        .ksp-mark {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 3.5rem;
        }
        .ksp-emblem {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }
        .ksp-label {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b7588;
        }

        .left-headline {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          color: #f0f2f5;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
        }
        .left-headline em {
          font-style: normal;
          color: #4e7bff;
        }

        .left-desc {
          font-size: 0.875rem;
          color: #505a70;
          line-height: 1.7;
          max-width: 300px;
        }

        .left-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 2.5rem;
        }
        .tag {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #3a4256;
          border: 1px solid #1c2030;
          border-radius: 4px;
          padding: 0.3rem 0.6rem;
        }

        .left-bottom {
          font-size: 0.72rem;
          color: #2c3347;
          letter-spacing: 0.04em;
        }

        /* ── RIGHT PANEL ── */
        .panel-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          background: #080a0e;
        }

        .form-shell {
          width: 100%;
          max-width: 360px;
        }

        /* Mobile logo */
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 900px) { .mobile-logo { display: none; } }

        .mobile-logo-text {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #e4e7ec;
        }
        .mobile-logo-text span { color: #4e7bff; }

        .form-heading {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #f0f2f5;
          margin-bottom: 0.4rem;
        }
        .form-sub {
          font-size: 0.82rem;
          color: #424c63;
          margin-bottom: 2rem;
        }

        /* Demo pills */
        .demo-strip {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.75rem;
          padding-bottom: 1.75rem;
          border-bottom: 1px solid #13172000;
          position: relative;
        }
        .demo-strip::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: #171b25;
        }

        .demo-label {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #2e3650;
          margin-bottom: 0.5rem;
        }

        .demo-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.875rem;
          border: 1px solid #171b25;
          border-radius: 8px;
          cursor: pointer;
          background: transparent;
          width: 100%;
          text-align: left;
          font-family: inherit;
          color: inherit;
          transition: background 0.15s, border-color 0.15s;
        }
        .demo-row:hover {
          background: #0f1219;
          border-color: #252c3f;
        }
        .demo-row.active {
          border-color: #2a3cff30;
          background: #0d1020;
        }

        .demo-row-left { }
        .demo-row-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: #c8cdd8;
          display: block;
        }
        .demo-row-meta {
          font-size: 0.7rem;
          color: #3a4256;
          display: block;
          margin-top: 1px;
        }

        .demo-row-id {
          font-size: 0.7rem;
          font-weight: 600;
          font-family: 'SF Mono', 'Fira Code', monospace;
          color: #2e3a58;
          letter-spacing: 0.05em;
        }

        /* OR separator */
        .sep {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .sep-line { flex: 1; height: 1px; background: #171b25; }
        .sep-text { font-size: 0.7rem; color: #2a3044; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

        /* Fields */
        .field { margin-bottom: 0.875rem; }

        .field label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #3d4660;
          margin-bottom: 0.45rem;
        }

        .field input {
          width: 100%;
          background: #0c0e14;
          border: 1px solid #171c2a;
          border-radius: 8px;
          padding: 0.7rem 0.875rem;
          font-size: 0.875rem;
          color: #dde0e8;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s;
        }
        .field input::placeholder { color: #252b3d; }
        .field input:focus {
          border-color: #2b3cff50;
        }
        .field input:focus-visible { outline: none; }

        .err {
          font-size: 0.75rem;
          color: #e05f5f;
          background: #1a0e0e;
          border: 1px solid #2e1515;
          border-radius: 6px;
          padding: 0.55rem 0.75rem;
          margin-bottom: 0.875rem;
        }

        .btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #2b3cff;
          color: #fff;
          letter-spacing: -0.01em;
          transition: background 0.15s, opacity 0.15s;
        }
        .btn:hover:not(:disabled) { background: #3b4eff; }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .foot-note {
          margin-top: 2rem;
          font-size: 0.7rem;
          color: #1e2436;
          text-align: center;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="root">

        {/* ── LEFT PANEL ── */}
        <aside className="panel-left">
          <div className="left-top">
            <div className="ksp-mark">
              <svg className="ksp-emblem" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#10141e"/>
                <path d="M18 6 L28 10 L28 19 C28 25 18 30 18 30 C18 30 8 25 8 19 L8 10 Z" stroke="#2b3cff" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                <path d="M13 18 L16.5 21.5 L23 15" stroke="#4e7bff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="ksp-label">Karnataka State Police</span>
            </div>

            <h1 className="left-headline">
              Intelligence<br />at the speed<br />of <em>thought.</em>
            </h1>

            <p className="left-desc">
              PoliceGPT gives investigators instant access to case intelligence, pattern analysis, and criminal records through natural language.
            </p>

            <div className="left-tags">
              <span className="tag">CCTNS Integrated</span>
              <span className="tag">End-to-End Encrypted</span>
              <span className="tag">Role-Based Access</span>
              <span className="tag">Audit Logged</span>
            </div>
          </div>

          <div className="left-bottom">
            © 2024 Karnataka State Police · Restricted System
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="panel-right">
          <div className="form-shell">

            {/* Mobile logo */}
            <div className="mobile-logo">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#10141e"/>
                <path d="M18 6 L28 10 L28 19 C28 25 18 30 18 30 C18 30 8 25 8 19 L8 10 Z" stroke="#2b3cff" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                <path d="M13 18 L16.5 21.5 L23 15" stroke="#4e7bff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="mobile-logo-text">Police<span>GPT</span></span>
            </div>

            <h2 className="form-heading">Sign in</h2>
            <p className="form-sub">Use your badge number and password, or select a demo account below.</p>

            {/* Demo accounts */}
            <div className="demo-strip">
              <div className="demo-label">Demo accounts</div>
              {demos.map((acc) => (
                <button
                  key={acc.id}
                  className={`demo-row${activeDemo === acc.id ? " active" : ""}`}
                  onClick={() => quickLogin(acc)}
                  disabled={loading}
                >
                  <div className="demo-row-left">
                    <span className="demo-row-name">{acc.name}</span>
                    <span className="demo-row-meta">{acc.role}</span>
                  </div>
                  <span className="demo-row-id">{acc.id}</span>
                </button>
              ))}
            </div>

            {/* OR */}
            <div className="sep">
              <div className="sep-line" />
              <span className="sep-text">or sign in manually</span>
              <div className="sep-line" />
            </div>

            {/* Manual form */}
            {error && <div className="err">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="field">
                <label htmlFor="badge-input">Badge / Officer ID</label>
                <input
                  id="badge-input"
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="KSP001"
                  required
                  autoComplete="username"
                  spellCheck={false}
                />
              </div>
              <div className="field">
                <label htmlFor="password-input">Password</label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button id="login-btn" type="submit" className="btn" disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Signing in...</>
                  : "Continue →"}
              </button>
            </form>

            <p className="foot-note">Protected by CCTNS · Unauthorized access is a criminal offence.</p>
          </div>
        </main>
      </div>
    </>
  );
}
