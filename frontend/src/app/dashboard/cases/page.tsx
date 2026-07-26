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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
            FIR & Case File Database
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
            Access, filter, and inspect official First Information Reports across Karnataka police stations
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowUpload(true)} className="btn-ghost" style={{ fontSize: "0.75rem", padding: "8px 14px" }}>
            📤 Upload PDF FIR
          </button>
          <Link href="/dashboard/chat" className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px 14px", textDecoration: "none" }}>
            🛡️ AI Case Assistant
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card" style={{ padding: "12px 16px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "240px" }}>
          <input
            id="fir-search"
            type="text"
            className="pg-input"
            style={{ fontSize: "0.78rem", padding: "8px 12px" }}
            placeholder="Search by FIR Number, Location, or Category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="pg-input" style={{ fontSize: "0.78rem", padding: "8px 12px", width: "160px" }} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="pg-input" style={{ fontSize: "0.78rem", padding: "8px 12px", width: "160px" }} value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "var(--font-mono)", padding: "0 4px" }}>
          {filtered.length} Records Found
        </span>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: selectedFIR ? "1fr 340px" : "1fr", gap: "20px" }}>
        {/* Table Container */}
        <div className="chart-container" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
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
                    <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#64748b", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                      No cases match these filters — try widening search parameters
                    </td>
                  </tr>
                ) : (
                  filtered.map(f => (
                    <tr key={f.id} onClick={() => setSelectedFIR(f === selectedFIR ? null : f)}
                      style={{ cursor: "pointer", background: selectedFIR?.id === f.id ? "rgba(59,130,246,0.1)" : undefined }}>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700, color: "#60a5fa" }}>{f.fir}</span>
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "var(--font-mono)" }}>{f.date}</td>
                      <td>
                        <span style={{ fontSize: "0.7rem", padding: "3px 8px", borderRadius: "4px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#cbd5e1" }}>{f.cat}</span>
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "#e2e8f0" }}>{f.location}</td>
                      <td>
                        <span className={`status-pill ${STATUS_COLORS[f.status]}`} style={{ fontSize: "0.68rem", padding: "3px 8px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                          {f.status === "under_investigation" ? "Investigating" : f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "70px", height: "6px", borderRadius: "99px", background: "#0f172a", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: "99px", width: `${f.urgency * 100}%`, background: f.urgency > 0.8 ? "#ef4444" : f.urgency > 0.6 ? "#3b82f6" : "#0284c7" }} />
                          </div>
                          <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#94a3b8" }}>
                            {Math.round(f.urgency * 100)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <button className="btn-ghost" style={{ fontSize: "0.7rem", padding: "4px 8px" }}
                          onClick={e => { e.stopPropagation(); setSelectedFIR(f); }}>
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected FIR Detail Drawer */}
        {selectedFIR && (
          <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid #141a28", paddingBottom: "10px" }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#60a5fa", fontFamily: "var(--font-mono)" }}>
                  {selectedFIR.fir}
                </h3>
                <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>{selectedFIR.date} • {selectedFIR.district}</p>
              </div>
              <button onClick={() => setSelectedFIR(null)} style={{ color: "#64748b", fontSize: "1.2rem", background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className={`status-pill ${STATUS_COLORS[selectedFIR.status]}`} style={{ fontSize: "0.68rem", padding: "4px 8px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                {selectedFIR.status.replace("_", " ").toUpperCase()}
              </span>
              <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "var(--font-mono)" }}>Urgency: {Math.round(selectedFIR.urgency * 100)}%</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.75rem" }}>
              {[
                { label: "Crime Category", value: selectedFIR.cat },
                { label: "Incident Location", value: selectedFIR.location },
                { label: "Police District", value: selectedFIR.district },
                { label: "Investigating Officer", value: selectedFIR.officer },
                { label: "Linked Suspect Profiles", value: `${selectedFIR.suspects} Persons Identified` },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #0d1018", paddingBottom: "6px" }}>
                  <span style={{ color: "#475569" }}>{item.label}</span>
                  <span style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right", marginLeft: "auto" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#3b82f6", marginBottom: "4px" }}>
                🛡️ AI Grounded Summary
              </div>
              <p style={{ fontSize: "0.75rem", color: "#cbd5e1", lineHeight: 1.5 }}>{selectedFIR.aiSummary}</p>
            </div>

            <div style={{ display: "flex", gap: "8px", paddingTop: "6px" }}>
              <Link href="/dashboard/chat" className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px", flex: 1, textAlign: "center", justifyContent: "center", textDecoration: "none" }}>
                Ask POLICEGPT →
              </Link>
              <Link href="/dashboard/reports" className="btn-ghost" style={{ fontSize: "0.75rem", padding: "8px", textDecoration: "none" }}>
                Dossier
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowUpload(false)}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #141a28", paddingBottom: "10px" }}>
              <h3 style={{ fontWeight: 700, color: "#f8fafc", fontSize: "0.95rem" }}>
                📤 Upload FIR Document (PDF)
              </h3>
              <button onClick={() => setShowUpload(false)} style={{ color: "#64748b", border: "none", background: "none", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ border: "2px dashed rgba(59,130,246,0.3)", borderRadius: "12px", padding: "28px", textAlign: "center", background: "#05070a" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>Drag and drop PDF file here</p>
              <p style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "4px" }}>Automatic OCR extraction for Kannada & English FIRs (Max 50MB)</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-primary" style={{ flex: 1, fontSize: "0.75rem" }}>Upload & Process with OCR</button>
              <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "8px 16px" }} onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
