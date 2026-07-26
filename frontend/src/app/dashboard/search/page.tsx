"use client";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<null | { firs: unknown[]; suspects: unknown[]; vehicles: unknown[] }>(null);
  const [loading, setLoading] = useState(false);
  const [lookupType, setLookupType] = useState("vehicle");
  const [lookupValue, setLookupValue] = useState("");
  const [lookupResult, setLookupResult] = useState<null | Record<string, unknown>>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setResults({
      firs: [
        { fir: "CR-045/2024", cat: "Armed Robbery", location: "Koramangala 5th Block", relevance: 0.94 },
        { fir: "CR-089/2024", cat: "Cyber Fraud", location: "Whitefield IT Park", relevance: 0.88 },
      ],
      suspects: [
        { name: "Ravi Kumar S", id: "KSP-CR-2024-0001", relevance: 0.91 },
      ],
      vehicles: [
        { plate: "KA-01-AB-1234", model: "Hyundai i20 (White)", relevance: 0.76 },
      ]
    });
    setLoading(false);
  };

  const handleLookup = async () => {
    if (!lookupValue.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (lookupType === "vehicle") {
      setLookupResult({
        registration: lookupValue.toUpperCase(),
        makeModel: "Hyundai i20 Sportz",
        color: "Polar White",
        registeredOwner: "Ravi Kumar S",
        linkedFIRs: ["CR-045/2024", "CR-089/2023"],
        stolenStatus: "FLAGGED IN CRIME SCENE",
        lastANPRLocation: "Silk Board Flyover ANPR Cam-04 (10-Mar-2024 22:10 IST)"
      });
    } else {
      setLookupResult({
        mobileNumber: lookupValue,
        subscriberName: "Ravi Kumar S",
        carrierOperator: "Reliance Jio Infocomm",
        simIMEI: "867493021948571",
        linkedCases: ["CR-045/2024"],
        towerPingCount: 45,
        lastKnownTowerSector: "Shivajinagar Station Cell Tower 3B"
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
          Unified Police Intelligence Search
        </h1>
        <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
          Full-text vector search across FIR records, suspect mugshots, ANPR vehicle plates, and cell numbers
        </p>
      </div>

      {/* Full Text Vector Search */}
      <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #141a28", paddingBottom: "10px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }}>
            Full-Text & Semantic Query
          </h3>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <input
            className="pg-input"
            style={{ fontSize: "0.8rem", padding: "10px 14px", flex: 1 }}
            placeholder="Query any name, FIR number, location, vehicle plate, or keyword..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading} className="btn-primary" style={{ fontSize: "0.75rem", padding: "10px 20px" }}>
            {loading ? "Searching..." : "Execute Search"}
          </button>
        </div>

        {results && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", paddingTop: "12px", borderTop: "1px solid #141a28" }}>
            {[
              { title: "📋 Case Files (FIRs)", items: results.firs as { fir: string; cat: string; location: string; relevance: number }[], key: "fir" },
              { title: "👤 Suspect Profiles", items: results.suspects as { name: string; id: string; relevance: number }[], key: "name" },
              { title: "🚗 Vehicle Records", items: results.vehicles as { plate: string; model: string; relevance: number }[], key: "plate" },
            ].map(group => (
              <div key={group.title} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#60a5fa", fontFamily: "var(--font-mono)" }}>{group.title}</h4>
                {group.items.map((item, i) => (
                  <div key={i} className="glass-card glass-card-hover" style={{ padding: "12px" }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f8fafc" }}>
                      {(item as unknown as Record<string, string>)[group.key]}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #141a28" }}>
                      <p style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        {"cat" in item ? (item as { cat: string }).cat : "id" in item ? (item as { id: string }).id : (item as { model: string }).model}
                      </p>
                      <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#10b981", marginLeft: "auto" }}>
                        {Math.round((item as { relevance: number }).relevance * 100)}% match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specialized Entity Lookups */}
      <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #141a28", paddingBottom: "10px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }}>
            Specialized Entity Deep Lookup
          </h3>
          
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { id: "vehicle", label: "🚗 ANPR Vehicle Lookup" },
              { id: "phone", label: "📱 Telecom CDR Lookup" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setLookupType(t.id); setLookupResult(null); }}
                style={{
                  fontSize: "0.72rem", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: 600,
                  background: lookupType === t.id ? "rgba(59,130,246,0.15)" : "transparent",
                  color: lookupType === t.id ? "#60a5fa" : "#64748b",
                  border: lookupType === t.id ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent"
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <input
            className="pg-input"
            style={{ fontSize: "0.8rem", padding: "10px 14px", flex: 1, fontFamily: "var(--font-mono)" }}
            placeholder={lookupType === "vehicle" ? "Enter registration number e.g. KA-01-AB-1234" : "Enter phone number e.g. +91 9876543210"}
            value={lookupValue}
            onChange={e => setLookupValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLookup()}
          />
          <button onClick={handleLookup} disabled={loading} className="btn-primary" style={{ fontSize: "0.75rem", padding: "10px 20px" }}>
            {loading ? "Looking up..." : "Lookup Entity"}
          </button>
        </div>

        {lookupResult && (
          <div style={{ padding: "14px", borderRadius: "8px", background: "#05070a", border: "1px solid #141a28", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#60a5fa", fontFamily: "var(--font-mono)" }}>ENTITY RECORD DISCOVERY</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {Object.entries(lookupResult).map(([k, v]) => (
                <div key={k} style={{ padding: "10px", borderRadius: "6px", background: "#000000", border: "1px solid #141a28" }}>
                  <p style={{ fontSize: "0.65rem", color: "#64748b", fontFamily: "var(--font-mono)", textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1")}</p>
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#f8fafc", marginTop: "2px" }}>
                    {Array.isArray(v) ? v.join(", ") : String(v)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
