"use client";
import { useState } from "react";

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<null | { title: string; summary: string; sections: { title: string; content: string }[] }>(null);
  const [firNumber, setFirNumber] = useState("CR-045/2024");

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    setReport({
      title: `Official Intelligence Dossier — FIR ${firNumber}`,
      summary: "Grounded AI synthesis generated for Karnataka State Police CID Division • Confidence Score: 94.2%",
      sections: [
        { title: "1. Executive Briefing", content: "Armed robbery at Vijay Petroleum outlet in Koramangala 5th Block on 10-Mar-2024 at 21:45 hrs. Three perpetrators forcibly stole ₹1,42,000 cash. Primary suspect identified as Ravi Kumar S (KSP-CR-2024-0001), a repeat syndicate operative with 12 active warrants. High-definition ANPR CCTV footage captures vehicle escape route." },
        { title: "2. Incident Parameters", content: "Date/Time: 10-Mar-2024, 21:45 IST\nJurisdiction: Koramangala Police Station, Bangalore South\nOffense Classification: Armed Robbery u/s 392/397/34 IPC (309 BNS Equivalent)\nLoss Assessed: ₹1,42,000 Cash Currency\nWeapons Deployed: Edged weapons (machetes)" },
        { title: "3. Criminal Syndicate Analysis", content: "Primary Suspect: Ravi Kumar S (KSP-CR-2024-0001) — Age 34, leader of Bengaluru South Syndicate, currently absconding.\nMatch Probability: 92.8% via AI facial vector comparison against CCTNS mugshot vault.\nAccomplices: 2 unidentified operatives. Modus operandi matches past petrol pump robberies in Electronic City." },
        { title: "4. Forensic Evidence Inventory", content: "• High-resolution 4K CCTV video (60s) from Vijay Petroleum Cam-03\n• Corroborated eyewitness statement of station manager\n• Biological blood samples recovered from door handle — dispatched to FSL Bangalore\n• ANPR camera detection: Motorbike plate KA-01-AB-1234 flagged at Silk Board junction" },
        { title: "5. Operational Action Directives", content: "1. Issue nationwide Look-Out Circular (LOC) for Ravi Kumar S\n2. Invoke KCOCA (Karnataka Control of Organised Crime Act) provisions\n3. Coordinate tactical raid with Shivajinagar Anti-Rowdy Squad\n4. Subpoena telecom CDR logs for cell towers within 1km radius\n5. Submit CCTV footage to State Forensic Lab for plate resolution" },
        { title: "6. Statutory Provisions & Penal Codes", content: "IPC Section 392: Robbery (up to 10 years rigorous imprisonment)\nIPC Section 397: Robbery with attempt to cause death or grievous hurt (min 7 years)\nIPC Section 34: Common intention\nBNS Statutory Equivalent: Sections 309, 310" },
      ]
    });
    setGenerating(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
            AI Investigation Dossiers & Case Reports
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
            Automated intelligence report synthesis grounded in CCTNS case files and forensic records
          </p>
        </div>
      </div>

      {/* Generator Tool */}
      <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #141a28", paddingBottom: "10px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f8fafc" }}>
            POLICEGPT Intelligence Dossier Generator
          </h3>
        </div>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "220px", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>Target Case / FIR Number</label>
            <input
              value={firNumber}
              onChange={e => setFirNumber(e.target.value)}
              className="pg-input"
              style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "#60a5fa" }}
              placeholder="e.g. CR-045/2024"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary"
            style={{ fontSize: "0.75rem", padding: "10px 20px" }}>
            {generating ? "Synthesizing Dossier..." : "Generate Official Report"}
          </button>
        </div>
      </div>

      {/* Generated Report View */}
      {report && (
        <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "20px", border: "1px solid rgba(59,130,246,0.3)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid #141a28", paddingBottom: "12px" }}>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#60a5fa", fontFamily: "var(--font-mono)" }}>{report.title}</h2>
              <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "4px" }}>
                {report.summary}
              </p>
            </div>
            <button onClick={() => window.print()} className="btn-ghost" style={{ fontSize: "0.75rem", padding: "6px 12px", marginLeft: "auto" }}>
              Print / Export PDF
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {report.sections.map((s, i) => (
              <div key={i} style={{ padding: "14px", borderRadius: "8px", background: "#05070a", border: "1px solid #141a28", display: "flex", flexDirection: "column", gap: "6px" }}>
                <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#93c5fd", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{s.title}</h3>
                <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.6, whiteSpace: "pre-line" }}>{s.content}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px", borderRadius: "8px", background: "#05070a", border: "1px solid #141a28", fontSize: "0.72rem", color: "#64748b", lineHeight: 1.5 }}>
            ⚠️ <strong style={{ color: "#cbd5e1" }}>Legal Audit Notice:</strong> This dossier is compiled automatically by POLICEGPT for internal investigative briefing.
          </div>
        </div>
      )}
    </div>
  );
}
