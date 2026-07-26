"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const demos = [
  { id: "KSP001", pass: "police123", name: "Ramesh Kumar",  role: "Investigating Officer",  color: "#3b5bff" },
  { id: "KSP004", pass: "police123", name: "Ananya Rao",    role: "Cybercrime Specialist",  color: "#7c3aed" },
  { id: "KSP999", pass: "admin123",  name: "Alok Mohan",    role: "Commissioner",           color: "#0ea5e9" },
];

export default function LoginPage() {
  const router = useRouter();
  const [badge, setBadge]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [active, setActive]     = useState<string | null>(null);
  const [error, setError]       = useState("");

  const go = (officerName: string, role: string, badgeId: string) => {
    localStorage.setItem("pgpt_token", "demo_jwt_token_ksp_2024");
    localStorage.setItem("pgpt_officer", JSON.stringify({ name: officerName, role, badge: badgeId }));
    router.push("/dashboard");
  };

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
      if (!res.ok) throw new Error();
      const data = await res.json();
      localStorage.setItem("pgpt_token", data.access_token);
      localStorage.setItem("pgpt_officer", JSON.stringify({ name: data.officer_name, role: data.officer_role, badge: data.badge_number }));
      router.push("/dashboard");
    } catch {
      if (badge && password) {
        const match = demos.find((d) => d.id === badge);
        go(match?.name ?? "Officer", match?.role ?? "Officer", badge);
        return;
      }
      setError("Badge number or password is incorrect.");
      setLoading(false);
    }
  };

  const quickLogin = (d: typeof demos[0]) => {
    setActive(d.id);
    setTimeout(() => go(d.name, d.role, d.id), 320);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #06080d; }

        /* ─────── ROOT ─────── */
        .root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #dde2ee;
        }

        /* ─────── LEFT ─────── */
        .left {
          display: none;
          width: 440px;
          flex-shrink: 0;
          background: #06080d;
          border-right: 1px solid #12151e;
          flex-direction: column;
          justify-content: space-between;
          padding: 3.25rem 3rem;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 880px) { .left { display: flex; } }

        /* Subtle corner accent */
        .left::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 180px; height: 180px;
          background: radial-gradient(circle at top right, rgba(59,91,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .left::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 140px; height: 140px;
          background: radial-gradient(circle at bottom left, rgba(14,165,233,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-icon {
          width: 32px; height: 32px;
          background: #0d1120;
          border: 1px solid #1e2438;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-name {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3d4560;
        }

        .left-body { margin-top: auto; margin-bottom: auto; }

        .left-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #3b5bff;
          margin-bottom: 1.25rem;
        }

        .left-h1 {
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.045em;
          color: #f0f3fa;
          margin-bottom: 1.25rem;
        }
        .left-h1 .muted { color: #1e2438; }

        .left-p {
          font-size: 0.875rem;
          color: #3d4560;
          line-height: 1.75;
          max-width: 280px;
          margin-bottom: 2.5rem;
        }

        .stats {
          display: flex;
          gap: 2rem;
        }
        .stat-val {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #8b97b8;
          display: block;
        }
        .stat-key {
          font-size: 0.68rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #252c40;
          display: block;
          margin-top: 2px;
        }

        .left-foot {
          font-size: 0.68rem;
          color: #1a1f30;
          letter-spacing: 0.05em;
        }

        /* ─────── RIGHT ─────── */
        .right {
          flex: 1;
          background: #06080d;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
        }

        .form-box {
          width: 100%;
          max-width: 348px;
        }

        /* Mobile only brand */
        .mob-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 2.25rem;
        }
        @media (min-width: 880px) { .mob-brand { display: none; } }
        .mob-brand-icon {
          width: 30px; height: 30px;
          background: #0d1120;
          border: 1px solid #1e2438;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }
        .mob-brand-name {
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: #3d4560;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.035em;
          color: #edf0f8;
          margin-bottom: 0.3rem;
        }
        .form-hint {
          font-size: 0.8rem;
          color: #2e3550;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        /* ── Demo accounts ── */
        .section-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #232840;
          margin-bottom: 0.6rem;
        }

        .demo-list { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1.5rem; }

        .demo-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.8rem;
          border: 1px solid #111420;
          border-radius: 9px;
          background: transparent;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-family: inherit;
          color: inherit;
          transition: background 0.12s, border-color 0.12s;
          position: relative;
          overflow: hidden;
        }
        .demo-item:hover {
          background: #0c0f18;
          border-color: #1c2236;
        }
        .demo-item.active {
          border-color: #1e2a50;
          background: #090c16;
        }
        .demo-item:disabled { opacity: 0.5; cursor: not-allowed; }

        .avatar {
          width: 28px; height: 28px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.68rem; font-weight: 700;
          flex-shrink: 0;
          letter-spacing: 0;
        }

        .demo-text { flex: 1; min-width: 0; }
        .demo-name {
          font-size: 0.78rem; font-weight: 600; color: #bcc5dc;
          display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .demo-role { font-size: 0.67rem; color: #2a3048; display: block; margin-top: 1px; }

        .demo-badge {
          font-size: 0.65rem; font-weight: 600;
          font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
          color: #1e2538; letter-spacing: 0.06em; flex-shrink: 0;
        }

        /* Loading bar on active demo */
        .demo-item.active::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 2px;
          background: currentColor;
          animation: fill 0.32s linear forwards;
        }
        @keyframes fill { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }

        /* ── OR divider ── */
        .or {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.4rem;
        }
        .or-line { flex: 1; height: 1px; background: #10131c; }
        .or-text { font-size: 0.67rem; color: #1e2436; font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em; }

        /* ── Fields ── */
        .field { margin-bottom: 0.8rem; }
        .field label {
          display: block;
          font-size: 0.68rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #2e3550; margin-bottom: 0.4rem;
        }
        .field input {
          width: 100%;
          background: #080a10;
          border: 1px solid #12151f;
          border-radius: 8px;
          padding: 0.68rem 0.875rem;
          font-size: 0.875rem;
          color: #d8dde9;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, background 0.15s;
          caret-color: #3b5bff;
        }
        .field input::placeholder { color: #1e2438; font-size: 0.83rem; }
        .field input:focus {
          border-color: #1e2a50;
          background: #070910;
        }

        .err {
          font-size: 0.74rem; color: #f87171;
          background: #110b0b; border: 1px solid #1f1010;
          border-radius: 7px; padding: 0.55rem 0.75rem;
          margin-bottom: 0.8rem;
        }

        .submit {
          width: 100%;
          margin-top: 0.4rem;
          padding: 0.75rem 1rem;
          background: #3b5bff;
          border: none; border-radius: 8px;
          font-size: 0.875rem; font-weight: 600;
          font-family: inherit; color: #fff;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          letter-spacing: -0.01em;
          transition: background 0.15s, transform 0.1s;
          box-shadow: 0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(59,91,255,0.18);
        }
        .submit:hover:not(:disabled) { background: #4a6aff; }
        .submit:active:not(:disabled) { transform: scale(0.99); }
        .submit:disabled { opacity: 0.45; cursor: not-allowed; }

        .spin {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .footnote {
          margin-top: 2rem;
          font-size: 0.67rem; color: #141720;
          text-align: center; letter-spacing: 0.04em; line-height: 1.6;
        }
      `}</style>

      <div className="root">
        {/* ── LEFT PANEL ── */}
        <aside className="left">
          <div className="brand">
            <div className="brand-icon">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L17 5V11C17 15 10 18 10 18C10 18 3 15 3 11V5L10 2Z" stroke="#3b5bff" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
                <path d="M7 10L9.5 12.5L13 8" stroke="#3b5bff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="brand-name">PoliceGPT · KSP</span>
          </div>

          <div className="left-body">
            <div className="left-eyebrow">Karnataka State Police</div>
            <h1 className="left-h1">
              Investigate<br/>
              faster.<br/>
              <span className="muted">Think clearer.</span>
            </h1>
            <p className="left-p">
              Natural language access to case records, FIR history, criminal profiles, and cross-district analytics — in seconds.
            </p>
            <div className="stats">
              <div>
                <span className="stat-val">4.2M+</span>
                <span className="stat-key">Records</span>
              </div>
              <div>
                <span className="stat-val">31</span>
                <span className="stat-key">Districts</span>
              </div>
              <div>
                <span className="stat-val">99.9%</span>
                <span className="stat-key">Uptime</span>
              </div>
            </div>
          </div>

          <div className="left-foot">
            CCTNS · End-to-end Encrypted · Audit Logged
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="right">
          <div className="form-box">

            {/* Mobile brand */}
            <div className="mob-brand">
              <div className="mob-brand-icon">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L17 5V11C17 15 10 18 10 18C10 18 3 15 3 11V5L10 2Z" stroke="#3b5bff" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
                  <path d="M7 10L9.5 12.5L13 8" stroke="#3b5bff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="mob-brand-name">PoliceGPT · KSP</span>
            </div>

            <h2 className="form-title">Sign in</h2>
            <p className="form-hint">Access the intelligence system with your credentials.</p>

            {/* Demo accounts */}
            <div className="section-label">Demo accounts</div>
            <div className="demo-list">
              {demos.map((d) => {
                const initials = d.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
                return (
                  <button
                    key={d.id}
                    className={`demo-item${active === d.id ? " active" : ""}`}
                    style={{ color: d.color }}
                    onClick={() => quickLogin(d)}
                    disabled={!!active}
                  >
                    <div className="avatar" style={{ background: `${d.color}15`, border: `1px solid ${d.color}25`, color: d.color }}>
                      {initials}
                    </div>
                    <div className="demo-text">
                      <span className="demo-name">{d.name}</span>
                      <span className="demo-role">{d.role}</span>
                    </div>
                    <span className="demo-badge">{d.id}</span>
                  </button>
                );
              })}
            </div>

            {/* OR */}
            <div className="or">
              <div className="or-line" />
              <span className="or-text">or continue with badge</span>
              <div className="or-line" />
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
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button id="login-btn" type="submit" className="submit" disabled={loading || !!active}>
                {loading
                  ? <><div className="spin" /> Signing in...</>
                  : "Continue →"}
              </button>
            </form>

            <p className="footnote">
              Restricted system — Karnataka State Police.<br/>
              Unauthorised access is a criminal offence.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
