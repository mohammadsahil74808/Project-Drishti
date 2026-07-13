import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  FileWarning,
  MapPinned,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { dashboardApi, analyticsApi, alertsApi } from "@/api";

// Mapping icons by label
const getIconForStat = (label: string) => {
  if (label.toLowerCase().includes("hotspot")) return MapPinned;
  if (label.toLowerCase().includes("missing")) return Users;
  if (label.toLowerCase().includes("risk")) return TrendingUp;
  return FileWarning;
};

const getColorClassForStat = (label: string) => {
  if (label.toLowerCase().includes("hotspot"))
    return "text-[#FF4500] bg-[#FF4500]/5 border border-[#FF4500]/20 group-hover:bg-[#FF4500]/10 group-hover:border-[#FF4500]/40 group-hover:shadow-[0_0_15px_rgba(255,69,0,0.5)]";
  if (label.toLowerCase().includes("missing"))
    return "text-[#A855F7] bg-[#A855F7]/5 border border-[#A855F7]/20 group-hover:bg-[#A855F7]/10 group-hover:border-[#A855F7]/40 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]";
  if (label.toLowerCase().includes("risk"))
    return "text-[#EAB308] bg-[#EAB308]/5 border border-[#EAB308]/20 group-hover:bg-[#EAB308]/10 group-hover:border-[#EAB308]/40 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]";
  return "text-[#00F2FE] bg-[#00F2FE]/5 border border-[#00F2FE]/20 group-hover:bg-[#00F2FE]/10 group-hover:border-[#00F2FE]/40 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.5)]";
};

export default function DashboardHome() {
  const { data: summary, isLoading: isLoadingSummary, isError: isErrorSummary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi.getSummary,
    refetchInterval: 30000,
  });

  const { data: trendData, isLoading: isLoadingTrend } = useQuery({
    queryKey: ["analytics-trend"],
    queryFn: () => analyticsApi.getTrend("daily"),
    refetchInterval: 30000,
  });

  // Use websockets for real alerts, but fallback to polling via React Query
  const { data: alertsData, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: alertsApi.getAlerts,
    refetchInterval: 30000,
  });

  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Merge REST alerts with WebSocket alerts
    if (alertsData) {
      setLiveAlerts(alertsData);
    }
  }, [alertsData]);

  useEffect(() => {
    // Connect to WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = import.meta.env.VITE_API_BASE_URL 
      ? new URL(import.meta.env.VITE_API_BASE_URL).host 
      : "localhost:8000";
    const ws = new WebSocket(`${protocol}//${host}/api/v1/ws/alerts`);
    
    ws.onmessage = (event) => {
      try {
        const newAlert = JSON.parse(event.data);
        setLiveAlerts((prev) => [newAlert, ...prev].slice(0, 10)); // Keep last 10
      } catch (err) {}
    };

    return () => ws.close();
  }, []);

  const trendOption = {
    backgroundColor: "transparent",
    grid: { left: 36, right: 16, top: 16, bottom: 28 },
    xAxis: {
      type: "category",
      data: trendData?.points?.map((p: any) => p.period) || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: { lineStyle: { color: "#1F2937" } },
      axisLabel: { color: "#9CA3AF", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "#1F2937" } },
      axisLabel: { color: "#9CA3AF", fontSize: 11 },
    },
    series: [
      {
        data: trendData?.points?.map((p: any) => p.count) || [0, 0, 0, 0, 0, 0, 0],
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { color: "#3B82F6", width: 2 },
        itemStyle: { color: "#3B82F6" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59,130,246,0.35)" },
              { offset: 1, color: "rgba(59,130,246,0)" },
            ],
          },
        },
      },
    ],
    tooltip: { trigger: "axis" },
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Command Overview</h1>
        <p className="text-sm text-sx-text-dim mt-1">
          Statewide snapshot — Karnataka State Police, live as of today.
        </p>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoadingSummary ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse bg-sx-panel/50">
              <CardContent className="h-24"></CardContent>
            </Card>
          ))
        ) : isErrorSummary ? (
          <div className="text-sx-critical col-span-4">Failed to load summary stats.</div>
        ) : (
          summary?.stats?.map((stat: any) => {
            const Icon = getIconForStat(stat.label);
            const colorClass = getColorClassForStat(stat.label);
            return (
              <Card key={stat.label} className="group cursor-default hover:bg-sx-panel-light/30 transition-colors duration-300">
                <CardContent className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-sx-text-dim">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    <div
                      className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                        stat.trend === "up" ? "text-sx-critical" : "text-sx-success"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {stat.delta}
                    </div>
                  </div>
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Trend chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Crime Volume — Last 7 Days</CardTitle>
              <CardDescription>All crime types, statewide</CardDescription>
            </div>
            <Badge variant="info" dot>Live</Badge>
          </CardHeader>
          <CardContent>
            {isLoadingTrend ? (
               <div className="h-[260px] flex items-center justify-center text-sx-text-dim">Loading chart...</div>
            ) : (
               <ReactECharts option={trendOption} style={{ height: 260 }} />
            )}
          </CardContent>
        </Card>

        {/* Recent alerts feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingAlerts ? (
              <div className="p-5 text-center text-sx-text-dim">Loading alerts...</div>
            ) : (
              <ul className="divide-y divide-sx-border">
                {liveAlerts.length === 0 && <li className="px-5 py-3.5 text-sx-text-dim text-sm">No recent alerts</li>}
                {liveAlerts.map((a: any) => (
                  <li key={a.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-sx-text leading-snug">{a.message || a.msg}</p>
                      <Badge variant={a.severity} className="shrink-0">
                        {a.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-sx-text-faint mt-1">
                      {a.created_at ? new Date(a.created_at).toLocaleTimeString() : (a.time || "Just now")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* District risk table */}
      <Card>
        <CardHeader>
          <CardTitle>District Risk Ranking</CardTitle>
          <CardDescription>Composite risk score — updated nightly</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-sx-text-faint uppercase tracking-wide border-b border-sx-border">
                <th className="px-5 py-3 font-medium">District</th>
                <th className="px-5 py-3 font-medium">Risk Score</th>
                <th className="px-5 py-3 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sx-border">
              {isLoadingSummary ? (
                 <tr><td colSpan={3} className="px-5 py-3 text-center text-sx-text-dim">Loading...</td></tr>
              ) : summary?.district_risk?.map((d: any) => (
                <tr key={d.district_id || d.district} className="hover:bg-sx-panel-light/50 transition-colors">
                  <td className="px-5 py-3 text-sx-text">{d.district_name || d.district}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-28 h-1.5 rounded-full bg-sx-panel-light overflow-hidden">
                        <div
                          className="h-full bg-sx-accent"
                          style={{ width: `${d.score}%` }}
                        />
                      </div>
                      <span className="text-xs text-sx-text-dim">{d.score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={d.severity}>{d.severity}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
