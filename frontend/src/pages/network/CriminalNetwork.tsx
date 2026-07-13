import { useMemo, useState, useEffect } from "react";
import { Share2, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ReactECharts from "echarts-for-react";
import { networkApi } from "@/api";

function riskColor(score: number) {
  if (score >= 75) return "#EF4444"; // sx-critical
  if (score >= 50) return "#F59E0B"; // sx-alert
  if (score >= 30) return "#00F2FE"; // sx-accent
  return "#10B981"; // sx-success
}

export default function CriminalNetwork() {
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["network-graph"],
    queryFn: () => networkApi.getGraph(),
  });

  const nodes = data?.nodes || [];
  const edges = data?.edges || [];

  // Automatically select the first node if available and none selected
  useEffect(() => {
    if (nodes.length > 0 && !selected) {
      setSelected(nodes[0]);
    }
  }, [nodes, selected]);

  const connectedEdges = selected
    ? edges.filter((e: any) => e.source === selected.id || e.target === selected.id)
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
            return `${params.data.relation_type || params.data.relation}`;
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
          data: nodes.map((n: any) => ({
            id: n.id,
            name: n.label,
            symbolSize: 20 + (n.case_count || n.caseCount || 0) * 2, // Size by case count
            itemStyle: {
              color: riskColor(n.risk_score || n.riskScore || 0),
              shadowBlur: 20,
              shadowColor: riskColor(n.risk_score || n.riskScore || 0),
              borderColor: "rgba(255,255,255,0.8)",
              borderWidth: n.id === selected?.id ? 3 : 1, // Highlight selected
            },
            // store data for tooltip
            riskScore: n.risk_score || n.riskScore,
            caseCount: n.case_count || n.caseCount,
          })),
          edges: edges.map((e: any) => ({
            source: e.source,
            target: e.target,
            relation: e.relation_type || e.relation,
            relation_type: e.relation_type || e.relation,
          })),
        },
      ],
    };
  }, [nodes, edges, selected]);

  // ECharts event handler
  const onEvents = {
    click: (params: any) => {
      if (params.dataType === "node") {
        const node = nodes.find((n: any) => n.id === params.data.id);
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
          {nodes.length} nodes · {edges.length} edges
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
              {isLoading ? (
                 <div className="absolute inset-0 z-10 flex items-center justify-center text-sx-text-dim">Loading Network Graph...</div>
              ) : isError ? (
                 <div className="absolute inset-0 z-10 flex items-center justify-center text-sx-critical">Failed to load graph</div>
              ) : (
                <ReactECharts
                  option={graphOptions}
                  onEvents={onEvents}
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "canvas" }}
                />
              )}
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
                    <p className="text-sm font-semibold text-white truncate max-w-[150px]">{selected.label}</p>
                    <Badge
                      variant={
                        (selected.risk_score || selected.riskScore) >= 75
                          ? "critical"
                          : (selected.risk_score || selected.riskScore) >= 50
                          ? "medium"
                          : (selected.risk_score || selected.riskScore) >= 30
                          ? "info"
                          : "success"
                      }
                    >
                      Risk {selected.risk_score || selected.riskScore}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-sx-surface/50 p-3 rounded-lg border border-sx-border/50">
                    <p className="text-xs text-sx-text-faint">Linked Cases</p>
                    <p className="text-white font-medium text-lg">{selected.case_count || selected.caseCount || 0}</p>
                  </div>
                  <div className="bg-sx-surface/50 p-3 rounded-lg border border-sx-border/50">
                    <p className="text-xs text-sx-text-faint">Centrality</p>
                    <p className="text-white font-medium text-lg">{(selected.centrality || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-sx-text-faint mb-2 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                    <Share2 className="h-3.5 w-3.5" /> Connections
                  </p>
                  <ul className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {connectedEdges.length === 0 && (
                      <li className="text-xs text-sx-text-dim text-center py-2">No connections</li>
                    )}
                    {connectedEdges.map((e: any, i: number) => {
                      const otherId = e.source === selected.id ? e.target : e.source;
                      const other = nodes.find((n: any) => n.id === otherId);
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between text-sm bg-sx-surface/60 border border-sx-border/40 hover:border-sx-accent/30 rounded-lg px-3 py-2.5 transition-colors cursor-default"
                        >
                          <span className="text-sx-text font-medium truncate max-w-[120px]">{other?.label || otherId}</span>
                          <Badge variant="info" className="bg-sx-accent/10 text-[10px]">{e.relation_type || e.relation}</Badge>
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
