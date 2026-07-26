"use client";
import { useState } from "react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  open: "status-open",
  under_investigation: "status-investigation",
  chargesheeted: "status-chargesheeted",
  closed: "status-closed",
};

const CATEGORIES = ["All", "Robbery", "Cybercrime", "Murder", "Narcotics", "Assault", "Burglary", "Vehicle Theft", "Missing Person", "Economic Offence"];
const STATUSES = ["All", "Open", "Under Investigation", "Chargesheeted", "Closed"];

const mockFIRs = [
  { id: "f1", fir: "CR-045/2024", date: "10-Mar-2024", cat: "Robbery",    location: "Koramangala 5th Block",    district: "Bangalore South",  status: "open",               officer: "SI Priya Sharma",   suspects: 3, urgency: 0.87, aiSummary: "Armed robbery at petrol station. CCTV available." },
  { id: "f2", fir: "CR-089/2024", date: "22-May-2024", cat: "Cybercrime", location: "Whitefield",               district: "Bangalore East",   status: "under_investigation",officer: "Insp Ramesh Kumar", suspects: 1, urgency: 0.72, aiSummary: "Online UPI fraud. ₹4.5L stolen via phishing." },
  { id: "f3", fir: "CR-112/2023", date: "15-Nov-2023", cat: "Murder",     location: "Mysore Road",              district: "Bangalore South",  status: "chargesheeted",      officer: "Insp Ramesh Kumar", suspects: 2, urgency: 0.95, aiSummary: "Homicide. Chargesheet filed. Trial pending." },
  { id: "f4", fir: "CR-034/2024", date: "08-Jan-2024", cat: "Narcotics",  location: "KR Market",                district: "Bangalore Central",status: "open",               officer: "SI Priya Sharma",   suspects: 4, urgency: 0.81, aiSummary: "Drug network. 2.3kg MDMA seized." },
  { id: "f5", fir: "CR-078/2024", date: "15-Apr-2024", cat: "Vehicle Theft","location": "Jayanagar 4T Block",  district: "Bangalore South",  status: "open",               officer: "PSI Arjun Nair",    suspects: 2, urgency: 0.55, aiSummary: "Honda City stolen. Plate spotted on CCTV." },
  { id: "f6", fir: "CR-201/2024", date: "02-Jun-2024", cat: "Cybercrime", location: "Indiranagar",              district: "Bangalore East",   status: "open",               officer: "SI Priya Sharma",   suspects: 1, urgency: 0.68, aiSummary: "Social media impersonation. Financial fraud." },
  { id: "f7", fir: "CR-156/2024", date: "20-May-2024", cat: "Burglary",   location: "Rajajinagar",              district: "Bangalore West",   status: "under_investigation",officer: "Insp Ramesh Kumar", suspects: 3, urgency: 0.63, aiSummary: "House break-in. Jewelry stolen. MO matches prior." },
  { id: "f8", fir: "CR-099/2024", date: "30-Mar-2024", cat: "Assault",    location: "Shivajinagar",             district: "Bangalore Central",status: "chargesheeted",      officer: "PSI Arjun Nair",    suspects: 2, urgency: 0.45, aiSummary: "Bar fight escalated. One victim hospitalized." },
];

export default function CasesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedFIR, setSelectedFIR] = useState<typeof mockFIRs[0] | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const filtered = mockFIRs.filter(f => {
    const matchSearch = !search || f.fir.toLowerCase().includes(search.toLowerCase()) || f.location.toLowerCase().includes(search.toLowerCase()) || f.cat.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || f.cat === category;
    const matchStatus = status === "All" || f.status.includes(status.toLowerCase().replace(" ", "_"));
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            FIR & Case Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {mockFIRs.length} cases • Search, filter, and manage First Information Reports
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowUpload(true)} className="btn-ghost text-sm px-4 py-2">
            📤 Upload PDF FIR
          </button>
          <Link href="/dashboard/chat" className="btn-primary text-sm px-4 py-2 no-underline">
            🤖 Ask AI
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input id="fir-search" type="text" className="pg-input" style={{ width: "260px" }}
          placeholder="🔍 Search by FIR, location, category..."
          value={search} onChange={e => setSearch(e.target.value)} />

        <select className="pg-input" style={{ width: "160px" }}
          value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="pg-input" style={{ width: "200px" }}
          value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <span>{filtered.length} results</span>
        </div>
      </div>

      <div className={`grid gap-4 ${selectedFIR ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* Table */}
        <div className="chart-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>FIR Number</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Urgency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id} className="cursor-pointer"
                    onClick={() => setSelectedFIR(f === selectedFIR ? null : f)}
                    style={{ background: selectedFIR?.id === f.id ? "rgba(59,130,246,0.08)" : undefined }}>
                    <td>
                      <span className="font-mono text-xs" style={{ color: "var(--accent-blue-bright)" }}>{f.fir}</span>
                    </td>
                    <td className="text-xs" style={{ color: "var(--text-muted)" }}>{f.date}</td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(59,130,246,0.1)", color: "var(--text-secondary)" }}>{f.cat}</span>
                    </td>
                    <td className="text-xs max-w-xs truncate" style={{ color: "var(--text-secondary)" }}>{f.location}</td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[f.status]}`}>
                        {f.status === "under_investigation" ? "Investigating" : f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-1.5 rounded-full"
                            style={{ width: `${f.urgency * 100}%`, background: f.urgency > 0.8 ? "#ef4444" : f.urgency > 0.6 ? "#f59e0b" : "#10b981" }} />
                        </div>
                        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                          {Math.round(f.urgency * 100)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="text-xs px-2 py-1 rounded hover:bg-blue-600/20 transition-colors"
                          style={{ color: "var(--accent-blue)" }}
                          onClick={e => { e.stopPropagation(); setSelectedFIR(f); }}>View</button>
                        <Link href="/dashboard/chat"
                          className="text-xs px-2 py-1 rounded hover:bg-purple-600/20 transition-colors no-underline"
                          style={{ color: "#8b5cf6" }}
                          onClick={e => e.stopPropagation()}>AI</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedFIR && (
          <div className="chart-container space-y-4 overflow-y-auto" style={{ maxHeight: "600px" }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg" style={{ color: "var(--accent-blue-bright)", fontFamily: "monospace" }}>
                  {selectedFIR.fir}
                </h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{selectedFIR.date} • {selectedFIR.district}</p>
              </div>
              <button onClick={() => setSelectedFIR(null)} style={{ color: "var(--text-muted)" }}>✕</button>
            </div>

            <div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[selectedFIR.status]}`}>
                {selectedFIR.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: "Category", value: selectedFIR.cat },
                { label: "Location", value: selectedFIR.location },
                { label: "District", value: selectedFIR.district },
                { label: "Officer", value: selectedFIR.officer },
                { label: "Suspects", value: `${selectedFIR.suspects} identified` },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2"
                  style={{ borderBottom: "1px solid rgba(30,64,120,0.2)" }}>
                  <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
                  <span style={{ color: "var(--text-primary)" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent-blue)" }}>🤖 AI Summary</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{selectedFIR.aiSummary}</p>
            </div>

            <div className="flex gap-2">
              <Link href="/dashboard/chat" className="btn-primary text-xs px-3 py-2 no-underline flex-1 justify-center">
                Ask AI about this case
              </Link>
              <Link href="/dashboard/reports" className="btn-ghost text-xs px-3 py-2 no-underline">
                📄 Report
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowUpload(false)}>
          <div className="glass-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>📤 Upload PDF FIR</h3>
            <div className="border-2 border-dashed rounded-lg p-8 text-center mb-4"
              style={{ borderColor: "var(--border-primary)" }}>
              <p className="text-4xl mb-2">📋</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Drop PDF FIR here or click to browse</p>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Supports: PDF, scanned images. Max 50MB</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1 text-sm">Upload & Parse with OCR</button>
              <button className="btn-ghost text-sm px-4" onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
