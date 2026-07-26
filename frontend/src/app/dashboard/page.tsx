"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const kpiData = [
  { label: "Total FIRs 2024", value: "48,234", change: "+5.2%", color: "#3b82f6", trend: "up",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
  { label: "Active Open Cases", value: "12,891", change: "-3.1%", color: "#f59e0b", trend: "down",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
  },
  { label: "Solved Cases", value: "35,343", change: "+12.4%", color: "#10b981", trend: "up",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  },
  { label: "Clearance Rate", value: "73.3%", change: "+2.1%", color: "#8b5cf6", trend: "up",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  },
  { label: "Cybercrime YTD", value: "8,921", change: "+34.1%", color: "#ef4444", trend: "up",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
  },
  { label: "Arrests YTD", value: "19,876", change: "+8.7%", color: "#f97316", trend: "up",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  },
  { label: "Missing Persons", value: "234", change: "-12.0%", color: "#06b6d4", trend: "down",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  },
  { label: "AI Queries Today", value: "1,204", change: "+45.0%", color: "#6366f1", trend: "up",
    svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  },
];

const recentCases = [
  { fir: "CR-045/2024", category: "Robbery", location: "Koramangala 5th Block", status: "open", urgency: 0.87, officer: "SI Priya" },
  { fir: "CR-089/2024", category: "Cybercrime", location: "Whitefield IT Park", status: "investigation", urgency: 0.72, officer: "Insp Ramesh" },
  { fir: "CR-112/2023", category: "Murder", location: "Mysore Road Junction", status: "chargesheeted", urgency: 0.95, officer: "Insp Ramesh" },
  { fir: "CR-034/2024", category: "Narcotics", location: "KR Market Hub", status: "open", urgency: 0.81, officer: "SI Priya" },
  { fir: "CR-156/2024", category: "Burglary", location: "Jayanagar 4th Block", status: "open", urgency: 0.55, officer: "PSI Arjun" },
];

const alerts = [
  { type: "critical", msg: "BOLO: Ravi Kumar S (KSP-CR-2024-0001) — Repeat offender absconding. Last traced near Shivajinagar.", time: "2 min ago" },
  { type: "warning", msg: "Cybercrime Surge: 34% increase in UPI spoofing in Bangalore East. Alert all station chiefs.", time: "15 min ago" },
  { type: "info", msg: "Missing Child Matched: CCTV witness data linked to Case CR-078/2024. Dispatch officer immediately.", time: "1 hr ago" },
];

function KPICard({ data, index }: { data: typeof kpiData[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div className={`kpi-card p-5 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
          style={{ background: `${data.color}15`, border: `1px solid ${data.color}35`, color: data.color }}>
          {data.svg}
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
          data.trend === "up" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20"
        }`}>{data.change}</span>
      </div>
      <p className="text-2xl font-extrabold tracking-tight mb-1 text-slate-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {data.value}
      </p>
      <p className="text-xs text-slate-400 font-medium">{data.label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleString("en-IN", {
      dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Kolkata"
    }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Operations & Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Karnataka State Police — Command Center Operations Overview
          </p>
        </div>
        <div className="text-right hidden md:block px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <p className="text-xs text-blue-400 font-mono font-semibold">
            {time}
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">IST • Karnataka Control Room</p>
        </div>
      </div>

      {/* Active Tactical Alerts */}
      <div className="space-y-2.5">
        {alerts.map((alert, i) => (
          <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl text-xs font-medium transition-all ${
            alert.type === "critical" ? "alert-critical text-red-300" : 
            alert.type === "warning" ? "border border-amber-500/30 bg-amber-500/10 text-amber-200" :
            "border border-blue-500/30 bg-blue-500/10 text-blue-200"
          }`}>
            <span className="flex-shrink-0">
              {alert.type === "critical" ? "🚨" : alert.type === "warning" ? "⚠️" : "ℹ️"}
            </span>
            <div className="flex-1 leading-relaxed">{alert.msg}</div>
            <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{alert.time}</span>
          </div>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((d, i) => <KPICard key={d.label} data={d} index={i} />)}
      </div>

      {/* Analytics Charts & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crime Categories Distribution */}
        <div className="chart-container lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-200 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Crime Category Distribution — 2024 YTD
              </h3>
              <p className="text-[11px] text-slate-500">Breakdown of reported offenses across major divisions</p>
            </div>
            <span className="text-xs text-blue-400 font-mono font-semibold">48,234 Total</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Cybercrime", count: 8921, max: 9000, color: "#6366f1" },
              { label: "Vehicle Theft", count: 6789, max: 9000, color: "#3b82f6" },
              { label: "Assault", count: 7234, max: 9000, color: "#ef4444" },
              { label: "Robbery", count: 5432, max: 9000, color: "#f59e0b" },
              { label: "Narcotics", count: 3456, max: 9000, color: "#10b981" },
              { label: "Burglary", count: 4123, max: 9000, color: "#8b5cf6" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-xs font-medium w-28 text-slate-300 flex-shrink-0">{item.label}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div className="h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${(item.count / item.max) * 100}%`, background: `linear-gradient(90deg, ${item.color}, #60a5fa)` }} />
                </div>
                <span className="text-xs font-mono font-bold w-16 text-right text-slate-200">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Actions */}
        <div className="chart-container">
          <h3 className="text-sm font-bold text-slate-200 tracking-wide mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Intelligence Modules
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "POLICEGPT Conversational AI", href: "/dashboard/chat", color: "#3b82f6", desc: "Ask crime data in natural language" },
              { label: "FIR Database Search", href: "/dashboard/cases", color: "#10b981", desc: "Filter and inspect FIR case files" },
              { label: "Crime Analytics & Maps", href: "/dashboard/analytics", color: "#f59e0b", desc: "Heatmaps & trend predictions" },
              { label: "Suspect Network Graph", href: "/dashboard/graph", color: "#8b5cf6", desc: "Neo4j visual relationship graph" },
              { label: "Investigation Reports", href: "/dashboard/reports", color: "#06b6d4", desc: "Auto-generate case dossiers" },
            ].map(action => (
              <Link key={action.href} href={action.href}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-blue-500/40 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">{action.label}</p>
                  <p className="text-[10px] text-slate-500">{action.desc}</p>
                </div>
                <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* High-Priority Cases Table */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
              High-Priority Active Cases
            </h3>
            <p className="text-[11px] text-slate-500">Cases requiring urgent field investigation & supervision</p>
          </div>
          <Link href="/dashboard/cases" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            View All FIRs →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>FIR Number</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>AI Urgency Index</th>
                <th>Investigating Officer</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c) => (
                <tr key={c.fir} className="cursor-pointer group">
                  <td>
                    <Link href={`/dashboard/cases`}
                      className="font-mono text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                      {c.fir}
                    </Link>
                  </td>
                  <td className="text-xs font-medium text-slate-200">{c.category}</td>
                  <td className="text-xs text-slate-400">{c.location}</td>
                  <td>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full status-${
                      c.status === "open" ? "open" : c.status === "investigation" ? "investigation" : "chargesheeted"
                    }`}>
                      {c.status === "investigation" ? "Investigating" : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden w-20">
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${c.urgency * 100}%`,
                            background: c.urgency > 0.8 ? "linear-gradient(90deg, #ef4444, #f87171)" : c.urgency > 0.6 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : "linear-gradient(90deg, #10b981, #34d399)"
                          }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {Math.round(c.urgency * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-slate-300">{c.officer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
