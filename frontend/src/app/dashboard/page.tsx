"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const kpis = [
  { label: "Total FIRs",       value: "48,234", change: "+5.2%",  up: true,  color: "#2563eb" },
  { label: "Open Cases",       value: "12,891", change: "−3.1%",  up: false, color: "#2563eb" },
  { label: "Solved",           value: "35,343", change: "+12.4%", up: true,  color: "#0284c7" },
  { label: "Clearance Rate",   value: "73.3%",  change: "+2.1%",  up: true,  color: "#6366f1" },
  { label: "Cybercrime YTD",   value: "8,921",  change: "+34.1%", up: false, color: "#dc2626" },
  { label: "Arrests YTD",      value: "19,876", change: "+8.7%",  up: true,  color: "#0284c7" },
  { label: "Missing Persons",  value: "234",    change: "−12.0%", up: true,  color: "#475569" },
  { label: "AI Queries Today", value: "1,204",  change: "+45.0%", up: true,  color: "#2563eb" },
];

const categories = [
  { label: "Cybercrime",    count: 8921, color: "#2563eb" },
  { label: "Assault",       count: 7234, color: "#dc2626" },
  { label: "Vehicle Theft", count: 6789, color: "#0284c7" },
  { label: "Robbery",       count: 5432, color: "#475569" },
  { label: "Burglary",      count: 4123, color: "#6366f1" },
  { label: "Narcotics",     count: 3456, color: "#0891b2" },
];

const cases = [
  { fir: "CR-045/2024", category: "Robbery",    location: "Koramangala 5th Block",  status: "open",          urgency: 0.87, officer: "SI Priya" },
  { fir: "CR-089/2024", category: "Cybercrime", location: "Whitefield IT Park",     status: "investigation", urgency: 0.72, officer: "Insp Ramesh" },
  { fir: "CR-112/2023", category: "Murder",     location: "Mysore Road Junction",   status: "chargesheeted", urgency: 0.95, officer: "Insp Ramesh" },
  { fir: "CR-034/2024", category: "Narcotics",  location: "KR Market Hub",          status: "open",          urgency: 0.81, officer: "SI Priya" },
  { fir: "CR-156/2024", category: "Burglary",   location: "Jayanagar 4th Block",    status: "open",          urgency: 0.55, officer: "PSI Arjun" },
];

const alerts = [
  { level: "high",   msg: "BOLO: Ravi Kumar S (KSP-CR-2024-0001) — Repeat offender absconding near Shivajinagar.", time: "2m ago" },
  { level: "medium", msg: "Cybercrime Surge: 34% increase in UPI spoofing in Bangalore East.", time: "15m ago" },
  { level: "low",    msg: "Missing Child Matched: CCTV witness linked to Case CR-078/2024.", time: "1h ago" },
];

const modules = [
  { label: "PoliceGPT Chat",       desc: "Natural language crime queries",   href: "/dashboard/chat",      color: "#2563eb" },
  { label: "FIR Database",         desc: "Search and filter case files",      href: "/dashboard/cases",     color: "#0284c7" },
  { label: "Crime Analytics",      desc: "Heatmaps and trend predictions",    href: "/dashboard/analytics", color: "#6366f1" },
  { label: "Knowledge Graph",      desc: "Suspect network relationships",     href: "/dashboard/graph",     color: "#475569" },
  { label: "Investigation Reports",desc: "Auto-generate case dossiers",       href: "/dashboard/reports",   color: "#0891b2" },
];

const statusColor: Record<string, string> = {
  open: "#dc2626",
  investigation: "#2563eb",
  chargesheeted: "#0284c7",
  closed: "#475569",
};

const maxCount = Math.max(...categories.map((c) => c.count));

export default function DashboardPage() {
  const [time, setTime] = useState("");
  const [officer, setOfficer] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("pgpt_officer");
    if (data) setOfficer(JSON.parse(data));
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { timeStyle: "medium", timeZone: "Asia/Kolkata" }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const firstName = officer?.name?.split(" ").at(-1) ?? "Officer";

  return (
    <>
      <style>{`
        .db-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #f1f5f9;
        }

        /* Page header */
        .page-hdr {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
        }
        .page-hdr h1 {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 40%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .page-hdr p {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 0.2rem;
          font-weight: 500;
        }
        .page-time {
          font-size: 0.72rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          color: #818cf8;
          letter-spacing: 0.06em;
          white-space: nowrap;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.05);
        }

        /* Alerts */
        .alerts { display: flex; flex-direction: column; gap: 0.5rem; }
        .alert-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1.1rem;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.8rem;
          line-height: 1.5;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: transform 0.2s ease;
        }
        .alert-row:hover {
          transform: translateX(2px);
        }
        .alert-row.high {
          background: rgba(239, 68, 68, 0.06);
          border-color: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.05);
        }
        .alert-row.medium {
          background: rgba(59, 91, 255, 0.06);
          border-color: rgba(59, 91, 255, 0.25);
          color: #93c5fd;
          box-shadow: 0 4px 15px rgba(59, 91, 255, 0.05);
        }
        .alert-row.low {
          background: rgba(15, 23, 42, 0.4);
          border-color: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
        }
        .alert-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .alert-dot.high   { background: #ef4444; box-shadow: 0 0 10px #ef4444; }
        .alert-dot.medium { background: #3b5bff; box-shadow: 0 0 10px #3b5bff; }
        .alert-dot.low    { background: #64748b; }
        .alert-time { font-size: 0.68rem; font-family: 'JetBrains Mono', monospace; color: #475569; flex-shrink: 0; margin-left: auto; padding-left: 0.5rem; }

        /* KPI grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.85rem;
        }
        @media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }

        .kpi-card {
          background: var(--bg-panel);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.02);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .kpi-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(59, 91, 255, 0.03);
        }
        .kpi-top { display: flex; align-items: center; justify-content: space-between; }
        .kpi-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .kpi-badge {
          font-size: 0.65rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          border: 1px solid;
        }
        .kpi-badge.up   { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.25); color: #4ade80; }
        .kpi-badge.down { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.25); color: #f87171; }
        .kpi-value {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.045em;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
        }
        .kpi-label { font-size: 0.72rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }

        /* Two col section */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 0.85rem;
        }
        @media (max-width: 1100px) { .two-col { grid-template-columns: 1fr; } }

        /* Panel */
        .panel {
          background: var(--bg-panel);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
        }
        .panel-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .panel-sub { font-size: 0.72rem; color: #64748b; margin-bottom: 1.5rem; font-weight: 500; }

        /* Bar chart */
        .bar-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.85rem; }
        .bar-row:last-child { margin-bottom: 0; }
        .bar-label { font-size: 0.78rem; color: #cbd5e1; width: 110px; flex-shrink: 0; font-weight: 600; }
        .bar-track {
          flex: 1; height: 6px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 99px;
          overflow: hidden;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }
        .bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease-out; }
        .bar-count { font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: #94a3b8; width: 50px; text-align: right; flex-shrink: 0; font-weight: 700; }

        /* Modules */
        .module-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .module-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0.95rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.01);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .module-link:hover {
          background: rgba(59, 91, 255, 0.05);
          border-color: var(--border-hover);
          transform: scale(1.01);
        }
        .module-link-name { font-size: 0.825rem; font-weight: 700; color: #f1f5f9; display: block; }
        .module-link-desc { font-size: 0.7rem; color: #64748b; display: block; margin-top: 2px; font-weight: 500; }
        .module-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        /* Cases table */
        .cases-table { width: 100%; border-collapse: collapse; }
        .cases-table thead th {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          padding: 0 0.85rem 0.85rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .cases-table tbody td {
          font-size: 0.8rem;
          padding: 0.85rem;
          border-bottom: 1px solid rgba(255,255,255,0.02);
          vertical-align: middle;
          color: #e2e8f0;
        }
        .cases-table tbody tr:last-child td { border-bottom: none; }
        .cases-table tbody tr { transition: background 0.15s ease; }
        .cases-table tbody tr:hover td { background: rgba(59, 91, 255, 0.03); }

        .fir-link { font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #818cf8; font-size: 0.8rem; text-decoration: none; transition: color 0.15s ease; }
        .fir-link:hover { color: #a5b4fc; }
        .status-pill {
          font-size: 0.65rem;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          border: 1px solid;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .urgency-bar { display: flex; align-items: center; gap: 0.6rem; }
        .urg-track { width: 80px; height: 5px; background: rgba(255,255,255,0.04); border-radius: 99px; overflow: hidden; flex-shrink: 0; }
        .urg-fill { height: 100%; border-radius: 99px; }
        .urg-val { font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; color: #94a3b8; font-weight: 700; }

        .loc-text { color: #64748b; font-size: 0.8rem; font-weight: 500; }
        .cat-text { color: #cbd5e1; font-weight: 600; }
        .off-text { color: #cbd5e1; font-size: 0.8rem; }

        .cases-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .view-all { font-size: 0.75rem; color: #3b5bff; text-decoration: none; font-weight: 700; transition: color 0.15s ease; }
        .view-all:hover { color: #60a5fa; }
      `}</style>

      <div className="db-page">
        {/* Header */}
        <div className="page-hdr">
          <div>
            <h1>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {firstName}.</h1>
            <p>Karnataka State Police · Operations Overview</p>
          </div>
          <span className="page-time">{time} IST</span>
        </div>

        {/* Alerts */}
        <div className="alerts">
          {alerts.map((a, i) => (
            <div key={i} className={`alert-row ${a.level}`}>
              <div className={`alert-dot ${a.level}`} />
              <span>{a.msg}</span>
              <span className="alert-time">{a.time}</span>
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="kpi-grid">
          {kpis.map((k) => (
            <div key={k.label} className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon" style={{ background: `${k.color}12`, border: `1px solid ${k.color}22` }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: k.color, opacity: 0.8 }} />
                </div>
                <span className={`kpi-badge ${k.up ? "up" : "down"}`}>{k.change}</span>
              </div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Charts + Modules */}
        <div className="two-col">
          <div className="panel">
            <div className="panel-title">Crime Categories — 2024 YTD</div>
            <div className="panel-sub">Breakdown of reported offenses</div>
            {categories.map((c) => (
              <div key={c.label} className="bar-row">
                <span className="bar-label">{c.label}</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(c.count / maxCount) * 100}%`, background: c.color }} />
                </div>
                <span className="bar-count">{c.count.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-title">Quick Access</div>
            <div className="panel-sub">Intelligence modules</div>
            <div className="module-list">
              {modules.map((m) => (
                <Link key={m.href} href={m.href} className="module-link">
                  <div className="module-link-left">
                    <span className="module-link-name">{m.label}</span>
                    <span className="module-link-desc">{m.desc}</span>
                  </div>
                  <div className="module-dot" style={{ background: m.color }} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Cases table */}
        <div className="panel">
          <div className="cases-hdr">
            <div>
              <div className="panel-title">High-Priority Active Cases</div>
              <div className="panel-sub" style={{ margin: 0 }}>Cases requiring urgent investigation</div>
            </div>
            <Link href="/dashboard/cases" className="view-all">View all FIRs →</Link>
          </div>
          <table className="cases-table">
            <thead>
              <tr>
                <th>FIR</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>AI Urgency</th>
                <th>Officer</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.fir}>
                  <td><Link href="/dashboard/cases" className="fir-link">{c.fir}</Link></td>
                  <td><span className="cat-text">{c.category}</span></td>
                  <td><span className="loc-text">{c.location}</span></td>
                  <td>
                    <span className="status-pill" style={{
                      color: statusColor[c.status] ?? "#6b7588",
                      background: `${statusColor[c.status] ?? "#6b7588"}12`,
                      borderColor: `${statusColor[c.status] ?? "#6b7588"}22`,
                    }}>
                      {c.status === "investigation" ? "Investigating" : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="urgency-bar">
                      <div className="urg-track">
                        <div className="urg-fill" style={{
                          width: `${c.urgency * 100}%`,
                          background: c.urgency > 0.8 ? "#dc2626" : c.urgency > 0.6 ? "#2563eb" : "#0284c7",
                        }} />
                      </div>
                      <span className="urg-val">{Math.round(c.urgency * 100)}%</span>
                    </div>
                  </td>
                  <td><span className="off-text">{c.officer}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
