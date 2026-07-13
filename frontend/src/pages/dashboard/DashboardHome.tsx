/**
 * SentinelX AI — Dashboard Home
 *
 * Command-center landing view: KPI stat tiles, a crime trend snapshot,
 * district risk table, and recent alerts feed. All data is dummy/mock —
 * wired to `/api/v1/*` endpoints once the backend is live.
 */
import ReactECharts from "echarts-for-react";
import {
  FileWarning,
  MapPinned,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const STATS = [
  {
    label: "Total FIRs (30d)",
    value: "4,812",
    delta: "+6.2%",
    trend: "up" as const,
    icon: FileWarning,
    colorClass: "text-[#00F2FE] bg-[#00F2FE]/5 border border-[#00F2FE]/20 group-hover:bg-[#00F2FE]/10 group-hover:border-[#00F2FE]/40 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.5)]",
  },
  {
    label: "Active Hotspots",
    value: "37",
    delta: "+3",
    trend: "up" as const,
    icon: MapPinned,
    colorClass: "text-[#FF4500] bg-[#FF4500]/5 border border-[#FF4500]/20 group-hover:bg-[#FF4500]/10 group-hover:border-[#FF4500]/40 group-hover:shadow-[0_0_15px_rgba(255,69,0,0.5)]",
  },
  {
    label: "Missing Persons (open)",
    value: "128",
    delta: "-8.1%",
    trend: "down" as const,
    icon: Users,
    colorClass: "text-[#A855F7] bg-[#A855F7]/5 border border-[#A855F7]/20 group-hover:bg-[#A855F7]/10 group-hover:border-[#A855F7]/40 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  },
  {
    label: "Forecast Risk (7d)",
    value: "Elevated",
    delta: "3 districts",
    trend: "up" as const,
    icon: TrendingUp,
    colorClass: "text-[#EAB308] bg-[#EAB308]/5 border border-[#EAB308]/20 group-hover:bg-[#EAB308]/10 group-hover:border-[#EAB308]/40 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]",
  },
];

const DISTRICT_RISK = [
  { district: "Bengaluru Urban", score: 82, severity: "critical" as const },
  { district: "Mysuru", score: 61, severity: "high" as const },
  { district: "Mangaluru", score: 44, severity: "medium" as const },
  { district: "Hubballi-Dharwad", score: 38, severity: "medium" as const },
  { district: "Belagavi", score: 21, severity: "low" as const },
];

const RECENT_ALERTS = [
  { id: "1", msg: "Anomaly: burglary spike in Yelahanka (+40% vs 4-wk avg)", severity: "high" as const, time: "12 min ago" },
  { id: "2", msg: "New hotspot formed near Majestic Bus Stand", severity: "critical" as const, time: "48 min ago" },
  { id: "3", msg: "Missing person match found — case #MP-2291", severity: "medium" as const, time: "2 hr ago" },
  { id: "4", msg: "Forecast: chain-snatching risk elevated in Indiranagar this weekend", severity: "medium" as const, time: "4 hr ago" },
];

const trendOption = {
  backgroundColor: "transparent",
  grid: { left: 36, right: 16, top: 16, bottom: 28 },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      data: [120, 132, 101, 154, 190, 210, 176],
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

export default function DashboardHome() {
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
        {STATS.map(({ label, value, delta, trend, icon: Icon, colorClass }) => (
          <Card key={label} className="group cursor-default hover:bg-sx-panel-light/30 transition-colors duration-300">
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-xs text-sx-text-dim">{label}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
                <div
                  className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                    trend === "up" ? "text-sx-critical" : "text-sx-success"
                  }`}
                >
                  {trend === "up" ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {delta}
                </div>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${colorClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Trend chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Crime Volume — Last 7 Days</CardTitle>
              <CardDescription>All crime types, statewide</CardDescription>
            </div>
            <Badge variant="info" dot>
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            <ReactECharts option={trendOption} style={{ height: 260 }} />
          </CardContent>
        </Card>

        {/* Recent alerts feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-sx-border">
              {RECENT_ALERTS.map((a) => (
                <li key={a.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-sx-text leading-snug">{a.msg}</p>
                    <Badge variant={a.severity} className="shrink-0">
                      {a.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-sx-text-faint mt-1">{a.time}</p>
                </li>
              ))}
            </ul>
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
              {DISTRICT_RISK.map((d) => (
                <tr key={d.district} className="hover:bg-sx-panel-light/50 transition-colors">
                  <td className="px-5 py-3 text-sx-text">{d.district}</td>
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
