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
  { area: "Mysore", count: 167, lat: 12.2958, lon: 76.6394 },
  { area: "Hubli-Dharwad", count: 143, lat: 15.3647, lon: 75.1240 },
  { area: "Mangalore", count: 134, lat: 12.8605, lon: 74.8433 },
  { area: "Belgaum", count: 98, lat: 15.8497, lon: 74.4977 },
  { area: "Kolar", count: 112, lat: 13.1986, lon: 77.7066 },
];

const predictions = [
  { area: "Bangalore Central", change: +12.3, risk: "high", driver: "Festival season, higher footfall" },
  { area: "Mysore City", change: +5.7, risk: "medium", driver: "Tourist season beginning" },
  { area: "Hubli", change: -3.2, risk: "low", driver: "Enhanced patrolling deployed" },
  { area: "Bangalore East", change: +8.1, risk: "high", driver: "Cyber fraud spike trend" },
];

const categories = [
  { cat: "Cybercrime", count: 8921, color: "#6366f1", change: +34.1 },
  { cat: "Vehicle Theft", count: 6789, color: "#3b82f6", change: +8.2 },
  { cat: "Assault", count: 7234, color: "#ef4444", change: -2.1 },
  { cat: "Robbery", count: 5432, color: "#f59e0b", change: +5.3 },
  { cat: "Narcotics", count: 3456, color: "#10b981", change: -8.7 },
  { cat: "Burglary", count: 4123, color: "#8b5cf6", change: +3.2 },
  { cat: "Economic Offence", count: 2341, color: "#f97316", change: +15.4 },
  { cat: "Missing Persons", count: 1234, color: "#06b6d4", change: -12.0 },
];

const maxCount = Math.max(...categories.map(c => c.count));
const maxMonth = Math.max(...monthlyData.map(m => Math.max(m.robbery, m.cybercrime, m.assault)));

function BarChart() {
  const series = [
    { key: "cybercrime", color: "#6366f1", label: "Cybercrime" },
    { key: "robbery",    color: "#f59e0b", label: "Robbery" },
    { key: "assault",    color: "#ef4444", label: "Assault" },
  ];

  return (
    <div className="h-48 flex items-end gap-1.5 pt-4">
      {monthlyData.map(m => (
        <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-full flex gap-px items-end" style={{ height: "140px" }}>
            {series.map(s => {
              const val = m[s.key as keyof typeof m] as number;
              const h = (val / maxMonth) * 140;
              return (
                <div key={s.key} className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{ height: `${h}px`, background: s.color, minWidth: "2px" }} />
              );
            })}
          </div>
          <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "9px" }}>{m.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("trends");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Crime Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Visual intelligence — trends, hotspots, predictions, patterns
          </p>
        </div>
        <Link href="/dashboard/chat" className="btn-primary text-sm px-4 py-2 no-underline">
          🤖 AI Analysis
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "trends", label: "📈 Trends" },
          { key: "heatmap", label: "🗺️ Heatmap" },
          { key: "prediction", label: "🔮 AI Prediction" },
        ].map(t => (
          <button key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`text-sm px-4 py-2 rounded-lg transition-all ${activeTab === t.key ? "btn-primary" : "btn-ghost"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Trends Tab */}
      {activeTab === "trends" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Monthly trend chart */}
            <div className="chart-container">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Monthly Trend — 2024
                </h3>
                <div className="flex gap-3">
                  {[{ c: "#6366f1", l: "Cyber" }, { c: "#f59e0b", l: "Robbery" }, { c: "#ef4444", l: "Assault" }].map(s => (
                    <div key={s.l} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded" style={{ background: s.c }} />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <BarChart />
            </div>

            {/* Category breakdown */}
            <div className="chart-container">
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Category Breakdown — YTD
              </h3>
              <div className="space-y-3">
                {categories.map(c => (
                  <div key={c.cat} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded flex-shrink-0" style={{ background: c.color }} />
                    <span className="text-xs w-32 flex-shrink-0" style={{ color: "var(--text-secondary)" }}>{c.cat}</span>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-2 rounded-full transition-all"
                        style={{ width: `${(c.count / maxCount) * 100}%`, background: c.color }} />
                    </div>
                    <span className="text-xs w-14 text-right font-mono" style={{ color: "var(--text-muted)" }}>
                      {c.count.toLocaleString()}
                    </span>
                    <span className={`text-xs w-14 text-right ${c.change > 0 ? "text-red-400" : "text-green-400"}`}>
                      {c.change > 0 ? "+" : ""}{c.change}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Tab */}
      {activeTab === "heatmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* "Map" visualization */}
          <div className="lg:col-span-2 chart-container kg-container" style={{ height: "480px", position: "relative" }}>
            <div className="absolute top-3 left-3 z-10">
              <span className="text-xs px-2 py-1 rounded glass-card" style={{ color: "var(--text-muted)" }}>
                🗺️ Karnataka Crime Heatmap (Demo)
              </span>
            </div>
            {/* SVG Karnataka map placeholder */}
            <svg width="100%" height="100%" viewBox="0 0 600 460">
              {/* Simplified Karnataka outline */}
              <path d="M150,50 L250,30 L350,50 L430,100 L480,180 L500,280 L460,370 L380,420 L280,440 L200,410 L130,350 L100,260 L110,160 Z"
                fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />

              {/* Hotspot circles */}
              {hotspots.map((h, i) => {
                const svgX = (h.lon - 74.0) / (78.0 - 74.0) * 500 + 50;
                const svgY = (16.0 - h.lat) / (16.0 - 11.5) * 400 + 30;
                const r = Math.sqrt(h.count / 342) * 40;
                return (
                  <g key={i}>
                    <circle cx={svgX} cy={svgY} r={r}
                      fill={h.count > 250 ? "rgba(239,68,68,0.3)" : h.count > 150 ? "rgba(245,158,11,0.25)" : "rgba(59,130,246,0.2)"}
                      stroke={h.count > 250 ? "#ef4444" : h.count > 150 ? "#f59e0b" : "#3b82f6"}
                      strokeWidth="1" strokeDasharray={h.count > 250 ? "none" : "4 2"}>
                      <animate attributeName="r" values={`${r};${r * 1.1};${r}`} dur="3s" repeatCount="indefinite" />
                    </circle>
                    <text x={svgX} y={svgY + 3} textAnchor="middle" fontSize="9" fill="#e2e8f0">
                      {h.area.split(" ")[0]}
                    </text>
                    <text x={svgX} y={svgY + 14} textAnchor="middle" fontSize="8" fill="#94a3b8">
                      {h.count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hotspot Rankings */}
          <div className="chart-container overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Top Crime Hotspots
            </h3>
            {hotspots.sort((a, b) => b.count - a.count).map((h, i) => (
              <div key={h.area} className="flex items-center gap-3 p-2.5 rounded-lg mb-2 transition-all hover:bg-blue-600/5"
                style={{ border: "1px solid transparent" }}>
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: i < 3 ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.1)", color: i < 3 ? "#ef4444" : "#60a5fa" }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{h.area}</p>
                  <div className="h-1 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="h-1 rounded-full"
                      style={{ width: `${(h.count / hotspots[0].count) * 100}%`, background: i < 3 ? "#ef4444" : "#3b82f6" }} />
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: i < 3 ? "#ef4444" : "var(--text-secondary)" }}>
                  {h.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prediction Tab */}
      {activeTab === "prediction" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔮</span>
              <div>
                <h3 className="font-semibold" style={{ color: "#a78bfa" }}>AI Crime Prediction — Next 30 Days</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Model: POLICEGPT-PredictV1 • Confidence: 76% • Based on historical + seasonal patterns</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map(p => (
              <div key={p.area} className="glass-card glass-card-hover p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{p.area}</h4>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                    p.change > 0 ? "text-red-400 bg-red-400/10" : "text-green-400 bg-green-400/10"
                  }`}>
                    {p.change > 0 ? "▲" : "▼"} {Math.abs(p.change)}%
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>📊 {p.driver}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium risk-${p.risk}`}>
                  PREDICTED RISK: {p.risk.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div className="chart-container">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              ⚠️ <strong style={{ color: "var(--text-secondary)" }}>Disclaimer:</strong> AI predictions are probabilistic estimates based on historical patterns. Use for resource planning only. Actual outcomes may vary. Always verify with ground intelligence.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
