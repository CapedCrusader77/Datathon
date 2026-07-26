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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
            Criminal Intelligence & Suspect Profiles
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
            Criminal registry, repeat offender risk scoring, and intelligence linkage
          </p>
        </div>
        <Link href="/dashboard/graph" className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px 14px", textDecoration: "none" }}>
          🕸️ Open Network Graph →
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ padding: "12px 16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            type="text"
            className="pg-input"
            style={{ fontSize: "0.78rem", padding: "8px 12px" }}
            placeholder="Search by Suspect Name, Alias, or Criminal ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "6px", background: "#060810", padding: "4px", borderRadius: "8px", border: "1px solid #141a28" }}>
          {[
            { id: "all", label: "All Profiles" },
            { id: "absconding", label: "⚠️ Absconding" },
            { id: "arrested", label: "🔒 In Custody" },
            { id: "repeat", label: "Repeat (5+ FIRs)" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                fontSize: "0.72rem", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: 600,
                background: filter === f.id ? "#3b82f6" : "transparent",
                color: filter === f.id ? "#ffffff" : "#64748b"
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: "20px" }}>
        {/* Suspect Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", alignContent: "start" }}>
          {filtered.length === 0 ? (
            <div className="chart-container" style={{ padding: "40px", textAlign: "center", color: "#64748b", gridColumn: "1 / -1" }}>
              No suspect profiles match these parameters
            </div>
          ) : (
            filtered.map(s => {
              const rb = riskBadge(s.risk);
              return (
                <div key={s.id}
                  onClick={() => setSelected(s === selected ? null : s)}
                  className="glass-card glass-card-hover"
                  style={{
                    padding: "16px", cursor: "pointer",
                    borderColor: selected?.id === s.id ? "rgba(59,130,246,0.6)" : undefined,
                    boxShadow: selected?.id === s.id ? "0 0 20px rgba(59,130,246,0.2)" : undefined
                  }}>
                  
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "0.85rem",
                      background: s.risk === "extreme" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                      border: `1px solid ${s.risk === "extreme" ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`,
                      color: s.risk === "extreme" ? "#f87171" : "#60a5fa"
                    }}>
                      {s.name.charAt(0)}
                    </div>
                    <span className={rb.class} style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, marginLeft: "auto" }}>
                      {rb.label}
                    </span>
                  </div>

                  <h3 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f8fafc", marginBottom: "2px" }}>{s.name}</h3>
                  <p style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#3b82f6", marginBottom: "6px" }}>{s.criminal_id}</p>

                  {s.aliases.length > 0 && (
                    <p style={{ fontSize: "0.72rem", color: "#64748b", fontStyle: "italic", marginBottom: "8px" }}>
                      aka &quot;{s.aliases.join(', ')}&quot;
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                    {s.absconding && (
                      <span className="risk-extreme" style={{ fontSize: "0.62rem", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                        🚨 ABSCONDING
                      </span>
                    )}
                    {s.arrested && (
                      <span className="risk-low" style={{ fontSize: "0.62rem", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                        🔒 IN CUSTODY
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "0.72rem", color: "#64748b", borderTop: "1px solid #141a28", paddingTop: "8px" }}>
                    <div>FIRs: <span style={{ color: "#f1f5f9", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{s.firs}</span></div>
                    <div>Age: <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{s.age} yrs</span></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Suspect Profile Drawer */}
        {selected && (
          <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #141a28", paddingBottom: "10px" }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#f8fafc" }}>{selected.name}</h3>
                <p style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "#3b82f6", marginTop: "2px" }}>{selected.criminal_id}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: "#64748b", border: "none", background: "none", cursor: "pointer", marginLeft: "auto" }}>✕</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className={riskBadge(selected.risk).class} style={{ fontSize: "0.68rem", padding: "4px 8px", borderRadius: "4px", fontWeight: 700 }}>
                {riskBadge(selected.risk).label}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.75rem" }}>
              {[
                { l: "Full Name", v: selected.name },
                { l: "Known Aliases", v: selected.aliases.join(", ") || "None" },
                { l: "Age / Gender", v: `${selected.age} yrs / ${selected.gender}` },
                { l: "Linked FIR Count", v: `${selected.firs} Records` },
                { l: "Legal Status", v: selected.absconding ? "🚨 Absconding" : selected.arrested ? "🔒 In Custody" : "At Large" },
                { l: "Last Known Location", v: selected.location },
                { l: "Gang Affiliation", v: selected.gang || "None" },
              ].map(item => (
                <div key={item.l} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #0d1018", paddingBottom: "6px" }}>
                  <span style={{ color: "#475569" }}>{item.l}</span>
                  <span style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right", marginLeft: "auto" }}>{item.v}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px", paddingTop: "6px" }}>
              <Link href="/dashboard/graph" className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px", flex: 1, textAlign: "center", justifyContent: "center", textDecoration: "none" }}>
                🕸️ Graph Network
              </Link>
              <Link href="/dashboard/chat" className="btn-ghost" style={{ fontSize: "0.75rem", padding: "8px", textDecoration: "none" }}>
                AI Query
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
