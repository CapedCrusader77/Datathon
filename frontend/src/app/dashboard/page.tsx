"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const kpis = [
  { label: "Total FIRs",       value: "48,234", change: "+5.2%",  up: true,  color: "#3b5bff" },
  { label: "Open Cases",       value: "12,891", change: "−3.1%",  up: false, color: "#f59e0b" },
  { label: "Solved",           value: "35,343", change: "+12.4%", up: true,  color: "#22c55e" },
  { label: "Clearance Rate",   value: "73.3%",  change: "+2.1%",  up: true,  color: "#8b5cf6" },
  { label: "Cybercrime YTD",   value: "8,921",  change: "+34.1%", up: false, color: "#ef4444" },
  { label: "Arrests YTD",      value: "19,876", change: "+8.7%",  up: true,  color: "#0ea5e9" },
  { label: "Missing Persons",  value: "234",    change: "−12.0%", up: true,  color: "#22c55e" },
  { label: "AI Queries Today", value: "1,204",  change: "+45.0%", up: true,  color: "#6366f1" },
];

const categories = [
  { label: "Cybercrime",    count: 8921, color: "#6366f1" },
  { label: "Assault",       count: 7234, color: "#ef4444" },
  { label: "Vehicle Theft", count: 6789, color: "#3b5bff" },
  { label: "Robbery",       count: 5432, color: "#f59e0b" },
  { label: "Burglary",      count: 4123, color: "#8b5cf6" },
  { label: "Narcotics",     count: 3456, color: "#22c55e" },
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
  { label: "PoliceGPT Chat",       desc: "Natural language crime queries",   href: "/dashboard/chat",      color: "#3b5bff" },
  { label: "FIR Database",         desc: "Search and filter case files",      href: "/dashboard/cases",     color: "#22c55e" },
  { label: "Crime Analytics",      desc: "Heatmaps and trend predictions",    href: "/dashboard/analytics", color: "#f59e0b" },
  { label: "Knowledge Graph",      desc: "Suspect network relationships",     href: "/dashboard/graph",     color: "#8b5cf6" },
  { label: "Investigation Reports",desc: "Auto-generate case dossiers",       href: "/dashboard/reports",   color: "#0ea5e9" },
];

const statusColor: Record<string, string> = {
  open: "#ef4444",
  investigation: "#f59e0b",
  chargesheeted: "#3b5bff",
  closed: "#22c55e",
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
          gap: 1.5rem;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          color: #c8cdd8;
        }

        /* Page header */
        .page-hdr {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
        }
        .page-hdr h1 {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #dde2ee;
        }
        .page-hdr p {
          font-size: 0.75rem;
          color: #2e3550;
          margin-top: 0.2rem;
        }
        .page-time {
          font-size: 0.72rem;
          font-weight: 600;
          font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
          color: #2a3048;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        /* Alerts */
        .alerts { display: flex; flex-direction: column; gap: 0.35rem; }
        .alert-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.875rem;
          border-radius: 8px;
          border: 1px solid;
          font-size: 0.78rem;
          line-height: 1.5;
        }
        .alert-row.high   { background: #110b0b; border-color: #2e1515; color: #f87171; }
        .alert-row.medium { background: #0f0d08; border-color: #2a220e; color: #fbbf24; }
        .alert-row.low    { background: #08100e; border-color: #0e2218; color: #6b7588; }
        .alert-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .alert-dot.high   { background: #ef4444; }
        .alert-dot.medium { background: #f59e0b; }
        .alert-dot.low    { background: #3a4256; }
        .alert-time { font-size: 0.65rem; font-family: monospace; color: #2a3048; flex-shrink: 0; margin-left: auto; padding-left: 0.5rem; }

        /* KPI grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }
        @media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }

        .kpi-card {
          background: #080a10;
          border: 1px solid #111420;
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .kpi-top { display: flex; align-items: center; justify-content: space-between; }
        .kpi-icon {
          width: 30px; height: 30px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }
        .kpi-badge {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          border: 1px solid;
        }
        .kpi-badge.up   { background: rgba(34,197,94,0.08);  border-color: rgba(34,197,94,0.15);  color: #4ade80; }
        .kpi-badge.down { background: rgba(239,68,68,0.08);   border-color: rgba(239,68,68,0.15);   color: #f87171; }
        .kpi-value {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #dde2ee;
        }
        .kpi-label { font-size: 0.72rem; color: #2e3550; }

        /* Two col section */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 0.75rem;
        }
        @media (max-width: 1100px) { .two-col { grid-template-columns: 1fr; } }

        /* Panel */
        .panel {
          background: #080a10;
          border: 1px solid #111420;
          border-radius: 10px;
          padding: 1.25rem;
        }
        .panel-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: #8b97b8;
          margin-bottom: 0.25rem;
          letter-spacing: -0.01em;
        }
        .panel-sub { font-size: 0.7rem; color: #2a3048; margin-bottom: 1.25rem; }

        /* Bar chart */
        .bar-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .bar-row:last-child { margin-bottom: 0; }
        .bar-label { font-size: 0.75rem; color: #4a5470; width: 100px; flex-shrink: 0; }
        .bar-track {
          flex: 1; height: 5px;
          background: #0c0f18;
          border-radius: 99px;
          overflow: hidden;
        }
        .bar-fill { height: 100%; border-radius: 99px; }
        .bar-count { font-size: 0.7rem; font-family: monospace; color: #3a4256; width: 46px; text-align: right; flex-shrink: 0; }

        /* Modules */
        .module-list { display: flex; flex-direction: column; gap: 0.35rem; }
        .module-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.75rem;
          border: 1px solid #0d1018;
          border-radius: 8px;
          text-decoration: none;
          background: transparent;
          transition: background 0.12s, border-color 0.12s;
          cursor: pointer;
        }
        .module-link:hover { background: #0c0f18; border-color: #171b26; }
        .module-link-left {}
        .module-link-name { font-size: 0.78rem; font-weight: 600; color: #8b97b8; display: block; }
        .module-link-desc { font-size: 0.67rem; color: #252c40; display: block; margin-top: 1px; }
        .module-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* Cases table */
        .cases-table { width: 100%; border-collapse: collapse; }
        .cases-table thead th {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1e2438;
          padding: 0 0.75rem 0.75rem;
          text-align: left;
          border-bottom: 1px solid #0d1018;
        }
        .cases-table tbody td {
          font-size: 0.78rem;
          padding: 0.65rem 0.75rem;
          border-bottom: 1px solid #0a0d14;
          vertical-align: middle;
        }
        .cases-table tbody tr:last-child td { border-bottom: none; }
        .cases-table tbody tr:hover td { background: #0c0f18; }

        .fir-link { font-family: monospace; font-weight: 700; color: #3b5bff; font-size: 0.75rem; text-decoration: none; }
        .fir-link:hover { color: #5b7bff; }
        .status-pill {
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid;
          white-space: nowrap;
        }

        .urgency-bar { display: flex; align-items: center; gap: 0.5rem; }
        .urg-track { width: 60px; height: 4px; background: #0c0f18; border-radius: 99px; overflow: hidden; flex-shrink: 0; }
        .urg-fill { height: 100%; border-radius: 99px; }
        .urg-val { font-size: 0.68rem; font-family: monospace; color: #3a4256; }

        .loc-text { color: #3a4256; }
        .cat-text { color: #8b97b8; font-weight: 500; }
        .off-text { color: #4a5470; }

        .cases-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .view-all { font-size: 0.72rem; color: #2a3560; text-decoration: none; font-weight: 600; }
        .view-all:hover { color: #3b5bff; }
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
                          background: c.urgency > 0.8 ? "#ef4444" : c.urgency > 0.6 ? "#f59e0b" : "#22c55e",
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
