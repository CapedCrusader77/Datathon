"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

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
  const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    x: 120 + ((seed * 137) % 500),
    y: 120 + ((seed * 97 + fallback * 43) % 350),
  };
}

const NODE_COLORS: Record<string, string> = {
  person: "#3b82f6",
  vehicle: "#0284c7",
  phone: "#64748b",
  fir: "#ef4444",
  gang: "#8b5cf6",
  location: "#06b6d4",
};

const RISK_COLORS: Record<string, string> = {
  extreme: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#10b981",
};

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

const SEED_NODES: GraphNode[] = [
  { id: "p1", label: "Ravi Kumar S",          type: "person",   risk: "extreme", x: 380, y: 280, firs: 12 },
  { id: "p2", label: "Suresh Nayak",           type: "person",   risk: "high",    x: 200, y: 160, firs: 5  },
  { id: "p3", label: "Deepa Mallesh",          type: "person",   risk: "medium",  x: 560, y: 160, firs: 3  },
  { id: "p4", label: "Arjun Patil",            type: "person",   risk: "high",    x: 550, y: 400, firs: 7  },
  { id: "g1", label: "BSS Syndicate",          type: "gang",     risk: "extreme", x: 380, y: 90,  firs: 0  },
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
    } catch {
      if (!isExpand) {
        setNodes(SEED_NODES);
        setEdges(SEED_EDGES);
      }
    } finally {
      setLoadingNodeId(null);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuspectNetwork("p1", false);
  }, [loadSuspectNetwork]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (selected?.id === node.id) {
      setSelected(null);
      return;
    }
    setSelected(node);
    if (node.type === "person" || node.type === "gang") {
      loadSuspectNetwork(node.id, true);
    }
  }, [selected, loadSuspectNetwork]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const found = nodes.find(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setSelected(found);
      loadSuspectNetwork(found.id, false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
            Entity Knowledge Graph
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
            Interactive relationship topology — click nodes to inspect suspect networks & linked FIRs
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "6px" }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search suspect..."
              className="pg-input"
              style={{ fontSize: "0.75rem", padding: "6px 12px", width: "160px" }}
            />
          </form>
          <Link href="/dashboard/chat" className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px 14px", textDecoration: "none" }}>
            🤖 AI Query Graph
          </Link>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card" style={{ padding: "10px 16px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", fontSize: "0.72rem" }}>
        <span style={{ fontWeight: 700, color: "#64748b", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>LEGEND:</span>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
            <span style={{ textTransform: "capitalize", color: "#94a3b8" }}>{type}</span>
          </div>
        ))}
        <div style={{ width: "1px", height: "14px", background: "#141a28" }} />
        {Object.entries(RISK_COLORS).map(([r, c]) => (
          <div key={r} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c }} />
            <span style={{ textTransform: "uppercase", color: "#64748b", fontSize: "0.65rem", fontWeight: 700 }}>{r}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", alignItems: "start" }}>
        {/* SVG Graph Canvas */}
        <div className="kg-container" style={{ height: "540px", position: "relative", overflow: "hidden" }}>
          {initialLoading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#000000" }}>
              <span style={{ color: "#3b82f6", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>Querying Neo4j Graph Index...</span>
            </div>
          )}

          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 750 540">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(59,130,246,0.6)" />
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
                <g key={i}>
                  <line
                    x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                    stroke={isHovered ? "#60a5fa" : "rgba(59,130,246,0.3)"}
                    strokeWidth={isHovered ? 2 : 1}
                    markerEnd="url(#arrowhead)"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredEdge(e)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                  {isHovered && (
                    <text x={mx} y={my - 6} textAnchor="middle" fontSize="9" fill="#60a5fa" fontFamily="var(--font-mono)" fontWeight="700">
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const color = NODE_COLORS[node.type] || "#3b82f6";
              const borderColor = node.risk ? (RISK_COLORS[node.risk] || color) : color;
              const isSelected = selected?.id === node.id;
              const r = node.type === "gang" ? 28 : node.type === "person" ? 22 : 16;

              return (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNodeClick(node)}>
                  {isSelected && (
                    <circle r={r + 6} fill="none" stroke={borderColor} strokeWidth="2" opacity="0.8" />
                  )}
                  {node.risk && (
                    <circle r={r + 3} fill="none" stroke={borderColor} strokeWidth="1.5" strokeDasharray="3 2" />
                  )}
                  <circle r={r} fill={`${color}30`} stroke={color} strokeWidth={isSelected ? 2.5 : 1.5} />
                  <text textAnchor="middle" dominantBaseline="central" fontSize={node.type === "gang" ? "16" : "13"}>
                    {node.type === "person" ? "👤" : node.type === "vehicle" ? "🚗" : node.type === "phone" ? "📱" : node.type === "fir" ? "📋" : node.type === "location" ? "📍" : "⚡"}
                  </text>
                  <text y={r + 14} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="var(--font-mono)">
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Detail Panel */}
        <div className="chart-container" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc", borderBottom: "1px solid #141a28", paddingBottom: "8px" }}>
            {selected ? "Entity Details" : "Graph Summary"}
          </h3>

          {!selected ? (
            <div style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ color: "#94a3b8" }}>Click any entity node to inspect its relationship topology.</p>
              <p>Total Nodes: <span style={{ color: "#f8fafc", fontWeight: 700 }}>{nodes.length}</span></p>
              <p>Total Connections: <span style={{ color: "#f8fafc", fontWeight: 700 }}>{edges.length}</span></p>
              <p>Persons Tracked: <span style={{ color: "#60a5fa", fontWeight: 700 }}>{nodes.filter(n => n.type === "person").length}</span></p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${NODE_COLORS[selected.type]}20`, border: `1px solid ${NODE_COLORS[selected.type]}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {selected.type === "person" ? "👤" : selected.type === "vehicle" ? "🚗" : selected.type === "phone" ? "📱" : selected.type === "fir" ? "📋" : "⚡"}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: "#f8fafc" }}>{selected.label}</p>
                  <p style={{ fontSize: "0.68rem", color: NODE_COLORS[selected.type], textTransform: "capitalize" }}>{selected.type} Entity</p>
                </div>
              </div>

              {selected.risk && (
                <span className={`risk-${selected.risk}`} style={{ fontSize: "0.65rem", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
                  RISK: {selected.risk.toUpperCase()}
                </span>
              )}

              <div style={{ borderTop: "1px solid #141a28", paddingTop: "8px" }}>
                <p style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "6px" }}>Direct Connections:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {edges.filter(e => e.s === selected.id || e.t === selected.id).map((e, i) => {
                    const other = e.s === selected.id ? getNode(e.t) : getNode(e.s);
                    return (
                      <div key={i} style={{ fontSize: "0.72rem", color: "#cbd5e1", display: "flex", justifyContent: "space-between" }}>
                        <span>{other?.label}</span>
                        <span style={{ color: "#64748b", fontFamily: "var(--font-mono)", fontSize: "0.65rem", marginLeft: "auto" }}>{e.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", paddingTop: "6px" }}>
                <Link href="/dashboard/chat" className="btn-primary" style={{ fontSize: "0.75rem", padding: "6px 12px", textDecoration: "none", flex: 1, textAlign: "center", justifyContent: "center" }}>
                  Query AI
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
