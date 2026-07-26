"use client";
import { useState } from "react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  open: "status-open",
  under_investigation: "status-investigation",
  chargesheeted: "status-chargesheeted",
  closed: "status-closed",
};

const CATEGORIES = ["All Categories", "Robbery", "Cybercrime", "Murder", "Narcotics", "Assault", "Burglary", "Vehicle Theft", "Missing Person", "Economic Offence"];
const STATUSES = ["All Statuses", "Open", "Under Investigation", "Chargesheeted", "Closed"];

const mockFIRs = [
  { id: "f1", fir: "CR-045/2024", date: "10-Mar-2024", cat: "Robbery", location: "Koramangala 5th Block", district: "Bangalore South", status: "open", officer: "SI Priya Sharma", suspects: 3, urgency: 0.87, aiSummary: "Armed robbery at petrol station. High-resolution CCTV footage available. Primary suspect linked to Bangalore South syndicate." },
  { id: "f2", fir: "CR-089/2024", date: "22-May-2024", cat: "Cybercrime", location: "Whitefield IT Park", district: "Bangalore East", status: "under_investigation", officer: "Insp Ramesh Kumar", suspects: 1, urgency: 0.72, aiSummary: "Online UPI banking fraud. ₹4.5L drained via phishing link. Money trail traced to offshore proxy account." },
  { id: "f3", fir: "CR-112/2023", date: "15-Nov-2023", cat: "Murder", location: "Mysore Road Junction", district: "Bangalore South", status: "chargesheeted", officer: "Insp Ramesh Kumar", suspects: 2, urgency: 0.95, aiSummary: "Homicide case. Chargesheet submitted to magistrate. Forensic DNA reports attached to evidence vault." },
  { id: "f4", fir: "CR-034/2024", date: "08-Jan-2024", cat: "Narcotics", location: "KR Market Hub", district: "Bangalore Central", status: "open", officer: "SI Priya Sharma", suspects: 4, urgency: 0.81, aiSummary: "Inter-state drug distribution ring. 2.3kg commercial grade MDMA seized near transit depot." },
  { id: "f5", fir: "CR-078/2024", date: "15-Apr-2024", cat: "Vehicle Theft", location: "Jayanagar 4th Block", district: "Bangalore South", status: "open", officer: "PSI Arjun Nair", suspects: 2, urgency: 0.55, aiSummary: "Silver Honda City stolen from parking lot. ANPR camera detected fake registration plate on Highway 275." },
  { id: "f6", fir: "CR-201/2024", date: "02-Jun-2024", cat: "Cybercrime", location: "Indiranagar 100ft Rd", district: "Bangalore East", status: "open", officer: "SI Priya Sharma", suspects: 1, urgency: 0.68, aiSummary: "Executive social media impersonation and extortion scheme. Digital forensics underway." },
  { id: "f7", fir: "CR-156/2024", date: "20-May-2024", cat: "Burglary", location: "Rajajinagar 2nd Stage", district: "Bangalore West", status: "under_investigation", officer: "Insp Ramesh Kumar", suspects: 3, urgency: 0.63, aiSummary: "Residential break-in. Gold ornaments stolen. Modus operandi matches serial burglary pattern." },
  { id: "f8", fir: "CR-099/2024", date: "30-Mar-2024", cat: "Assault", location: "Shivajinagar Bus Stand", district: "Bangalore Central", status: "chargesheeted", officer: "PSI Arjun Nair", suspects: 2, urgency: 0.45, aiSummary: "Commercial establishment altercation. Minor injury. Statements recorded from eyewitnesses." },
];

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [selectedFIR, setSelectedFIR] = useState<typeof mockFIRs[0] | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const filtered = mockFIRs.filter(f => {
    const matchSearch = !search || f.fir.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase()) || f.cat.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All Categories" || f.cat === category;
    const matchStatus = status === "All Statuses" || f.status.includes(status.toLowerCase().replace(" ", "_"));
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            FIR & Case File Database
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, filter, and inspect official First Information Reports across Karnataka police stations
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowUpload(true)} className="btn-ghost text-xs px-4 py-2 flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload PDF FIR
          </button>
          <Link href="/dashboard/chat" className="btn-primary text-xs px-4 py-2 flex items-center gap-2 no-underline shadow-md">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            AI Case Assistant
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex gap-3 flex-wrap items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <input
            id="fir-search"
            type="text"
            className="pg-input text-xs pl-9 py-2"
            placeholder="Search by FIR Number, Location, or Category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        <select className="pg-input text-xs py-2 w-44" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="pg-input text-xs py-2 w-44" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <span className="text-xs text-slate-400 font-mono px-2">
          {filtered.length} Case Records Found
        </span>
      </div>

      {/* Main Layout Grid */}
      <div className={`grid gap-6 ${selectedFIR ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        {/* Table Container */}
        <div className={`chart-container overflow-hidden p-0 border border-slate-800 ${selectedFIR ? "lg:col-span-2" : ""}`}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>FIR Number</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>AI Urgency Index</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-300 font-mono text-sm">
                      No cases match these filters — try widening the date range
                    </td>
                  </tr>
                ) : (
                  filtered.map(f => (
                    <tr key={f.id} className="cursor-pointer group"
                      onClick={() => setSelectedFIR(f === selectedFIR ? null : f)}
                      style={{ background: selectedFIR?.id === f.id ? "rgba(37,99,235,0.15)" : undefined }}>
                      <td>
                        <span className="font-mono text-xs font-bold text-[#2563eb] group-hover:text-blue-400 transition-colors">{f.fir}</span>
                      </td>
                      <td className="text-xs text-slate-400 font-mono">{f.date}</td>
                      <td>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-blue-500/10 border border-blue-500/20 text-slate-300">{f.cat}</span>
                      </td>
                      <td className="text-xs text-slate-300 max-w-xs truncate">{f.location}</td>
                      <td>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${STATUS_COLORS[f.status]}`}>
                          {f.status === "under_investigation" ? "Investigating" : f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${f.urgency * 100}%`, background: f.urgency > 0.8 ? "#dc2626" : f.urgency > 0.6 ? "#2563eb" : "#0284c7" }} />
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {Math.round(f.urgency * 100)}%
                          </span>
                      </div>
                    </td>
                    <td>
                      <button className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors font-medium"
                        onClick={e => { e.stopPropagation(); setSelectedFIR(f); }}>
                        Inspect
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected FIR Detail Drawer */}
        {selectedFIR && (
          <div className="chart-container space-y-4 border border-blue-500/30 bg-slate-950/80 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-blue-400 font-mono tracking-wide">
                  {selectedFIR.fir}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedFIR.date} • {selectedFIR.district}</p>
              </div>
              <button onClick={() => setSelectedFIR(null)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[selectedFIR.status]}`}>
                {selectedFIR.status.replace("_", " ").toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 font-mono">Urgency: {Math.round(selectedFIR.urgency * 100)}%</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { label: "Crime Category", value: selectedFIR.cat },
                { label: "Incident Location", value: selectedFIR.location },
                { label: "Jurisdiction Police District", value: selectedFIR.district },
                { label: "Investigating Officer", value: selectedFIR.officer },
                { label: "Linked Suspect Profiles", value: `${selectedFIR.suspects} Persons Identified` },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-200 font-medium text-right">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                AI Grounded Summary
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedFIR.aiSummary}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Link href="/dashboard/chat" className="btn-primary text-xs py-2 px-3 no-underline flex-1 justify-center font-semibold">
                Ask POLICEGPT about Case →
              </Link>
              <Link href="/dashboard/reports" className="btn-ghost text-xs py-2 px-3 no-underline">
                Generate Dossier
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setShowUpload(false)}>
          <div className="glass-card p-6 w-full max-w-md border border-blue-500/30 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-200 text-base flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload FIR Document (PDF)
              </h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-500 hover:text-slate-300">✕</button>
            </div>

            <div className="border-2 border-dashed border-blue-500/30 hover:border-blue-400 rounded-2xl p-8 text-center bg-slate-900/40 transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-200">Drag and drop PDF file here</p>
              <p className="text-[11px] text-slate-500 mt-1">Automatic OCR extraction for Kannada & English FIRs (Max 50MB)</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="btn-primary flex-1 text-xs py-2.5 justify-center">Upload & Process with OCR</button>
              <button className="btn-ghost text-xs px-4" onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
