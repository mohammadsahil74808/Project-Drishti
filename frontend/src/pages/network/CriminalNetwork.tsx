/**
 * SentinelX AI — Criminal Network Analysis Page
 *
 * Graph view of suspect linkages (co-accused, shared address/vehicle, etc.).
 * Rendered as a lightweight SVG circular layout with dummy nodes/edges so
 * the page runs with zero extra dependencies — swap for react-force-graph
 * or a Deck.gl graph layer for physics-based layout once wired to
 * `/api/v1/network/graph`.
 */
import { useMemo, useState } from "react";
import { Share2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface DummyNode {
  id: string;
  label: string;
  riskScore: number;
  caseCount: number;
  centrality: number;
}
interface DummyEdge {
  source: string;
  target: string;
  relation: string;
}

const NODES: DummyNode[] = [
  { id: "s1", label: "Suspect A-104", riskScore: 91, caseCount: 12, centrality: 0.82 },
  { id: "s2", label: "Suspect B-217", riskScore: 76, caseCount: 8, centrality: 0.61 },
  { id: "s3", label: "Suspect C-338", riskScore: 68, caseCount: 6, centrality: 0.54 },
  { id: "s4", label: "Suspect D-449", riskScore: 54, caseCount: 4, centrality: 0.38 },
  { id: "s5", label: "Suspect E-560", riskScore: 47, caseCount: 3, centrality: 0.29 },
  { id: "s6", label: "Suspect F-671", riskScore: 33, caseCount: 2, centrality: 0.18 },
  { id: "s7", label: "Suspect G-782", riskScore: 22, caseCount: 1, centrality: 0.11 },
];

const EDGES: DummyEdge[] = [
  { source: "s1", target: "s2", relation: "Co-accused" },
  { source: "s1", target: "s3", relation: "Shared vehicle" },
  { source: "s1", target: "s4", relation: "Co-accused" },
  { source: "s2", target: "s5", relation: "Shared address" },
  { source: "s3", target: "s6", relation: "Co-accused" },
  { source: "s4", target: "s7", relation: "Shared vehicle" },
  { source: "s2", target: "s3", relation: "Co-accused" },
];

function riskColor(score: number) {
  if (score >= 75) return "#EF4444";
  if (score >= 50) return "#F59E0B";
  if (score >= 30) return "#3B82F6";
  return "#10B981";
}

export default function CriminalNetwork() {
  const [selected, setSelected] = useState<DummyNode | null>(NODES[0]);

  const positions = useMemo(() => {
    const cx = 250;
    const cy = 220;
    const r = 170;
    const map: Record<string, { x: number; y: number }> = {};
    NODES.forEach((n, i) => {
      const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
      map[n.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    return map;
  }, []);

  const connectedEdges = selected
    ? EDGES.filter((e) => e.source === selected.id || e.target === selected.id)
    : [];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Criminal Network Analysis</h1>
          <p className="text-sm text-sx-text-dim mt-1">
            Suspect linkage graph — co-accused, shared address, shared vehicle
          </p>
        </div>
        <Badge variant="info" dot>
          {NODES.length} nodes · {EDGES.length} edges
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Network Graph</CardTitle>
            <CardDescription>Node size = case count · color = risk score</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <svg viewBox="0 0 500 440" className="w-full h-[440px]">
              {EDGES.map((e, i) => {
                const s = positions[e.source];
                const t = positions[e.target];
                const isHighlighted =
                  selected && (e.source === selected.id || e.target === selected.id);
                return (
                  <line
                    key={i}
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={isHighlighted ? "#3B82F6" : "#1F2937"}
                    strokeWidth={isHighlighted ? 2 : 1}
                  />
                );
              })}

              {NODES.map((n) => {
                const pos = positions[n.id];
                const radius = 10 + n.caseCount * 1.4;
                const isSelected = selected?.id === n.id;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => setSelected(n)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={radius}
                      fill={riskColor(n.riskScore)}
                      fillOpacity={isSelected ? 0.9 : 0.55}
                      stroke={isSelected ? "#fff" : "transparent"}
                      strokeWidth={2}
                    />
                    <text
                      y={radius + 14}
                      textAnchor="middle"
                      fill="#9CA3AF"
                      fontSize="10"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </CardContent>
        </Card>

        {/* Selected node detail panel */}
        <Card>
          <CardHeader>
            <CardTitle>Node Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-sx-panel-light flex items-center justify-center text-sx-text-dim">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selected.label}</p>
                    <Badge
                      variant={
                        selected.riskScore >= 75
                          ? "critical"
                          : selected.riskScore >= 50
                          ? "medium"
                          : selected.riskScore >= 30
                          ? "info"
                          : "success"
                      }
                    >
                      Risk {selected.riskScore}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-sx-text-faint">Linked Cases</p>
                    <p className="text-white font-medium">{selected.caseCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sx-text-faint">Centrality</p>
                    <p className="text-white font-medium">{selected.centrality.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-sx-text-faint mb-2 flex items-center gap-1.5">
                    <Share2 className="h-3.5 w-3.5" /> Connections
                  </p>
                  <ul className="space-y-2">
                    {connectedEdges.map((e, i) => {
                      const otherId = e.source === selected.id ? e.target : e.source;
                      const other = NODES.find((n) => n.id === otherId);
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm bg-sx-panel-light rounded-lg px-3 py-2"
                        >
                          <span className="text-sx-text">{other?.label}</span>
                          <span className="text-[11px] text-sx-text-faint">{e.relation}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-sx-text-dim">Select a node to view details.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
