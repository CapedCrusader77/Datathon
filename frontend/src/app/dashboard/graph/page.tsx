"use client";
import { useRef, useState } from "react";
import Link from "next/link";

const NODES = [
  { id: "p1", label: "Ravi Kumar S", type: "person", risk: "extreme", x: 400, y: 300, firs: 12 },
  { id: "p2", label: "Suresh M", type: "person", risk: "high", x: 200, y: 180, firs: 3 },
  { id: "p3", label: "Mahesh N", type: "person", risk: "high", x: 600, y: 180, firs: 5 },
  { id: "p4", label: "Unknown F", type: "person", risk: "low", x: 580, y: 420, firs: 1 },
  { id: "v1", label: "KA-01-AB-1234", type: "vehicle", risk: null, x: 240, y: 400, firs: 0 },
  { id: "v2", label: "KA-05-CD-5678", type: "vehicle", risk: null, x: 130, y: 300, firs: 0 },
  { id: "ph1", label: "+91-98765-XXXXX", type: "phone", risk: null, x: 450, y: 150, firs: 0 },
  { id: "f1", label: "CR-045/2024", type: "fir", risk: null, x: 320, y: 460, firs: 0 },
  { id: "f2", label: "CR-089/2024", type: "fir", risk: null, x: 520, y: 460, firs: 0 },
  { id: "g1", label: "Bengaluru South Syndicate", type: "gang", risk: "extreme", x: 400, y: 100, firs: 0 },
];

const EDGES = [
  { s: "p1", t: "p2", label: "ASSOCIATE" },
  { s: "p1", t: "p3", label: "GANG MEMBER" },
  { s: "p1", t: "v1", label: "OWNS VEHICLE" },
  { s: "p2", t: "v2", label: "OPERATES" },
  { s: "p1", t: "ph1", label: "SUBSCRIBER" },
  { s: "p1", t: "f1", label: "PRIMARY ACCUSED" },
  { s: "p2", t: "f1", label: "CO-ACCUSED" },
  { s: "p3", t: "f2", label: "ACCUSED" },
  { s: "p1", t: "g1", label: "LEADER" },
  { s: "p3", t: "g1", label: "OPERATIVE" },
  { s: "p4", t: "p1", label: "KNOWN CONTACT" },
  { s: "v1", t: "f2", label: "SPOTTED ON ANPR" },
];

const NODE_COLORS: Record<string, string> = {
  person: "#3b82f6",
  vehicle: "#10b981",
  phone: "#f59e0b",
  fir: "#ef4444",
  gang: "#8b5cf6",
};

const RISK_COLORS: Record<string, string> = {
  extreme: "#ef4444",
  high: "#f59e0b",
  medium: "#f97316",
  low: "#10b981",
};

export default function GraphPage() {
  const [selected, setSelected] = useState<typeof NODES[0] | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<typeof EDGES[0] | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNode = (id: string) => NODES.find(n => n.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Entity Knowledge Graph
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual multi-modal link graph mapping suspects, vehicles, cellular numbers, FIR files, and criminal networks
          </p>
        </div>
        <Link href="/dashboard/chat" className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 no-underline shadow-md">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Query Graph via AI
        </Link>
      </div>

      {/* Legend & Filter Bar */}
      <div className="flex gap-4 flex-wrap items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-400 font-mono">Entity Legend:</span>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-800">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[11px] capitalize text-slate-300 font-medium">{type}</span>
          </div>
        ))}
        <div className="h-4 w-px bg-slate-800 mx-1" />
        <span className="text-xs font-semibold text-slate-400 font-mono">Risk Level:</span>
        {Object.entries(RISK_COLORS).map(([r, c]) => (
          <div key={r} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-[10px] capitalize text-slate-400 font-semibold">{r}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="xl:col-span-3 chart-container kg-container relative overflow-hidden h-[580px] p-0 border border-slate-800 rounded-2xl bg-slate-950">
          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 750 560" style={{ cursor: "default" }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(59,130,246,0.6)" />
              </marker>
            </defs>

            {/* Edges */}
            {EDGES.map((e, i) => {
              const s = getNode(e.s)!;
              const t = getNode(e.t)!;
              const mx = (s.x + t.x) / 2;
              const my = (s.y + t.y) / 2;
              const isHovered = hoveredEdge === e;

              return (
                <g key={i}>
                  <line
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={isHovered ? "#60a5fa" : "rgba(59,130,246,0.3)"}
                    strokeWidth={isHovered ? 2.5 : 1.2}
                    strokeDasharray={e.label.includes("SPOTTED") ? "4 2" : undefined}
                    markerEnd="url(#arrowhead)"
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={() => setHoveredEdge(e)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                  {isHovered && (
                    <g>
                      <rect x={mx - 40} y={my - 14} width="80" height="18" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                      <text x={mx} y={my - 2} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#60a5fa">
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map(node => {
              const color = NODE_COLORS[node.type];
              const borderColor = node.risk ? RISK_COLORS[node.risk] : color;
              const isSelected = selected?.id === node.id;
              const r = node.type === "gang" ? 28 : node.type === "person" ? 22 : 16;

              return (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(node === selected ? null : node)}>
                  {/* Selected Ripple Ring */}
                  {isSelected && (
                    <circle r={r + 10} fill="none" stroke={borderColor} strokeWidth="1.5" opacity="0.6">
                      <animate attributeName="r" values={`${r + 4};${r + 14};${r + 4}`} dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Risk Halo */}
                  {node.risk && (
                    <circle r={r + 4} fill="none" stroke={borderColor} strokeWidth="2" opacity="0.8" strokeDasharray="3 2" />
                  )}
                  {/* Main Circle */}
                  <circle r={r} fill={`${color}25`} stroke={color} strokeWidth={isSelected ? 3 : 1.5} />
                  {/* Node Symbol */}
                  <text textAnchor="middle" dominantBaseline="central" fontSize={node.type === "gang" ? "16" : "13"}>
                    {node.type === "person" ? "👤" : node.type === "vehicle" ? "🚗" : node.type === "phone" ? "📱" : node.type === "fir" ? "📋" : "⚡"}
                  </text>
                  {/* Node Title */}
                  <text y={r + 14} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#e2e8f0" style={{ pointerEvents: "none" }}>
                    {node.label.length > 16 ? node.label.slice(0, 15) + "…" : node.label}
                  </text>
                  {node.firs > 0 && (
                    <text y={r + 24} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#f87171">
                      {node.firs} FIRs
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Panel Drawer */}
        <div className="chart-container space-y-4 border border-slate-800 bg-slate-950">
          <h3 className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-2.5 flex items-center justify-between">
            <span>{selected ? "Entity Intelligence" : "Graph Overview"}</span>
            {selected && (
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">✕</button>
            )}
          </h3>

          {!selected ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-300">
                <p className="font-semibold text-blue-400 mb-1">💡 Interactive Network Map</p>
                <p className="leading-relaxed">Click any node to inspect relationship links, connected cases, and suspect intelligence.</p>
              </div>
              <div className="space-y-2 text-slate-400 font-mono">
                <p>Total Nodes: <span className="text-slate-200 font-bold">{NODES.length}</span></p>
                <p>Linked Edges: <span className="text-slate-200 font-bold">{EDGES.length}</span></p>
                <p>Tracked Suspects: <span className="text-blue-400 font-bold">{NODES.filter(n => n.type === "person").length}</span></p>
                <p>FIR Files: <span className="text-red-400 font-bold">{NODES.filter(n => n.type === "fir").length}</span></p>
                <p>Active Syndicates: <span className="text-purple-400 font-bold">{NODES.filter(n => n.type === "gang").length}</span></p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${NODE_COLORS[selected.type]}20`, border: `1px solid ${NODE_COLORS[selected.type]}` }}>
                  {selected.type === "person" ? "👤" : selected.type === "vehicle" ? "🚗" : selected.type === "phone" ? "📱" : selected.type === "fir" ? "📋" : "⚡"}
                </div>
                <div>
                  <p className="font-bold text-slate-100 text-sm">{selected.label}</p>
                  <p className="text-[11px] capitalize font-semibold" style={{ color: NODE_COLORS[selected.type] }}>{selected.type} Entity</p>
                </div>
              </div>

              {selected.risk && (
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold risk-${selected.risk}`}>
                  RISK LEVEL: {selected.risk.toUpperCase()}
                </span>
              )}

              {selected.firs > 0 && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                  ⚠️ Direct linkage to {selected.firs} FIR files
                </div>
              )}

              <div className="space-y-2 border-t border-slate-800/80 pt-3">
                <p className="text-[11px] font-semibold text-slate-400">Direct Connections:</p>
                <div className="space-y-1.5">
                  {EDGES.filter(e => e.s === selected.id || e.t === selected.id).map((e, i) => {
                    const other = e.s === selected.id ? getNode(e.t) : getNode(e.s);
                    return (
                      <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: NODE_COLORS[other?.type || "person"] }} />
                        <span className="font-medium text-slate-200 truncate">{other?.label}</span>
                        <span className="text-slate-500 ml-auto font-mono text-[10px]">{e.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href="/dashboard/chat" className="btn-primary text-xs py-2 px-3 no-underline flex-1 justify-center font-semibold">
                  Query AI →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
