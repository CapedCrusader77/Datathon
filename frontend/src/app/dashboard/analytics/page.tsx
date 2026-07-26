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
  { cat: "Cybercrime", count: 8921, color: "#3b82f6", change: +34.1 },
  { cat: "Vehicle Theft", count: 6789, color: "#0284c7", change: +8.2 },
  { cat: "Assault", count: 7234, color: "#ef4444", change: -2.1 },
  { cat: "Robbery", count: 5432, color: "#64748b", change: +5.3 },
  { cat: "Narcotics", count: 3456, color: "#06b6d4", change: -8.7 },
  { cat: "Burglary", count: 4123, color: "#8b5cf6", change: +3.2 },
  { cat: "Economic Offence", count: 2341, color: "#3b82f6", change: +15.4 },
  { cat: "Missing Persons", count: 1234, color: "#0284c7", change: -12.0 },
];

const maxCount = Math.max(...categories.map(c => c.count));
const maxMonth = Math.max(...monthlyData.map(m => Math.max(m.robbery, m.cybercrime, m.assault)));

function BarChart() {
  const series = [
    { key: "cybercrime", color: "#3b82f6", label: "Cybercrime" },
    { key: "robbery", color: "#0284c7", label: "Robbery" },
    { key: "assault", color: "#ef4444", label: "Assault" },
  ];

  return (
    <div style={{ height: "200px", display: "flex", alignItems: "flex-end", gap: "8px", paddingTop: "20px" }}>
      {monthlyData.map(m => (
        <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "100%", display: "flex", gap: "2px", alignItems: "flex-end", height: "150px" }}>
            {series.map(s => {
              const val = m[s.key as keyof typeof m] as number;
              const h = (val / maxMonth) * 150;
              return (
                <div
                  key={s.key}
                  title={`${s.label} (${m.month}): ${val}`}
                  style={{ flex: 1, borderRadius: "2px 2px 0 0", height: `${h}px`, background: s.color }}
                />
              );
            })}
          </div>
          <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-mono)", color: "#64748b", fontWeight: 700 }}>{m.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("trends");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
            Crime Intelligence Analytics
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
            Visual pattern detection, district heatmaps, and predictive AI crime models
          </p>
        </div>
        <Link href="/dashboard/chat" className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px 14px", textDecoration: "none" }}>
          🤖 AI Analytics Query
        </Link>
      </div>

      {/* Tabs Toolbar */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #141a28", paddingBottom: "12px" }}>
        {[
          { key: "trends", label: "Monthly Trends & Breakdown", icon: "📊" },
          { key: "heatmap", label: "District Spatial Heatmap", icon: "🗺️" },
          { key: "prediction", label: "Predictive AI Intelligence", icon: "🔮" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              fontSize: "0.75rem", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 600,
              display: "flex", alignItems: "center", gap: "8px",
              background: activeTab === t.key ? "rgba(59,130,246,0.15)" : "transparent",
              color: activeTab === t.key ? "#60a5fa" : "#64748b",
              border: activeTab === t.key ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent"
            }}>
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Trends View */}
      {activeTab === "trends" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Bar Chart */}
            <div className="chart-container">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }}>
                    Monthly Incident Trajectory — 2024
                  </h3>
                  <p style={{ fontSize: "0.72rem", color: "#64748b" }}>Comparative multi-series volume</p>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  {[{ c: "#3b82f6", l: "Cyber" }, { c: "#0284c7", l: "Robbery" }, { c: "#ef4444", l: "Assault" }].map(s => (
                    <div key={s.l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.c }} />
                      <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <BarChart />
            </div>

            {/* Category Breakdown */}
            <div className="chart-container">
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }}>
                  Crime Category Shares — YTD
                </h3>
                <p style={{ fontSize: "0.72rem", color: "#64748b" }}>Volumetric offense totals & YoY shift</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {categories.map(c => (
                  <div key={c.cat} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.75rem", color: "#e2e8f0", width: "120px", flexShrink: 0, fontWeight: 500 }}>{c.cat}</span>
                    <div style={{ flex: 1, height: "6px", borderRadius: "99px", background: "#0a0d14", overflow: "hidden", border: "1px solid #141a28" }}>
                      <div style={{ height: "100%", borderRadius: "99px", width: `${(c.count / maxCount) * 100}%`, background: c.color }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, width: "50px", textAlign: "right", color: "#f1f5f9" }}>
                      {c.count.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", fontWeight: 700, width: "50px", textAlign: "right", color: c.change > 0 ? "#ef4444" : "#10b981" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
          <div className="kg-container" style={{ position: "relative", height: "500px" }}>
            <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10 }}>
              <span className="glass-card" style={{ fontSize: "0.72rem", fontWeight: 600, padding: "6px 12px", color: "#60a5fa" }}>
                🗺️ Karnataka State Crime Density Map
              </span>
            </div>
            
            <svg width="100%" height="100%" viewBox="0 0 600 460">
              <path d="M150,50 L250,30 L350,50 L430,100 L480,180 L500,280 L460,370 L380,420 L280,440 L200,410 L130,350 L100,260 L110,160 Z"
                fill="rgba(10,13,20,0.8)" stroke="rgba(59,130,246,0.3)" strokeWidth="2" />

              {hotspots.map((h, i) => {
                const svgX = (h.lon - 74.0) / (78.0 - 74.0) * 500 + 50;
                const svgY = (16.0 - h.lat) / (16.0 - 11.5) * 400 + 30;
                const r = Math.sqrt(h.count / 342) * 36;
                return (
                  <g key={i}>
                    <circle cx={svgX} cy={svgY} r={r}
                      fill={h.count > 250 ? "rgba(239,68,68,0.25)" : h.count > 150 ? "rgba(59,130,246,0.25)" : "rgba(2,132,199,0.2)"}
                      stroke={h.count > 250 ? "#ef4444" : h.count > 150 ? "#3b82f6" : "#0284c7"}
                      strokeWidth="1.5"
                    />
                    <text x={svgX} y={svgY + 3} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f8fafc">
                      {h.area.split(" ")[0]}
                    </text>
                    <text x={svgX} y={svgY + 16} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="#94a3b8">
                      {h.count} Incidents
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-container" style={{ maxHeight: "500px", overflowY: "auto" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc", marginBottom: "16px" }}>
              District Incident Density
            </h3>
            {hotspots.sort((a, b) => b.count - a.count).map((h, i) => (
              <div key={h.area} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "8px", marginBottom: "8px", background: "#05070a", border: "1px solid #141a28" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontFamily: "var(--font-mono)", fontWeight: 700, background: i < 3 ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)", color: i < 3 ? "#ef4444" : "#60a5fa" }}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#f1f5f9" }}>{h.area}</p>
                  <div style={{ height: "4px", borderRadius: "99px", marginTop: "4px", background: "#0a0d14", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "99px", width: `${(h.count / hotspots[0].count) * 100}%`, background: i < 3 ? "#ef4444" : "#3b82f6" }} />
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#f8fafc" }}>
                  {h.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Prediction View */}
      {activeTab === "prediction" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "1.5rem" }}>🔮</div>
            <div>
              <h3 style={{ fontWeight: 700, color: "#93c5fd", fontSize: "0.85rem" }}>POLICEGPT Predictive Risk Model — 30-Day Forecast</h3>
              <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                Model: POLICEGPT-PredictV2 • Historical Accuracy: 76.4% • Factors: Seasonal density, MO drift, police patrol frequency
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {predictions.map(p => (
              <div key={p.area} className="glass-card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <h4 style={{ fontWeight: 700, fontSize: "0.85rem", color: "#f8fafc" }}>{p.area}</h4>
                  <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", color: p.change > 0 ? "#ef4444" : "#10b981", background: p.change > 0 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", marginLeft: "auto" }}>
                    {p.change > 0 ? "▲ +" : "▼ "}{p.change}%
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "12px" }}>📊 Key Factor: {p.driver}</p>
                <span className={`risk-${p.risk}`} style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                  PREDICTED RISK: {p.risk.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px", borderRadius: "8px", background: "#05070a", border: "1px solid #141a28", fontSize: "0.72rem", color: "#64748b", lineHeight: 1.5 }}>
            ⚠️ <strong style={{ color: "#cbd5e1" }}>Legal Disclaimer:</strong> AI-generated crime forecast vectors represent statistical probabilities for preventive patrol routing.
          </div>
        </div>
      )}
    </div>
  );
}
