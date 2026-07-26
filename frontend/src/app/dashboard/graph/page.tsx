"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Simple force-directed graph using SVG (no external deps needed)
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
  { id: "g1", label: "BSG", type: "gang", risk: "extreme", x: 400, y: 100, firs: 0 },
];

const EDGES = [
  { s: "p1", t: "p2", label: "ASSOCIATE" },
  { s: "p1", t: "p3", label: "GANG MEMBER" },
  { s: "p1", t: "v1", label: "OWNS" },
  { s: "p2", t: "v2", label: "USES" },
  { s: "p1", t: "ph1", label: "USES" },
  { s: "p1", t: "f1", label: "ACCUSED" },
  { s: "p2", t: "f1", label: "CO-ACCUSED" },
  { s: "p3", t: "f2", label: "ACCUSED" },
  { s: "p1", t: "g1", label: "LEADS" },
  { s: "p3", t: "g1", label: "MEMBER" },
  { s: "p4", t: "p1", label: "KNOWS" },
  { s: "v1", t: "f2", label: "SPOTTED" },
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Knowledge Graph
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Interactive relationship map — suspects, vehicles, phones, FIRs, gangs
          </p>
        </div>
        <Link href="/dashboard/chat" className="btn-primary text-sm px-4 py-2 no-underline">
          🤖 Query Graph via AI
        </Link>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{type}</span>
          </div>
        ))}
        <div className="h-4 w-px mx-2" style={{ background: "var(--border-primary)" }} />
        {Object.entries(RISK_COLORS).map(([r, c]) => (
          <div key={r} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{r}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* SVG Graph */}
        <div className="xl:col-span-3 chart-container kg-container overflow-hidden" style={{ height: "560px" }}>
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
              return (
                <g key={i}>
                  <line
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={hoveredEdge === e ? "#60a5fa" : "rgba(59,130,246,0.25)"}
                    strokeWidth={hoveredEdge === e ? 2 : 1}
                    markerEnd="url(#arrowhead)"
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={() => setHoveredEdge(e)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                  {hoveredEdge === e && (
                    <text x={mx} y={my - 6} textAnchor="middle" fontSize="9" fill="#60a5fa">
                      {e.label}
                    </text>
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
                  {/* Outer glow ring when selected */}
                  {isSelected && (
                    <circle r={r + 8} fill="none" stroke={borderColor} strokeWidth="1" opacity="0.4">
                      <animate attributeName="r" values={`${r + 4};${r + 12};${r + 4}`} dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Risk ring */}
                  {node.risk && (
                    <circle r={r + 4} fill="none" stroke={borderColor} strokeWidth="2" opacity="0.6" strokeDasharray="4 2" />
                  )}
                  {/* Main circle */}
                  <circle r={r} fill={`${color}30`} stroke={color} strokeWidth={isSelected ? 2.5 : 1.5} />
                  {/* Icon */}
                  <text textAnchor="middle" dominantBaseline="central" fontSize={node.type === "gang" ? "18" : "14"}>
                    {node.type === "person" ? "👤" : node.type === "vehicle" ? "🚗" : node.type === "phone" ? "📱" : node.type === "fir" ? "📋" : "⚡"}
                  </text>
                  {/* Label */}
                  <text y={r + 14} textAnchor="middle" fontSize="9" fill="#94a3b8"
                    style={{ pointerEvents: "none" }}>
                    {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
                  </text>
                  {node.firs > 0 && (
                    <text y={r + 24} textAnchor="middle" fontSize="8" fill="#ef4444">
                      {node.firs} FIRs
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Panel */}
        <div className="chart-container space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            {selected ? "Entity Details" : "Graph Info"}
          </h3>

          {!selected ? (
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <p className="text-xs" style={{ color: "var(--accent-blue)" }}>Click any node to see details</p>
              </div>
              <div className="space-y-2" style={{ color: "var(--text-muted)" }}>
                <p>📊 Nodes: {NODES.length}</p>
                <p>🔗 Edges: {EDGES.length}</p>
                <p>👤 Persons: {NODES.filter(n => n.type === "person").length}</p>
                <p>📋 FIRs: {NODES.filter(n => n.type === "fir").length}</p>
                <p>⚡ Gangs: {NODES.filter(n => n.type === "gang").length}</p>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Showing: Bengaluru South Gang network. Hover edges to see relationships.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${NODE_COLORS[selected.type]}20`, border: `1px solid ${NODE_COLORS[selected.type]}` }}>
                  {selected.type === "person" ? "👤" : selected.type === "vehicle" ? "🚗" : selected.type === "phone" ? "📱" : selected.type === "fir" ? "📋" : "⚡"}
                </div>
                <div>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{selected.label}</p>
                  <p className="text-xs capitalize" style={{ color: NODE_COLORS[selected.type] }}>{selected.type}</p>
                </div>
              </div>

              {selected.risk && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold risk-${selected.risk}`}>
                  RISK: {selected.risk.toUpperCase()}
                </span>
              )}

              {selected.firs > 0 && (
                <div className="p-2 rounded" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <p className="text-xs" style={{ color: "#ef4444" }}>⚠️ Linked to {selected.firs} FIRs</p>
                </div>
              )}

              <div>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>Connected to:</p>
                <div className="space-y-1">
                  {EDGES.filter(e => e.s === selected.id || e.t === selected.id).map((e, i) => {
                    const other = e.s === selected.id ? getNode(e.t) : getNode(e.s);
                    return (
                      <div key={i} className="flex items-center gap-2 text-xs"
                        style={{ color: "var(--text-secondary)" }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: NODE_COLORS[other?.type || "person"] }} />
                        <span>{other?.label}</span>
                        <span style={{ color: "var(--text-muted)" }}>— {e.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href="/dashboard/chat" className="btn-primary text-xs px-3 py-1.5 no-underline">
                  Ask AI
                </Link>
                <button className="btn-ghost text-xs px-3 py-1.5">Expand</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
