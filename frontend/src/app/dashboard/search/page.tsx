"use client";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<null | { firs: unknown[]; suspects: unknown[]; vehicles: unknown[] }>(null);
  const [loading, setLoading] = useState(false);
  const [lookupType, setLookupType] = useState("unified");
  const [lookupValue, setLookupValue] = useState("");
  const [lookupResult, setLookupResult] = useState<null | Record<string, unknown>>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setResults({
      firs: [
        { fir: "CR-045/2024", cat: "Robbery", location: "Koramangala", relevance: 0.92 },
        { fir: "CR-089/2024", cat: "Cybercrime", location: "Whitefield", relevance: 0.87 },
      ],
      suspects: [
        { name: "Ravi Kumar S", id: "KSP-CR-2024-0001", relevance: 0.88 },
      ],
      vehicles: [
        { plate: "KA-01-AB-1234", model: "Hyundai i20 White", relevance: 0.71 },
      ]
    });
    setLoading(false);
  };

  const handleLookup = async () => {
    if (!lookupValue.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (lookupType === "vehicle") {
      setLookupResult({
        registration: lookupValue.toUpperCase(),
        make: "Hyundai", model: "i20", color: "White", year: 2019,
        owner: "Ravi Kumar S", firs: ["CR-045/2024", "CR-089/2023"],
        stolen: false, lastSeen: "10-Mar-2024, Koramangala"
      });
    } else {
      setLookupResult({
        number: lookupValue,
        subscriber: "Ravi Kumar S",
        operator: "Jio", imei: "35XXXXXXXXXXXXXXX",
        firs: ["CR-045/2024"], towerPings: 45,
        lastLocation: "Shivajinagar, Bangalore"
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
          Unified Search
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Search across FIRs, suspects, vehicles, phones, weapons
        </p>
      </div>

      {/* Unified Search */}
      <div className="chart-container space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>🔍 Full-Text Search</h3>
        <div className="flex gap-3">
          <input className="pg-input flex-1" placeholder="Search anything — name, FIR number, location, category..."
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()} />
          <button onClick={handleSearch} disabled={loading} className="btn-primary px-6">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Search"}
          </button>
        </div>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              { title: "📋 FIRs", items: results.firs as { fir: string; cat: string; location: string; relevance: number }[], key: "fir" },
              { title: "👤 Suspects", items: results.suspects as { name: string; id: string; relevance: number }[], key: "name" },
              { title: "🚗 Vehicles", items: results.vehicles as { plate: string; model: string; relevance: number }[], key: "plate" },
            ].map(group => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold mb-2" style={{ color: "var(--accent-blue)" }}>{group.title} ({group.items.length})</h4>
                {group.items.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg mb-2 glass-card-hover cursor-pointer"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {(item as Record<string, string>)[group.key]}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {"cat" in item ? (item as { cat: string }).cat : "id" in item ? (item as { id: string }).id : (item as { model: string }).model}
                      </p>
                      <span className="text-xs font-semibold" style={{ color: "#10b981" }}>
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

      {/* Specific Lookups */}
      <div className="chart-container space-y-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>🔎 Specific Lookups</h3>
        <div className="flex gap-3 flex-wrap">
          {["vehicle", "phone"].map(t => (
            <button key={t} onClick={() => { setLookupType(t); setLookupResult(null); }}
              className={`text-sm px-4 py-2 rounded-lg transition-all capitalize ${lookupType === t ? "btn-primary" : "btn-ghost"}`}>
              {t === "vehicle" ? "🚗 Vehicle Lookup" : "📱 Phone Lookup"}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input className="pg-input flex-1"
            placeholder={lookupType === "vehicle" ? "Enter registration number e.g. KA-01-AB-1234" : "Enter phone number e.g. +91 9876543210"}
            value={lookupValue} onChange={e => setLookupValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLookup()} />
          <button onClick={handleLookup} disabled={loading} className="btn-primary px-6">Lookup</button>
        </div>

        {lookupResult && (
          <div className="p-4 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-primary)" }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(lookupResult).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>{k.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-sm font-medium" style={{ color: Array.isArray(v) ? "var(--accent-blue)" : "var(--text-primary)" }}>
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
