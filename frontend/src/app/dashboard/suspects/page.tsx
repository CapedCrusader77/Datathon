"use client";
import { useState } from "react";
import Link from "next/link";

const suspects = [
  { id: "s1", criminal_id: "KSP-CR-2024-0001", name: "Ravi Kumar S", aliases: ["Ravi Bhai", "King"], age: 34, gender: "Male",
    risk: "extreme", firs: 12, gang: "Bengaluru South Syndicate", arrested: false, absconding: true, location: "Shivajinagar (suspected)", categories: ["Armed Robbery", "Assault", "Extortion"] },
  { id: "s2", criminal_id: "KSP-CR-2023-0045", name: "Mohammed Irfan K", aliases: ["Irfan Bhai"], age: 28, gender: "Male",
    risk: "high", firs: 7, gang: null, arrested: true, absconding: false, location: "Central Prison, Parappana Agrahara", categories: ["Cybercrime", "Phishing Fraud"] },
  { id: "s3", criminal_id: "KSP-CR-2022-0078", name: "Venkatesh P", aliases: ["Venki"], age: 41, gender: "Male",
    risk: "high", firs: 5, gang: "Mysore Highway Network", arrested: false, absconding: false, location: "Mysore City Center", categories: ["Narcotics Smuggling", "Robbery"] },
  { id: "s4", criminal_id: "KSP-CR-2024-0102", name: "Suresh M", aliases: ["Suresh Anna"], age: 31, gender: "Male",
    risk: "medium", firs: 3, gang: "Bengaluru South Syndicate", arrested: false, absconding: false, location: "BTM Layout 2nd Stage", categories: ["Burglary"] },
  { id: "s5", criminal_id: "KSP-CR-2023-0189", name: "Deepa R", aliases: ["Riya"], age: 26, gender: "Female",
    risk: "medium", firs: 2, gang: null, arrested: true, absconding: false, location: "Parappana Agrahara Custody", categories: ["UPI Scam Fraud"] },
];

const riskBadge = (r: string) => ({
  extreme: { class: "risk-extreme", label: "EXTREME RISK" },
  high:    { class: "risk-high",    label: "HIGH RISK" },
  medium:  { class: "risk-medium",  label: "MEDIUM RISK" },
  low:     { class: "risk-low",     label: "LOW RISK" },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Criminal Intelligence & Suspect Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Criminal registry, repeat offender risk scoring, and intelligence linkage
          </p>
        </div>
        <Link href="/dashboard/graph" className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 no-underline shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/>
            <line x1="8.5" y1="7.5" x2="15.5" y2="7.5"/><line x1="7.5" y1="8.5" x2="10.5" y2="15.5"/><line x1="16.5" y1="8.5" x2="13.5" y2="15.5"/>
          </svg>
          Open Network Graph →
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex gap-3 flex-wrap items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            className="pg-input text-xs pl-9 py-2"
            placeholder="Search by Suspect Name, Alias, or Criminal ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "all", label: "All Profiles" },
            { id: "absconding", label: "⚠️ Absconding" },
            { id: "arrested", label: "🔒 In Custody" },
            { id: "repeat", label: "Repeat Offenders (5+ FIRs)" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                filter === f.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className={`grid gap-6 ${selected ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Suspect Cards Grid */}
        <div className={`${selected ? "lg:col-span-2" : ""} grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start`}>
          {filtered.map(s => {
            const rb = riskBadge(s.risk);
            return (
              <div key={s.id}
                onClick={() => setSelected(s === selected ? null : s)}
                className={`glass-card p-5 cursor-pointer relative overflow-hidden transition-all duration-300 ${
                  selected?.id === s.id ? "border-blue-500/60 shadow-[0_0_25px_rgba(59,130,246,0.25)] bg-slate-900/80" : "hover:border-slate-700"
                }`}>
                
                {/* Card Top */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner"
                    style={{
                      background: s.risk === "extreme" ? "rgba(239,68,68,0.15)" : s.risk === "high" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)",
                      border: `1px solid ${s.risk === "extreme" ? "rgba(239,68,68,0.4)" : s.risk === "high" ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.4)"}`,
                      color: s.risk === "extreme" ? "#f87171" : s.risk === "high" ? "#fbbf24" : "#60a5fa",
                    }}>
                    {s.name.charAt(0)}
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider ${rb.class}`}>
                    {rb.label}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 mb-0.5">{s.name}</h3>
                <p className="text-[11px] font-mono text-blue-400 mb-1.5">{s.criminal_id}</p>

                {s.aliases.length > 0 && (
                  <p className="text-xs text-slate-400 italic mb-3">
                    aka &quot;{s.aliases.join(', ')}&quot;
                  </p>
                )}

                <div className="flex items-center gap-2 mb-3">
                  {s.absconding && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full risk-extreme animate-pulse">
                      🚨 ABSCONDING
                    </span>
                  )}
                  {s.arrested && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full risk-low">
                      🔒 IN CUSTODY
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div><span>FIR Count: </span><span className="font-bold font-mono text-slate-200">{s.firs}</span></div>
                  <div>Age / Sex: <span className="text-slate-200 font-medium">{s.age} / {s.gender}</span></div>
                  {s.gang && <div className="col-span-2 text-slate-400 truncate">Gang: <span className="text-blue-300 font-medium">{s.gang}</span></div>}
                </div>

                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {s.categories.map(c => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Suspect Profile Drawer */}
        {selected && (
          <div className="chart-container space-y-4 border border-blue-500/30 bg-slate-950/90 shadow-2xl sticky top-0 max-h-[700px] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-slate-100">{selected.name}</h3>
                <p className="text-xs font-mono text-blue-400 mt-0.5">{selected.criminal_id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 text-slate-500 hover:text-slate-200">✕</button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${riskBadge(selected.risk).class}`}>
                {riskBadge(selected.risk).label}
              </span>
              {selected.absconding && <span className="text-xs text-red-400 font-semibold animate-pulse">⚠️ BOLO ALERT</span>}
            </div>

            <div className="space-y-2 text-xs">
              {[
                { l: "Full Name", v: selected.name },
                { l: "Known Aliases", v: selected.aliases.join(", ") || "None" },
                { l: "Age / Gender", v: `${selected.age} yrs / ${selected.gender}` },
                { l: "Linked FIR Count", v: `${selected.firs} Records Registered` },
                { l: "Legal Status", v: selected.absconding ? "🚨 Absconding (Active Warrant)" : selected.arrested ? "🔒 In Judicial Custody" : "At Large" },
                { l: "Last Known Location", v: selected.location },
                { l: "Syndicate Affiliation", v: selected.gang || "No Known Affiliation" },
              ].map(item => (
                <div key={item.l} className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-500">{item.l}</span>
                  <span className="text-slate-200 font-medium text-right">{item.v}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap pt-2">
              <Link href="/dashboard/graph" className="btn-primary text-xs py-2 px-3 no-underline flex-1 justify-center font-semibold">
                🕸️ Graph Network
              </Link>
              <Link href="/dashboard/chat" className="btn-ghost text-xs py-2 px-3 no-underline">
                🤖 AI Query
              </Link>
              <Link href="/dashboard/reports" className="btn-ghost text-xs py-2 px-3 no-underline">
                📄 Print Dossier
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
