"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const kpis = [
  { label: "Total Cases",      value: "48,234", change: "+5.2%",  up: true,  color: "#3b5bff" },
  { label: "Active Inquiries", value: "12,891", change: "−3.1%",  up: false, color: "#f59e0b" },
  { label: "Solved (YTD)",     value: "35,343", change: "+12.4%", up: true,  color: "#22c55e" },
  { label: "Clearance Rate",   value: "73.3%",  change: "+2.1%",  up: true,  color: "#8b5cf6" },
];

const categories = [
  { label: "Cybercrime",    count: 8921, color: "#3b5bff", percentage: 78 },
  { label: "Assault",       count: 7234, color: "#ef4444", percentage: 65 },
  { label: "Vehicle Theft", count: 6789, color: "#f59e0b", percentage: 60 },
  { label: "Robbery",       count: 5432, color: "#8b5cf6", percentage: 48 },
  { label: "Narcotics",     count: 3456, color: "#22c55e", percentage: 31 },
];

const cases = [
  { fir: "CR-045/2024", category: "Robbery",    location: "Koramangala 5th Block",  status: "open",          urgency: 87, officer: "SI Priya" },
  { fir: "CR-089/2024", category: "Cybercrime", location: "Whitefield IT Park",     status: "investigating", urgency: 72, officer: "Insp Ramesh" },
  { fir: "CR-112/2023", category: "Murder",     location: "Mysore Road Junction",   status: "chargesheet",   urgency: 95, officer: "Insp Ramesh" },
  { fir: "CR-034/2024", category: "Narcotics",  location: "KR Market Hub",          status: "open",          urgency: 81, officer: "SI Priya" },
];

const alerts = [
  { level: "critical", msg: "BOLO: Ravi Kumar S (KSP-CR-2024-0001) — Repeat offender absconding near Shivajinagar.", time: "2m ago" },
  { level: "warning",  msg: "Cybercrime Surge: 34% increase in UPI spoofing reports in Bangalore East.", time: "15m ago" },
];

const modules = [
  { label: "PoliceGPT AI Chat",    desc: "Natural language query engine",     href: "/dashboard/chat",      color: "#3b5bff" },
  { label: "FIR Database Search",  desc: "CCTNS crime record registry",      href: "/dashboard/cases",     color: "#22c55e" },
  { label: "Crime Analytics Maps", desc: "Predictive hot-spots & modeling",   href: "/dashboard/analytics", color: "#f59e0b" },
  { label: "Suspect Network Graph",desc: "Visual relationship network map",   href: "/dashboard/graph",     color: "#8b5cf6" },
];

const statusNames: Record<string, string> = {
  open: "Open Case",
  investigating: "In Progress",
  chargesheet: "Chargesheeted",
};

export default function DashboardPage() {
  const [time, setTime] = useState("");
  const [officer, setOfficer] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("pgpt_officer");
    if (data) setOfficer(JSON.parse(data));
    
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" }));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const officerLastName = officer?.name?.split(" ").at(-1) ?? "Officer";

  return (
    <>
      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          font-family: 'Inter', -apple-system, sans-serif;
          color: #c8cdd8;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── HEADER ── */
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #12151f;
          padding-bottom: 1.25rem;
        }
        .header-title h1 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }
        .header-title p {
          font-size: 0.78rem;
          color: #475569;
          margin-top: 0.25rem;
        }
        .header-meta {
          text-align: right;
        }
        .time-display {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.85rem;
          font-weight: 600;
          color: #3b5bff;
          letter-spacing: 0.05em;
        }
        .region-label {
          font-size: 0.65rem;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 0.2rem;
        }

        /* ── ALERTS ── */
        .alerts-feed {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .alert-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.78rem;
          line-height: 1.5;
          background: #080a0f;
          border: 1px solid #161b26;
        }
        .alert-card.critical {
          border-color: rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.02);
        }
        .alert-badge {
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .alert-badge.critical {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .alert-badge.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .alert-message {
          color: #94a3b8;
          flex: 1;
        }
        .alert-time {
          font-size: 0.68rem;
          color: #334155;
          font-family: monospace;
          margin-left: auto;
          padding-left: 0.75rem;
        }

        /* ── KPIS ── */
        .kpi-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }
        @media (max-width: 900px) {
          .kpi-row { grid-template-columns: repeat(2, 1fr); }
        }
        .kpi-box {
          background: #080a0f;
          border: 1px solid #12151f;
          border-radius: 8px;
          padding: 1.1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .kpi-label {
          font-size: 0.7rem;
          font-weight: 500;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .kpi-value-wrap {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .kpi-val {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.03em;
        }
        .kpi-trend {
          font-size: 0.68rem;
          font-weight: 600;
        }
        .kpi-trend.up { color: #10b981; }
        .kpi-trend.down { color: #f87171; }

        /* ── GRID LAYOUT ── */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.25rem;
        }
        @media (max-width: 980px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        .panel-box {
          background: #080a0f;
          border: 1px solid #12151f;
          border-radius: 8px;
          padding: 1.25rem;
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .panel-title {
          font-size: 0.82rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
        }
        .panel-link {
          font-size: 0.72rem;
          font-weight: 600;
          color: #3b5bff;
          text-decoration: none;
        }
        .panel-link:hover {
          color: #4e7bff;
        }

        /* ── CASES TABLE ── */
        .table-wrap {
          overflow-x: auto;
        }
        .clean-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .clean-table th {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #334155;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #12151f;
        }
        .clean-table td {
          font-size: 0.78rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid #0d0f17;
          color: #cbd5e1;
        }
        .clean-table tr:last-child td {
          border-bottom: none;
        }
        .fir-badge {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-weight: 700;
          color: #3b5bff;
          text-decoration: none;
        }
        .status-dot-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .status-indicator {
          width: 6px; height: 6px;
          border-radius: 50%;
        }
        .status-indicator.open { background: #f87171; }
        .status-indicator.investigating { background: #fbbf24; }
        .status-indicator.chargesheet { background: #3b5bff; }
        
        .progress-bar-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .progress-bg {
          width: 60px; height: 4px;
          background: #12151f;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
        }

        /* ── SIDE PANELS ── */
        .side-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Modus Operandi Bars */
        .mo-row {
          margin-bottom: 0.85rem;
        }
        .mo-row:last-child {
          margin-bottom: 0;
        }
        .mo-label-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.74rem;
          margin-bottom: 0.3rem;
        }
        .mo-name {
          color: #94a3b8;
          font-weight: 500;
        }
        .mo-count {
          color: #475569;
          font-size: 0.7rem;
        }
        .mo-bar-bg {
          width: 100%; height: 3px;
          background: #12151f;
          border-radius: 2px;
          overflow: hidden;
        }
        .mo-bar-fill {
          height: 100%;
          border-radius: 2px;
        }

        /* Module Navigation */
        .module-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .module-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: #0c0e14;
          border: 1px solid #12151f;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }
        .module-button:hover {
          background: #0f121b;
          border-color: #1e2433;
        }
        .module-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .module-name {
          font-size: 0.76rem;
          font-weight: 600;
          color: #cbd5e1;
        }
        .module-desc {
          font-size: 0.65rem;
          color: #475569;
        }
        .module-chevron {
          color: #3b5bff;
          font-size: 0.8rem;
          font-weight: 700;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Welcome back, Insp. {officerLastName}</h1>
            <p>Karnataka State Police Command Center Operations Room</p>
          </div>
          <div className="header-meta">
            <div className="time-display">{time}</div>
            <div className="region-label">HQ Control · Bengaluru</div>
          </div>
        </header>

        {/* Alerts */}
        <div className="alerts-feed">
          {alerts.map((a, i) => (
            <div key={i} className={`alert-card ${a.level}`}>
              <span className={`alert-badge ${a.level}`}>{a.level}</span>
              <span className="alert-message">{a.msg}</span>
              <span className="alert-time">{a.time}</span>
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="kpi-row">
          {kpis.map((k) => (
            <div key={k.label} className="kpi-box">
              <span className="kpi-label">{k.label}</span>
              <div className="kpi-value-wrap">
                <span className="kpi-val">{k.value}</span>
                <span className={`kpi-trend ${k.up ? "up" : "down"}`}>{k.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Columns */}
        <div className="main-grid">
          {/* Left Column: Case Priority Table */}
          <div className="panel-box">
            <div className="panel-header">
              <span className="panel-title">Priority Cases</span>
              <Link href="/dashboard/cases" className="panel-link">View All FIRs</Link>
            </div>
            <div className="table-wrap">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>FIR Reference</th>
                    <th>Category</th>
                    <th>Location Cluster</th>
                    <th>Status</th>
                    <th>Urgency Rating</th>
                    <th>Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.fir}>
                      <td>
                        <Link href="/dashboard/cases" className="fir-badge">{c.fir}</Link>
                      </td>
                      <td>{c.category}</td>
                      <td>{c.location}</td>
                      <td>
                        <div className="status-dot-label">
                          <div className={`status-indicator ${c.status}`} />
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                            {statusNames[c.status] || c.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="progress-bar-wrap">
                          <div className="progress-bg">
                            <div className="progress-fill" style={{
                              width: `${c.urgency}%`,
                              background: c.urgency > 85 ? "#f87171" : c.urgency > 70 ? "#fbbf24" : "#10b981"
                            }} />
                          </div>
                          <span className="urg-val" style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#64748b" }}>
                            {c.urgency}%
                          </span>
                        </div>
                      </td>
                      <td>{c.officer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: MO Statistics & Module Navigation */}
          <div className="side-stack">
            {/* MO bars */}
            <div className="panel-box">
              <span className="panel-title" style={{ display: "block", marginBottom: "1rem" }}>Modus Operandi Breakdown</span>
              <div>
                {categories.map((cat) => (
                  <div key={cat.label} className="mo-row">
                    <div className="mo-label-wrap">
                      <span className="mo-name">{cat.label}</span>
                      <span className="mo-count">{cat.count.toLocaleString()} cases</span>
                    </div>
                    <div className="mo-bar-bg">
                      <div className="mo-bar-fill" style={{
                        width: `${cat.percentage}%`,
                        background: cat.color
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Modules */}
            <div className="panel-box">
              <span className="panel-title" style={{ display: "block", marginBottom: "1rem" }}>System Navigation</span>
              <div className="module-grid">
                {modules.map((m) => (
                  <Link key={m.href} href={m.href} className="module-button">
                    <div className="module-info">
                      <span className="module-name">{m.label}</span>
                      <span className="module-desc">{m.desc}</span>
                    </div>
                    <span className="module-chevron">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
