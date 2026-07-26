"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const kpiData = [
  { label: "Total FIRs 2024", value: "48,234", change: "+5.2%", icon: "📋", color: "#3b82f6", trend: "up" },
  { label: "Open Cases",      value: "12,891", change: "-3.1%", icon: "🔓", color: "#f59e0b", trend: "down" },
  { label: "Solved Cases",    value: "35,343", change: "+12.4%", icon: "✅", color: "#10b981", trend: "up" },
  { label: "Clearance Rate",  value: "73.3%",  change: "+2.1%", icon: "📈", color: "#8b5cf6", trend: "up" },
  { label: "Cybercrime YTD",  value: "8,921",  change: "+34.1%", icon: "💻", color: "#ef4444", trend: "up" },
  { label: "Arrests YTD",     value: "19,876", change: "+8.7%", icon: "⚠️", color: "#f97316", trend: "up" },
  { label: "Missing Persons", value: "234",    change: "-12%",  icon: "🔍", color: "#06b6d4", trend: "down" },
  { label: "AI Queries Today",value: "1,204",  change: "+45%",  icon: "🤖", color: "#7c3aed", trend: "up" },
];

const recentCases = [
  { fir: "CR-045/2024", category: "Robbery",    location: "Koramangala",   status: "open",           urgency: 0.87, officer: "SI Priya" },
  { fir: "CR-089/2024", category: "Cybercrime", location: "Whitefield",    status: "investigation",  urgency: 0.72, officer: "Insp Ramesh" },
  { fir: "CR-112/2023", category: "Murder",     location: "Mysore Road",   status: "chargesheeted",  urgency: 0.95, officer: "Insp Ramesh" },
  { fir: "CR-034/2024", category: "Narcotics",  location: "KR Market",     status: "open",           urgency: 0.81, officer: "SI Priya" },
  { fir: "CR-156/2024", category: "Burglary",   location: "Jayanagar",     status: "open",           urgency: 0.55, officer: "PSI Arjun" },
];

const alerts = [
  { type: "critical", msg: "🔴 BOLO: Ravi Kumar S (KSP-CR-2024-0001) — Repeat offender absconding. Last seen Shivajinagar.", time: "2 min ago" },
  { type: "warning",  msg: "🟡 Cybercrime surge: 34% increase in UPI fraud in Bangalore East. Alert all PSs.", time: "15 min ago" },
  { type: "info",     msg: "🔵 Missing child matched: Witness report links to case CR-078/2024. Verify immediately.", time: "1 hr ago" },
];

function KPICard({ data, index }: { data: typeof kpiData[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div className={`kpi-card p-5 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ background: `${data.color}20`, border: `1px solid ${data.color}40` }}>
          {data.icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          data.trend === "up" ? "text-green-400 bg-green-400/10" : "text-blue-400 bg-blue-400/10"
        }`}>{data.change}</span>
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: data.color, fontFamily: "'Rajdhani', sans-serif" }}>
        {data.value}
      </p>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{data.label}</p>
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif", color: "var(--text-primary)" }}>
            Operations Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Karnataka State Police — Real-time Intelligence Overview
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs" style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            {time}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>IST • Karnataka</p>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
            alert.type === "critical" ? "alert-critical" : 
            alert.type === "warning" ? "border border-yellow-500/30 bg-yellow-500/5" :
            "border border-blue-500/20 bg-blue-500/5"
          }`}>
            <div className="flex-1" style={{ color: "var(--text-secondary)" }}>{alert.msg}</div>
            <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>{alert.time}</span>
          </div>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((d, i) => <KPICard key={d.label} data={d} index={i} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Crime by Category mini-chart */}
        <div className="chart-container lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Crime Categories — 2024 YTD
          </h3>
          <div className="space-y-3">
            {[
              { label: "Cybercrime", count: 8921, max: 9000, color: "#6366f1" },
              { label: "Vehicle Theft", count: 6789, max: 9000, color: "#3b82f6" },
              { label: "Assault", count: 7234, max: 9000, color: "#ef4444" },
              { label: "Robbery", count: 5432, max: 9000, color: "#f59e0b" },
              { label: "Narcotics", count: 3456, max: 9000, color: "#10b981" },
              { label: "Burglary", count: 4123, max: 9000, color: "#8b5cf6" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs w-24 flex-shrink-0" style={{ color: "var(--text-muted)" }}>{item.label}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(item.count / item.max) * 100}%`, background: item.color }} />
                </div>
                <span className="text-xs w-14 text-right" style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="chart-container">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Quick Actions
          </h3>
          <div className="space-y-2">
            {[
              { label: "Ask POLICEGPT", href: "/dashboard/chat",    icon: "🤖", color: "#3b82f6" },
              { label: "Search FIRs",   href: "/dashboard/cases",   icon: "📋", color: "#10b981" },
              { label: "Crime Map",     href: "/dashboard/analytics", icon: "🗺️", color: "#f59e0b" },
              { label: "Suspect Graph", href: "/dashboard/graph",    icon: "🕸️", color: "#8b5cf6" },
              { label: "Gen Report",    href: "/dashboard/reports",  icon: "📄", color: "#06b6d4" },
            ].map(action => (
              <Link key={action.href} href={action.href}
                className="flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group"
                style={{ border: "1px solid transparent" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${action.color}40`;
                  (e.currentTarget as HTMLElement).style.background = `${action.color}10`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${action.color}20` }}>
                  <span className="text-sm">{action.icon}</span>
                </div>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{action.label}</span>
                <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: action.color }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Cases */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Recent High-Priority Cases
          </h3>
          <Link href="/dashboard/cases" className="text-xs" style={{ color: "var(--accent-blue)" }}>
            View all →
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
                <th>Urgency</th>
                <th>Officer</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c) => (
                <tr key={c.fir} className="cursor-pointer">
                  <td>
                    <Link href={`/dashboard/cases`}
                      className="font-mono text-xs hover:text-blue-400 transition-colors"
                      style={{ color: "var(--accent-blue-bright)" }}>
                      {c.fir}
                    </Link>
                  </td>
                  <td className="text-sm">{c.category}</td>
                  <td className="text-sm" style={{ color: "var(--text-muted)" }}>{c.location}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium status-${
                      c.status === "open" ? "open" : c.status === "investigation" ? "investigation" : "chargesheeted"
                    }`}>
                      {c.status === "investigation" ? "Investigating" : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full w-16" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-1.5 rounded-full"
                          style={{
                            width: `${c.urgency * 100}%`,
                            background: c.urgency > 0.8 ? "#ef4444" : c.urgency > 0.6 ? "#f59e0b" : "#10b981"
                          }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                        {Math.round(c.urgency * 100)}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm" style={{ color: "var(--text-muted)" }}>{c.officer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
