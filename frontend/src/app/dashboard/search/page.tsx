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
    await new Promise(r => setTimeout(r, 700));
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
    await new Promise(r => setTimeout(r, 600));
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Unified Police Intelligence Search
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Full-text vector search across FIR records, suspect mugshots, ANPR vehicle plates, and cell numbers
        </p>
      </div>

      {/* Full Text Vector Search */}
      <div className="chart-container border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <h3 className="text-sm font-bold text-slate-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Full-Text & Semantic Query
          </h3>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              className="pg-input text-xs pl-9 py-2.5"
              placeholder="Query any name, FIR number, location, vehicle plate, or keyword..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <button onClick={handleSearch} disabled={loading} className="btn-primary text-xs px-6 py-2.5 font-semibold shadow-md flex items-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Execute Search"}
          </button>
        </div>

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
            {[
              { title: "📋 Case Files (FIRs)", items: results.firs as { fir: string; cat: string; location: string; relevance: number }[], key: "fir" },
              { title: "👤 Suspect Profiles", items: results.suspects as { name: string; id: string; relevance: number }[], key: "name" },
              { title: "🚗 Vehicle Records", items: results.vehicles as { plate: string; model: string; relevance: number }[], key: "plate" },
            ].map(group => (
              <div key={group.title} className="space-y-3">
                <h4 className="text-xs font-bold text-blue-400 font-mono tracking-wider">{group.title}</h4>
                {group.items.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all">
                    <p className="text-xs font-bold text-slate-100">
                      {(item as unknown as Record<string, string>)[group.key]}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                      <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                        {"cat" in item ? (item as { cat: string }).cat : "id" in item ? (item as { id: string }).id : (item as { model: string }).model}
                      </p>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
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
      <div className="chart-container border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            Specialized Entity Deep Lookup
          </h3>
          
          <div className="flex gap-2">
            {[
              { id: "vehicle", label: "🚗 ANPR Vehicle Lookup" },
              { id: "phone", label: "📱 Telecom CDR Lookup" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setLookupType(t.id); setLookupResult(null); }}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                  lookupType === t.id ? "bg-blue-600/20 text-blue-400 border border-blue-500/40" : "text-slate-400 hover:text-slate-200"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <input
            className="pg-input text-xs flex-1 font-mono"
            placeholder={lookupType === "vehicle" ? "Enter registration number e.g. KA-01-AB-1234" : "Enter phone number e.g. +91 9876543210"}
            value={lookupValue}
            onChange={e => setLookupValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLookup()}
          />
          <button onClick={handleLookup} disabled={loading} className="btn-primary text-xs px-6 font-semibold">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Lookup Entity"}
          </button>
        </div>

        {lookupResult && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-blue-400 font-mono tracking-wider">ENTITY RECORD DISCOVERY</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(lookupResult).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono capitalize">{k.replace(/([A-Z])/g, " $1")}</p>
                  <p className="text-xs font-semibold text-slate-100 mt-0.5 truncate">
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
