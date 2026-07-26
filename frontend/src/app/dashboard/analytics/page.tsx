"use client";
import { useState } from "react";
import Link from "next/link";

const monthlyData = [
  { month: "Jan", robbery: 45, cybercrime: 89, assault: 67, burglary: 34, narcotics: 23 },
  { month: "Feb", robbery: 38, cybercrime: 102, assault: 71, burglary: 29, narcotics: 31 },
  { month: "Mar", robbery: 52, cybercrime: 115, assault: 63, burglary: 41, narcotics: 28 },
  { month: "Apr", robbery: 49, cybercrime: 98, assault: 59, burglary: 37, narcotics: 35 },
  { month: "May", robbery: 61, cybercrime: 134, assault: 82, burglary: 48, narcotics: 42 },
  { month: "Jun", robbery: 58, cybercrime: 121, assault: 74, burglary: 43, narcotics: 38 },
  { month: "Jul", robbery: 67, cybercrime: 143, assault: 88, burglary: 52, narcotics: 47 },
  { month: "Aug", robbery: 72, cybercrime: 156, assault: 91, burglary: 58, narcotics: 51 },
  { month: "Sep", robbery: 64, cybercrime: 148, assault: 79, burglary: 49, narcotics: 44 },
  { month: "Oct", robbery: 69, cybercrime: 162, assault: 85, burglary: 55, narcotics: 49 },
  { month: "Nov", robbery: 55, cybercrime: 139, assault: 71, burglary: 42, narcotics: 40 },
  { month: "Dec", robbery: 48, cybercrime: 128, assault: 66, burglary: 38, narcotics: 36 },
];

const hotspots = [
  { area: "Bangalore Central", count: 342, lat: 12.9716, lon: 77.5946 },
  { area: "Bangalore East", count: 287, lat: 12.9352, lon: 77.6245 },
  { area: "Bangalore South", count: 311, lat: 12.8931, lon: 77.5969 },
  { area: "Mysore City", count: 167, lat: 12.2958, lon: 76.6394 },
  { area: "Hubli-Dharwad", count: 143, lat: 15.3647, lon: 75.1240 },
  { area: "Mangalore Coast", count: 134, lat: 12.8605, lon: 74.8433 },
  { area: "Belgaum District", count: 98, lat: 15.8497, lon: 74.4977 },
  { area: "Kolar Gold Field", count: 112, lat: 13.1986, lon: 77.7066 },
];

const predictions = [
  { area: "Bangalore Central", change: +12.3, risk: "high", driver: "Commercial festival season, elevated pedestrian density" },
  { area: "Mysore City Center", change: +5.7, risk: "medium", driver: "Seasonal tourist influx & highway traffic surge" },
  { area: "Hubli Industrial Zone", change: -3.2, risk: "low", driver: "Enhanced mobile night patrol deployment" },
  { area: "Bangalore East IT Belt", change: +8.1, risk: "high", driver: "Spike in financial UPI phishing & SIM swap rings" },
];

const categories = [
  { cat: "Cybercrime", count: 8921, color: "#2563eb", change: +34.1 },
  { cat: "Vehicle Theft", count: 6789, color: "#0284c7", change: +8.2 },
  { cat: "Assault", count: 7234, color: "#dc2626", change: -2.1 },
  { cat: "Robbery", count: 5432, color: "#475569", change: +5.3 },
  { cat: "Narcotics", count: 3456, color: "#0891b2", change: -8.7 },
  { cat: "Burglary", count: 4123, color: "#6366f1", change: +3.2 },
  { cat: "Economic Offence", count: 2341, color: "#2563eb", change: +15.4 },
  { cat: "Missing Persons", count: 1234, color: "#0284c7", change: -12.0 },
];

const maxCount = Math.max(...categories.map(c => c.count));
const maxMonth = Math.max(...monthlyData.map(m => Math.max(m.robbery, m.cybercrime, m.assault)));

function BarChart() {
  const series = [
    { key: "cybercrime", color: "#2563eb", label: "Cybercrime" },
    { key: "robbery", color: "#0284c7", label: "Robbery" },
    { key: "assault", color: "#dc2626", label: "Assault" },
  ];

  return (
    <div className="h-52 flex items-end gap-2 pt-6">
      {monthlyData.map(m => (
        <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full flex gap-1 items-end" style={{ height: "150px" }}>
            {series.map(s => {
              const val = m[s.key as keyof typeof m] as number;
              const h = (val / maxMonth) * 150;
              return (
                <div
                  key={s.key}
                  title={`${s.label} (${m.month}): ${val}`}
                  className="flex-1 rounded-t-sm transition-all duration-300 group-hover:brightness-125"
                  style={{ height: `${h}px`, background: s.color }}
                />
              );
            })}
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">{m.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("trends");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Crime Intelligence Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual pattern detection, district heatmaps, and predictive AI crime models
          </p>
        </div>
        <Link href="/dashboard/chat" className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 no-underline shadow-md">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          AI Analytics Query
        </Link>
      </div>

      {/* Tabs Toolbar */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {[
          { key: "trends", label: "Monthly Trends & Breakdown", icon: "📊" },
          { key: "heatmap", label: "District Spatial Heatmap", icon: "🗺️" },
          { key: "prediction", label: "Predictive AI Intelligence", icon: "🔮" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === t.key
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Trends View */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="chart-container">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Monthly Incident Trajectory — 2024
                  </h3>
                  <p className="text-[11px] text-slate-500">Comparative multi-series monthly volume</p>
                </div>
                <div className="flex gap-3">
                  {[{ c: "#2563eb", l: "Cyber" }, { c: "#0284c7", l: "Robbery" }, { c: "#dc2626", l: "Assault" }].map(s => (
                    <div key={s.l} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />
                      <span className="text-[10px] text-slate-400 font-medium">{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <BarChart />
            </div>

            {/* Category Breakdown */}
            <div className="chart-container">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-200 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Crime Category Shares — YTD
                </h3>
                <p className="text-[11px] text-slate-500">Volumetric offense totals & YoY shift percentage</p>
              </div>
              <div className="space-y-3.5">
                {categories.map(c => (
                  <div key={c.cat} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                    <span className="text-xs text-slate-300 w-32 flex-shrink-0 font-medium">{c.cat}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(c.count / maxCount) * 100}%`, background: c.color }} />
                    </div>
                    <span className="text-xs font-mono font-bold w-14 text-right text-slate-200">
                      {c.count.toLocaleString()}
                    </span>
                    <span className={`text-[11px] font-mono font-bold w-14 text-right ${c.change > 0 ? "text-red-400" : "text-emerald-400"}`}>
                      {c.change > 0 ? "+" : ""}{c.change}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spatial Heatmap View */}
      {activeTab === "heatmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 chart-container kg-container relative p-6 h-[500px] border border-slate-800 overflow-hidden rounded-2xl">
            <div className="absolute top-4 left-4 z-10">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-blue-400 shadow-md">
                🗺️ Karnataka State Crime Density Map
              </span>
            </div>
            
            <svg width="100%" height="100%" viewBox="0 0 600 460">
              <path d="M150,50 L250,30 L350,50 L430,100 L480,180 L500,280 L460,370 L380,420 L280,440 L200,410 L130,350 L100,260 L110,160 Z"
                fill="rgba(13,23,42,0.6)" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />

              {hotspots.map((h, i) => {
                const svgX = (h.lon - 74.0) / (78.0 - 74.0) * 500 + 50;
                const svgY = (16.0 - h.lat) / (16.0 - 11.5) * 400 + 30;
                const r = Math.sqrt(h.count / 342) * 36;
                return (
                  <g key={i}>
                    <circle cx={svgX} cy={svgY} r={r}
                      fill={h.count > 250 ? "rgba(220,38,38,0.25)" : h.count > 150 ? "rgba(37,99,235,0.25)" : "rgba(2,132,199,0.2)"}
                      stroke={h.count > 250 ? "#dc2626" : h.count > 150 ? "#2563eb" : "#0284c7"}
                      strokeWidth="1.5"
                    />
                    <text x={svgX} y={svgY + 3} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f8fafc">
                      {h.area.split(" ")[0]}
                    </text>
                    <text x={svgX} y={svgY + 16} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#94a3b8">
                      {h.count} Incidents
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-container overflow-y-auto max-h-[500px]">
            <h3 className="text-sm font-bold text-slate-200 tracking-wide mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              District Incident Density
            </h3>
            {hotspots.sort((a, b) => b.count - a.count).map((h, i) => (
              <div key={h.area} className="flex items-center gap-3 p-3 rounded-xl mb-2 bg-slate-900/40 border border-slate-800">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 shadow"
                  style={{ background: i < 3 ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.15)", color: i < 3 ? "#f87171" : "#60a5fa" }}>
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-200">{h.area}</p>
                  <div className="h-1.5 rounded-full mt-1.5 bg-slate-950 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${(h.count / hotspots[0].count) * 100}%`, background: i < 3 ? "#ef4444" : "#3b82f6" }} />
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {h.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Prediction View */}
      {activeTab === "prediction" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl flex-shrink-0">
              🔮
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">POLICEGPT Predictive Risk Model — 30-Day Forecast</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Model: POLICEGPT-PredictV2 • Historical Accuracy: 76.4% • Factors: Seasonal density, MO drift, police patrol frequency
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map(p => (
              <div key={p.area} className="glass-card p-5 border border-slate-800 hover:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-100">{p.area}</h4>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    p.change > 0 ? "text-red-400 bg-red-500/10 border border-red-500/20" : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                  }`}>
                    {p.change > 0 ? "▲ +" : "▼ "}{p.change}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">📊 Key Factor: {p.driver}</p>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider risk-${p.risk}`}>
                  PREDICTED RISK: {p.risk.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            ⚠️ <strong className="text-slate-200">Legal Disclaimer:</strong> AI-generated crime forecast vectors represent statistical probabilities for preventive patrol routing. They do not constitute formal evidence or probable cause.
          </div>
        </div>
      )}
    </div>
  );
}
