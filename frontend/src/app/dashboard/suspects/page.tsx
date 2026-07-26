"use client";
import { useState } from "react";
import Link from "next/link";

const suspects = [
  { id: "s1", criminal_id: "KSP-CR-2024-0001", name: "Ravi Kumar S", aliases: ["Ravi Bhai", "King"], age: 34, gender: "Male",
    risk: "extreme", firs: 12, gang: "Bengaluru South Gang", arrested: false, absconding: true, location: "Shivajinagar (suspected)", categories: ["Robbery", "Assault", "Extortion"] },
  { id: "s2", criminal_id: "KSP-CR-2023-0045", name: "Mohammed Irfan K", aliases: ["Irfan Bhai"], age: 28, gender: "Male",
    risk: "high", firs: 7, gang: null, arrested: true, absconding: false, location: "Central Prison, PAH", categories: ["Cybercrime", "Fraud"] },
  { id: "s3", criminal_id: "KSP-CR-2022-0078", name: "Venkatesh P", aliases: ["Venki"], age: 41, gender: "Male",
    risk: "high", firs: 5, gang: "Mysore Network", arrested: false, absconding: false, location: "Mysore City", categories: ["Narcotics", "Robbery"] },
  { id: "s4", criminal_id: "KSP-CR-2024-0102", name: "Suresh M", aliases: ["Suresh Anna"], age: 31, gender: "Male",
    risk: "medium", firs: 3, gang: "Bengaluru South Gang", arrested: false, absconding: false, location: "Unknown", categories: ["Robbery"] },
  { id: "s5", criminal_id: "KSP-CR-2023-0189", name: "Deepa R", aliases: [], age: 26, gender: "Female",
    risk: "medium", firs: 2, gang: null, arrested: true, absconding: false, location: "Parappana Agrahara", categories: ["Cybercrime"] },
];

const riskBadge = (r: string) => ({
  extreme: { class: "risk-extreme", label: "EXTREME" },
  high:    { class: "risk-high",    label: "HIGH" },
  medium:  { class: "risk-medium",  label: "MEDIUM" },
  low:     { class: "risk-low",     label: "LOW" },
}[r] || { class: "risk-low", label: r.toUpperCase() });

export default function SuspectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<typeof suspects[0] | null>(null);

  const filtered = suspects.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.criminal_id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ||
      (filter === "absconding" && s.absconding) ||
      (filter === "arrested" && s.arrested) ||
      (filter === "repeat" && s.firs >= 5);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Criminal Database
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Suspect profiles, criminal history, and risk assessment
          </p>
        </div>
        <Link href="/dashboard/graph" className="btn-primary text-sm px-4 py-2 no-underline">
          🕸️ Show Network Graph
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input type="text" className="pg-input" style={{ width: "260px" }}
          placeholder="🔍 Name, criminal ID..."
          value={search} onChange={e => setSearch(e.target.value)} />
        {["all", "absconding", "arrested", "repeat"].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-4 py-2 rounded-lg transition-all ${filter === f ? "btn-primary" : "btn-ghost"}`}>
            {f === "all" ? "All" : f === "repeat" ? "Repeat (5+ FIRs)" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${selected ? "grid-cols-5" : "grid-cols-1"}`}>
        {/* Card Grid */}
        <div className={`${selected ? "col-span-3" : ""} grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start`}>
          {filtered.map(s => {
            const rb = riskBadge(s.risk);
            return (
              <div key={s.id}
                onClick={() => setSelected(s === selected ? null : s)}
                className={`glass-card glass-card-hover p-4 cursor-pointer ${selected?.id === s.id ? "border-blue-500/50" : ""}`}
                style={selected?.id === s.id ? { boxShadow: "var(--glow-blue)" } : undefined}>
                {/* Avatar */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                    style={{
                      background: s.risk === "extreme" ? "rgba(239,68,68,0.2)" : s.risk === "high" ? "rgba(245,158,11,0.2)" : "rgba(59,130,246,0.2)",
                      border: `1px solid ${s.risk === "extreme" ? "rgba(239,68,68,0.4)" : s.risk === "high" ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.4)"}`,
                      color: s.risk === "extreme" ? "#ef4444" : s.risk === "high" ? "#f59e0b" : "#60a5fa",
                    }}>
                    {s.name.charAt(0)}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${rb.class}`}>
                    {rb.label}
                  </span>
                </div>

                <h3 className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-primary)" }}>{s.name}</h3>
                <p className="text-xs mb-1 font-mono" style={{ color: "var(--text-muted)" }}>{s.criminal_id}</p>

                {s.aliases.length > 0 && (
                  <p className="text-xs mb-2 italic" style={{ color: "var(--text-muted)" }}>
                    aka: {s.aliases.join(", ")}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-3">
                  {s.absconding && (
                    <span className="text-xs px-2 py-0.5 rounded-full risk-extreme">⚠️ ABSCONDING</span>
                  )}
                  {s.arrested && (
                    <span className="text-xs px-2 py-0.5 rounded-full risk-low">🔒 ARRESTED</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <div><span>FIRs: </span><span className="font-bold" style={{ color: s.firs >= 5 ? "#ef4444" : "#f59e0b" }}>{s.firs}</span></div>
                  <div>Age: {s.age}</div>
                  {s.gang && <div className="col-span-2 truncate">Gang: {s.gang}</div>}
                </div>

                <div className="flex gap-1 mt-3 flex-wrap">
                  {s.categories.map(c => (
                    <span key={c} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(59,130,246,0.1)", color: "var(--text-secondary)" }}>{c}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="col-span-2 chart-container space-y-4 overflow-y-auto" style={{ maxHeight: "700px", position: "sticky", top: "0" }}>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{selected.name}</h3>
              <button onClick={() => setSelected(null)} style={{ color: "var(--text-muted)" }}>✕</button>
            </div>
            <p className="text-xs font-mono" style={{ color: "var(--accent-blue)" }}>{selected.criminal_id}</p>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${riskBadge(selected.risk).class}`}>
              RISK: {riskBadge(selected.risk).label}
            </span>
            <div className="space-y-2 text-sm">
              {[
                { l: "Full Name", v: selected.name },
                { l: "Aliases", v: selected.aliases.join(", ") || "None" },
                { l: "Age / Gender", v: `${selected.age} / ${selected.gender}` },
                { l: "FIR Count", v: `${selected.firs} registered` },
                { l: "Status", v: selected.absconding ? "⚠️ ABSCONDING" : selected.arrested ? "🔒 In Custody" : "At Large" },
                { l: "Last Location", v: selected.location },
                { l: "Gang", v: selected.gang || "No affiliation" },
              ].map(item => (
                <div key={item.l} className="flex justify-between py-2" style={{ borderBottom: "1px solid rgba(30,64,120,0.2)" }}>
                  <span style={{ color: "var(--text-muted)" }}>{item.l}</span>
                  <span style={{ color: "var(--text-primary)" }}>{item.v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/dashboard/graph" className="btn-primary text-xs px-3 py-2 no-underline">🕸️ View Network</Link>
              <Link href="/dashboard/chat" className="btn-ghost text-xs px-3 py-2 no-underline">🤖 Ask AI</Link>
              <Link href="/dashboard/reports" className="btn-ghost text-xs px-3 py-2 no-underline">📄 Report</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
