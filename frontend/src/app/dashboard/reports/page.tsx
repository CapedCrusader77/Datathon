"use client";
import { useState } from "react";

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<null | { title: string; summary: string; sections: { title: string; content: string }[] }>(null);
  const [firNumber, setFirNumber] = useState("CR-045/2024");

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            AI Investigation Dossiers & Case Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated intelligence report synthesis grounded in CCTNS case files and forensic records
          </p>
        </div>
      </div>

      {/* Generator Tool */}
      <div className="chart-container border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3 className="text-sm font-bold text-slate-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
            POLICEGPT Intelligence Dossier Generator
          </h3>
        </div>

        <div className="flex gap-4 flex-wrap items-end">
          <div className="space-y-1.5 flex-1 min-w-[220px] max-w-sm">
            <label className="text-xs text-slate-400 font-medium">Target Case / FIR Number</label>
            <input
              value={firNumber}
              onChange={e => setFirNumber(e.target.value)}
              className="pg-input text-xs font-mono font-bold text-blue-400"
              placeholder="e.g. CR-045/2024"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2 font-semibold shadow-md">
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Synthesizing Dossier...
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Generate Official Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Report View */}
      {report && (
        <div className="chart-container space-y-6 border border-blue-500/30 bg-slate-950/90 shadow-2xl p-6">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-blue-400 font-mono tracking-wide">{report.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {report.summary}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print / Export PDF
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {report.sections.map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                <h3 className="text-xs font-bold text-blue-300 font-mono uppercase tracking-wider">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            ⚠️ <strong className="text-slate-200">Legal Audit Notice:</strong> This dossier is compiled automatically by POLICEGPT for internal investigative briefing. Official evidentiary submissions require officer signature & verification against CCTNS database records.
          </div>
        </div>
      )}
    </div>
  );
}
