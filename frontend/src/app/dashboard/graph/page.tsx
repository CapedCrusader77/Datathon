"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────── */
interface GraphNode {
  id: string;
  label: string;
  type: "person" | "vehicle" | "phone" | "fir" | "gang" | "location";
  risk?: string | null;
  x: number;
  y: number;
  firs?: number;
  properties?: Record<string, unknown>;
}

interface GraphEdge {
  s: string;
  t: string;
  label: string;
}

/* ── Static layout positions for a given node id ────────────── */
const LAYOUT_POSITIONS: Record<string, { x: number; y: number }> = {
  p1: { x: 380, y: 280 },
  p2: { x: 200, y: 160 },
  p3: { x: 570, y: 160 },
  p4: { x: 560, y: 400 },
  v1: { x: 230, y: 390 },
  v2: { x: 120, y: 280 },
  ph1: { x: 440, y: 130 },
  f1: { x: 310, y: 450 },
  f2: { x: 510, y: 450 },
  f3: { x: 640, y: 320 },
  g1: { x: 380, y: 90 },
  l1: { x: 130, y: 430 },
  l2: { x: 65, y: 330 },
};

function posForId(id: string, fallback: number): { x: number; y: number } {
  if (LAYOUT_POSITIONS[id]) return LAYOUT_POSITIONS[id];
  // For unknown ids generate a deterministic but spread-out position
  const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    x: 120 + ((seed * 137) % 500),
    y: 120 + ((seed * 97 + fallback * 43) % 350),
  };
}

const NODE_COLORS: Record<string, string> = {
  person: "#2563eb",
  vehicle: "#0284c7",
  phone: "#475569",
  fir: "#dc2626",
  gang: "#6366f1",
  location: "#0891b2",
};

const RISK_COLORS: Record<string, string> = {
  extreme: "#dc2626",
  high: "#2563eb",
  medium: "#0284c7",
  low: "#475569",
};

/* ── API mapper: backend GraphNode → frontend GraphNode ───── */
function mapApiToNode(n: {
  id: string;
  label: string;
  type: string;
  properties: Record<string, unknown>;
}, index: number): GraphNode {
  const pos = posForId(n.id, index);
  return {
    id: n.id,
    label: n.label,
    type: n.type as GraphNode["type"],
    risk: (n.properties?.risk as string) ?? null,
    x: pos.x,
    y: pos.y,
    firs: typeof n.properties?.firs === "number" ? n.properties.firs : 0,
    properties: n.properties,
  };
}

function mapApiToEdge(e: { source: string; target: string; relationship: string }): GraphEdge {
  return { s: e.source, t: e.target, label: e.relationship };
}

/* ── Demo graph (shown before/when API is unavailable) ────── */
const SEED_NODES: GraphNode[] = [
  { id: "p1", label: "Ravi Kumar S",          type: "person",   risk: "extreme", x: 380, y: 280, firs: 12 },
  { id: "p2", label: "Suresh Nayak",           type: "person",   risk: "high",    x: 200, y: 160, firs: 5  },
  { id: "p3", label: "Deepa Mallesh",          type: "person",   risk: "medium",  x: 560, y: 160, firs: 3  },
  { id: "p4", label: "Arjun Patil",            type: "person",   risk: "high",    x: 550, y: 400, firs: 7  },
  { id: "g1", label: "BSS Network",            type: "gang",     risk: "extreme", x: 380, y: 90,  firs: 0  },
  { id: "v1", label: "KA-01-AB-1234",          type: "vehicle",  risk: null,      x: 200, y: 390, firs: 0  },
  { id: "ph1",label: "9900112233",             type: "phone",    risk: null,      x: 580, y: 310, firs: 0  },
  { id: "f1", label: "CR-045/2024",            type: "fir",      risk: null,      x: 280, y: 430, firs: 0  },
  { id: "f2", label: "CR-089/2024",            type: "fir",      risk: null,      x: 490, y: 430, firs: 0  },
  { id: "l1", label: "Koramangala",            type: "location", risk: null,      x: 120, y: 440, firs: 0  },
];
const SEED_EDGES: GraphEdge[] = [
  { s: "p1", t: "g1",  label: "LEADER"      },
  { s: "p2", t: "g1",  label: "MEMBER"      },
  { s: "p3", t: "g1",  label: "ASSOCIATE"   },
  { s: "p4", t: "p1",  label: "KNOWN TO"    },
  { s: "p1", t: "v1",  label: "USES"        },
  { s: "p1", t: "ph1", label: "OWNS"        },
  { s: "p1", t: "f1",  label: "ACCUSED IN"  },
  { s: "p4", t: "f2",  label: "ACCUSED IN"  },
  { s: "p2", t: "f1",  label: "CO-ACCUSED"  },
  { s: "v1", t: "l1",  label: "SPOTTED AT"  },
];

/* ── Component ───────────────────────────────────────────────── */
export default function GraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>(SEED_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(SEED_EDGES);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNode = (id: string) => nodes.find(n => n.id === id);

  /* ── Feature 4: Load graph from API ─────────────────────── */
  const loadSuspectNetwork = useCallback(async (suspectId: string, isExpand = false) => {
    setLoadingNodeId(suspectId);
    try {
      const token = localStorage.getItem("pgpt_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/graph/suspect-network/${suspectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();

      const newNodes: GraphNode[] = (data.nodes ?? []).map(mapApiToNode);
      const newEdges: GraphEdge[] = (data.edges ?? []).map(mapApiToEdge);

      if (isExpand) {
        // Merge: add new nodes/edges that aren't already in the graph
        setNodes(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const toAdd = newNodes.filter(n => !existingIds.has(n.id));
          return [...prev, ...toAdd];
        });
        setEdges(prev => {
          const existingKeys = new Set(prev.map(e => `${e.s}→${e.t}`));
          const toAdd = newEdges.filter(e => !existingKeys.has(`${e.s}→${e.t}`));
          return [...prev, ...toAdd];
        });
      } else {
        setNodes(newNodes);
        setEdges(newEdges);
      }
    } catch (err) {
      console.error("Graph API error:", err);
      // On API failure fall back to rich demo seed data so graph is always visible
      if (!isExpand) {
        setNodes(SEED_NODES);
        setEdges(SEED_EDGES);
      }
    } finally {
      setLoadingNodeId(null);
      setInitialLoading(false);
    }
  }, []);

  // Load initial graph on mount
  useEffect(() => {
    loadSuspectNetwork("p1", false);
  }, [loadSuspectNetwork]);

  // Node click: select + expand connections
  const handleNodeClick = useCallback((node: GraphNode) => {
    if (selected?.id === node.id) {
      setSelected(null);
      return;
    }
    setSelected(node);
    // Expand connections for person nodes only
    if (node.type === "person" || node.type === "gang") {
      loadSuspectNetwork(node.id, true);
    }
  }, [selected, loadSuspectNetwork]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Find matching node and select it, or reload graph with that suspect
    const found = nodes.find(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setSelected(found);
      loadSuspectNetwork(found.id, false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-wide">
            Entity Knowledge Graph
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            KSP INTELLIGENCE NET · DEMO DATA — click any node to explore connections
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[#1c2030] border border-[#2a2f3e] rounded-md px-3 py-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search suspect…"
              className="bg-transparent border-none outline-none text-xs text-slate-200 w-36 font-mono"
            />
          </form>
          <Link href="/dashboard/chat" className="btn-primary text-xs px-4 py-2 flex items-center gap-2 no-underline">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            QUERY GRAPH VIA AI
          </Link>
        </div>
      </div>

      {/* Legend & Filter Bar */}
      <div className="flex gap-4 flex-wrap items-center terminal-panel p-3">
        <span className="text-xs font-semibold text-slate-400 font-mono uppercase">ENTITY LEGEND:</span>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 bg-[#0d0f14] px-2.5 py-1 rounded border border-[#2a2f3e]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-[11px] uppercase font-mono text-slate-300 font-medium">{type}</span>
          </div>
        ))}
        <div className="h-4 w-px bg-[#2a2f3e] mx-1" />
        <span className="text-xs font-semibold text-slate-400 font-mono uppercase">SEVERITY LEVEL:</span>
        {Object.entries(RISK_COLORS).map(([r, c]) => (
          <div key={r} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: c }} />
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">{r}</span>
          </div>
        ))}
        {initialLoading && (
          <span className="ml-auto text-[11px] text-[#2563eb] font-mono">QUERYING NEO4J INDEX…</span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="xl:col-span-3 terminal-panel relative overflow-hidden h-[580px] p-0 bg-[#0d0f14]">
          {initialLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d0f14]/90 z-10">
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-[#2563eb] rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">LOADING GRAPH FROM NEO4J…</p>
              </div>
            </div>
          )}
          {!initialLoading && nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0d0f14] z-10 p-6 text-center">
              <div className="max-w-md space-y-2">
                <p className="text-sm font-semibold text-slate-200">No connections found for this entity — add more case files</p>
                <p className="text-xs text-slate-400">Upload additional FIR documents in the Cases module or select an existing seed entity.</p>
              </div>
            </div>
          )}
          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 750 560" style={{ cursor: "default" }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(37,99,235,0.8)" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((e, i) => {
              const s = getNode(e.s);
              const t = getNode(e.t);
              if (!s || !t) return null;
              const mx = (s.x + t.x) / 2;
              const my = (s.y + t.y) / 2;
              const isHovered = hoveredEdge === e;
              return (
                <g key={`${e.s}-${e.t}-${i}`}>
                  <line
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={isHovered ? "#60a5fa" : "rgba(37,99,235,0.4)"}
                    strokeWidth={isHovered ? 2 : 1.2}
                    markerEnd="url(#arrowhead)"
                    style={{ cursor: "pointer", transition: "stroke 0.15s" }}
                    onMouseEnter={() => setHoveredEdge(e)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                  {isHovered && (
                    <g>
                      <rect x={mx - 44} y={my - 14} width="88" height="18" rx="4" fill="#141720" stroke="#2563eb" strokeWidth="1" />
                      <text x={mx} y={my - 2} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f1f5f9" fontFamily="JetBrains Mono">
                        {e.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes — Motion: One Moment Only (staggered 300ms entrance on load, no bounce/pulse) */}
            {nodes.map((node, i) => {
              const color = NODE_COLORS[node.type] || "#2563eb";
              const borderColor = node.risk ? (RISK_COLORS[node.risk] || color) : color;
              const isSelected = selected?.id === node.id;
              const isLoading = loadingNodeId === node.id;
              const r = node.type === "gang" ? 28 : node.type === "person" ? 22 : 16;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x},${node.y})`}
                  className="animate-node-enter"
                  style={{ cursor: "pointer", animationDelay: `${Math.min(i, 8) * 300}ms` }}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Selected Solid Accent Ring */}
                  {isSelected && (
                    <circle r={r + 6} fill="none" stroke={borderColor} strokeWidth="2" />
                  )}
                  {/* Loading Ring (only while actively querying API for expansion) */}
                  {isLoading && (
                    <circle r={r + 8} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 3">
                      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Risk Halo */}
                  {node.risk && (
                    <circle r={r + 3} fill="none" stroke={borderColor} strokeWidth="1.5" strokeDasharray="3 2" />
                  )}
                  {/* Main Circle */}
                  <circle r={r} fill={`${color}25`} stroke={color} strokeWidth={isSelected ? 2.5 : 1.5} />
                  {/* Node Symbol */}
                  <text textAnchor="middle" dominantBaseline="central" fontSize={node.type === "gang" ? "16" : "13"}>
                    {node.type === "person" ? "👤" : node.type === "vehicle" ? "🚗" : node.type === "phone" ? "📱" : node.type === "fir" ? "📋" : node.type === "location" ? "📍" : "⚡"}
                  </text>
                  {/* Node Title */}
                  <text y={r + 14} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#f1f5f9" style={{ pointerEvents: "none" }}>
                    {node.label.length > 16 ? node.label.slice(0, 15) + "…" : node.label}
                  </text>
                  {(node.firs ?? 0) > 0 && (
                    <text y={r + 24} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ef4444" fontFamily="JetBrains Mono">
                      {node.firs} FIRs
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Panel Drawer */}
        <div className="terminal-panel space-y-4 p-4 border border-[#2a2f3e] bg-[#141720]">
          <h3 className="font-bold text-sm text-slate-100 border-b border-[#2a2f3e] pb-2.5 flex items-center justify-between">
            <span>{selected ? "Entity Intelligence" : "Graph Overview"}</span>
            {selected && (
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">✕</button>
            )}
          </h3>

          {!selected ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-slate-300">
                <p className="font-semibold text-blue-400 mb-1">💡 KSP Intelligence Net · DEMO DATA</p>
                <p className="leading-relaxed">Click any node to query Neo4j and expand connections. Person & gang nodes fetch their full relationship network.</p>
              </div>
              <div className="space-y-2 text-slate-400 font-mono">
                <p>Loaded Nodes: <span className="text-slate-200 font-bold">{nodes.length}</span></p>
                <p>Linked Edges: <span className="text-slate-200 font-bold">{edges.length}</span></p>
                <p>Tracked Suspects: <span className="text-blue-400 font-bold">{nodes.filter(n => n.type === "person").length}</span></p>
                <p>FIR Files: <span className="text-red-400 font-bold">{nodes.filter(n => n.type === "fir").length}</span></p>
                <p>Active Syndicates: <span className="text-purple-400 font-bold">{nodes.filter(n => n.type === "gang").length}</span></p>
              </div>
              {loadingNodeId && (
                <div className="flex items-center gap-2 text-blue-400 text-[11px] font-mono">
                  <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Expanding from Neo4j…
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${NODE_COLORS[selected.type]}20`, border: `1px solid ${NODE_COLORS[selected.type]}` }}>
                  {selected.type === "person" ? "👤" : selected.type === "vehicle" ? "🚗" : selected.type === "phone" ? "📱" : selected.type === "fir" ? "📋" : selected.type === "location" ? "📍" : "⚡"}
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

              {(selected.firs ?? 0) > 0 && (
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                  ⚠️ Direct linkage to {selected.firs} FIR files
                </div>
              )}

              {loadingNodeId === selected.id && (
                <div className="flex items-center gap-2 text-blue-400 font-mono p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                  Querying Neo4j for connections…
                </div>
              )}

              <div className="space-y-2 border-t border-slate-800/80 pt-3">
                <p className="text-[11px] font-semibold text-slate-400">Direct Connections:</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {edges.filter(e => e.s === selected.id || e.t === selected.id).map((e, i) => {
                    const other = e.s === selected.id ? getNode(e.t) : getNode(e.s);
                    if (!other) return null;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-blue-500/30 transition-colors"
                        onClick={() => handleNodeClick(other)}
                      >
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: NODE_COLORS[other.type] || "#60a5fa" }} />
                        <span className="font-medium text-slate-200 truncate">{other.label}</span>
                        <span className="text-slate-500 ml-auto font-mono text-[10px]">{e.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Properties panel */}
              {selected.properties && Object.keys(selected.properties).length > 0 && (
                <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                  <p className="text-[11px] font-semibold text-slate-400">Properties:</p>
                  {Object.entries(selected.properties).slice(0, 5).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[10px]">
                      <span className="text-slate-500 font-mono capitalize">{k}</span>
                      <span className="text-slate-300 font-mono">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Link href="/dashboard/chat" className="btn-primary text-xs py-2 px-3 no-underline flex-1 justify-center font-semibold">
                  Query AI →
                </Link>
                {(selected.type === "person" || selected.type === "gang") && (
                  <button
                    onClick={() => loadSuspectNetwork(selected.id, false)}
                    className="btn-ghost text-xs py-2 px-3 flex-1 font-semibold"
                  >
                    Reload Graph
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
