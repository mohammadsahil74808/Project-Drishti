/**
 * SentinelX AI — Criminal Network Analysis Page
 *
 * Advanced physics-based graph view of suspect linkages (co-accused, shared address/vehicle, etc.).
 * Rendered using Apache ECharts with a dark cyber aesthetic.
 */
import { useMemo, useState } from "react";
import { Share2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ReactECharts from "echarts-for-react";

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
  if (score >= 75) return "#EF4444"; // sx-critical
  if (score >= 50) return "#F59E0B"; // sx-alert
  if (score >= 30) return "#00F2FE"; // sx-accent
  return "#10B981"; // sx-success
}

export default function CriminalNetwork() {
  const [selected, setSelected] = useState<DummyNode | null>(NODES[0]);

  const connectedEdges = selected
    ? EDGES.filter((e) => e.source === selected.id || e.target === selected.id)
    : [];

  const graphOptions = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(8, 16, 32, 0.85)",
        borderColor: "rgba(0, 242, 254, 0.3)",
        textStyle: { color: "#F8FAFC" },
        formatter: (params: any) => {
          if (params.dataType === "edge") {
            return `${params.data.relation}`;
          }
          return `<strong>${params.data.name}</strong><br/>Risk Score: ${params.data.riskScore}<br/>Cases: ${params.data.caseCount}`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "force",
          force: {
            repulsion: 400,
            edgeLength: 120,
            gravity: 0.1,
          },
          roam: true, // Allow zooming and panning
          label: {
            show: true,
            position: "bottom",
            color: "#94A3B8",
            fontSize: 11,
            formatter: "{b}",
          },
          lineStyle: {
            color: "rgba(255,255,255,0.2)",
            width: 2,
            curveness: 0.2, // Cyber-style curved links
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 4,
              color: "#00F2FE", // Glowing neon cyan
              shadowBlur: 10,
              shadowColor: "#00F2FE",
            },
          },
          data: NODES.map((n) => ({
            id: n.id,
            name: n.label,
            symbolSize: 20 + n.caseCount * 2, // Size by case count
            itemStyle: {
              color: riskColor(n.riskScore),
              shadowBlur: 20,
              shadowColor: riskColor(n.riskScore),
              borderColor: "rgba(255,255,255,0.8)",
              borderWidth: n.id === selected?.id ? 3 : 1, // Highlight selected
            },
            // store data for tooltip
            riskScore: n.riskScore,
            caseCount: n.caseCount,
          })),
          edges: EDGES.map((e) => ({
            source: e.source,
            target: e.target,
            relation: e.relation,
          })),
        },
      ],
    };
  }, [selected]);

  // ECharts event handler
  const onEvents = {
    click: (params: any) => {
      if (params.dataType === "node") {
        const node = NODES.find((n) => n.id === params.data.id);
        if (node) setSelected(node);
      }
    },
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white sx-heading">Criminal Network Analysis</h1>
          <p className="text-sm text-sx-text-dim mt-1">
            Suspect linkage graph — co-accused, shared address, shared vehicle
          </p>
        </div>
        <Badge variant="info" dot>
          {NODES.length} nodes · {EDGES.length} edges
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 sx-panel-base border-none shadow-glow">
          <CardHeader>
            <CardTitle>Network Graph</CardTitle>
            <CardDescription>Node size = case count · color = risk score · drag to interact</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[480px] w-full bg-[#040814] relative overflow-hidden rounded-b-xl border-t border-sx-border/20">
              <ReactECharts
                option={graphOptions}
                onEvents={onEvents}
                style={{ height: "100%", width: "100%" }}
                opts={{ renderer: "canvas" }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Selected node detail panel */}
        <Card className="sx-panel-base border-none">
          <CardHeader>
            <CardTitle>Node Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-sx-surface border border-sx-border flex items-center justify-center text-sx-accent shadow-glow-dim">
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
                  <div className="bg-sx-surface/50 p-3 rounded-lg border border-sx-border/50">
                    <p className="text-xs text-sx-text-faint">Linked Cases</p>
                    <p className="text-white font-medium text-lg">{selected.caseCount}</p>
                  </div>
                  <div className="bg-sx-surface/50 p-3 rounded-lg border border-sx-border/50">
                    <p className="text-xs text-sx-text-faint">Centrality</p>
                    <p className="text-white font-medium text-lg">{selected.centrality.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-sx-text-faint mb-2 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                    <Share2 className="h-3.5 w-3.5" /> Connections
                  </p>
                  <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {connectedEdges.map((e, i) => {
                      const otherId = e.source === selected.id ? e.target : e.source;
                      const other = NODES.find((n) => n.id === otherId);
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm bg-sx-surface/60 border border-sx-border/40 hover:border-sx-accent/30 rounded-lg px-3 py-2.5 transition-colors cursor-default"
                        >
                          <span className="text-sx-text font-medium">{other?.label}</span>
                          <Badge variant="info" className="bg-sx-accent/10 text-[10px]">{e.relation}</Badge>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm text-sx-text-dim text-center py-8">Select a node to view details.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
