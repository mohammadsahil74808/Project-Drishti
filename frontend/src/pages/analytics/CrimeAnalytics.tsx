/**
 * SentinelX AI — Crime Analytics Page
 *
 * Trend and distribution analysis over historical crime data (dummy series).
 * Pairs each chart with a grounded AI-generated narrative summary, matching
 * the "AI-Powered Insights" pattern from the project blueprint.
 */
import ReactECharts from "echarts-for-react";
import { Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const trendOption = {
  backgroundColor: "transparent",
  grid: { left: 40, right: 20, top: 30, bottom: 30 },
  legend: {
    data: ["This Year", "Last Year"],
    textStyle: { color: "#9CA3AF", fontSize: 11 },
    top: 0,
  },
  xAxis: {
    type: "category",
    data: MONTHS,
    axisLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 11 },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 11 },
  },
  tooltip: { trigger: "axis" },
  series: [
    {
      name: "This Year",
      type: "line",
      smooth: true,
      data: [820, 932, 901, 1034, 1290, 1330, 1320],
      lineStyle: { color: "#3B82F6", width: 2 },
      itemStyle: { color: "#3B82F6" },
      symbol: "circle",
      symbolSize: 5,
    },
    {
      name: "Last Year",
      type: "line",
      smooth: true,
      data: [780, 850, 870, 920, 1010, 1080, 1120],
      lineStyle: { color: "#6B7280", width: 2, type: "dashed" },
      itemStyle: { color: "#6B7280" },
      symbol: "circle",
      symbolSize: 5,
    },
  ],
};

const distributionOption = {
  backgroundColor: "transparent",
  grid: { left: 100, right: 30, top: 10, bottom: 20 },
  xAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 11 },
  },
  yAxis: {
    type: "category",
    data: ["Theft", "Chain Snatching", "Burglary", "Assault", "Vehicle Theft", "Cybercrime", "Robbery"],
    axisLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 11 },
  },
  tooltip: { trigger: "axis" },
  series: [
    {
      type: "bar",
      barWidth: 14,
      data: [1240, 860, 740, 512, 690, 340, 210],
      itemStyle: { color: "#3B82F6", borderRadius: [0, 4, 4, 0] },
    },
  ],
};

const dayOfWeekOption = {
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
  tooltip: { trigger: "axis" },
  series: [
    {
      type: "bar",
      data: [140, 132, 145, 150, 210, 268, 190],
      itemStyle: {
        color: (params: { dataIndex: number }) =>
          params.dataIndex >= 4 ? "#F59E0B" : "#3B82F6",
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
};

export default function CrimeAnalytics() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Crime Analytics</h1>
        <p className="text-sm text-sx-text-dim mt-1">
          Trend, distribution, and pattern analysis across Karnataka
        </p>
      </div>

      {/* AI Insight banner */}
      <Card className="border-sx-accent/30 bg-sx-accent/5">
        <CardContent className="flex items-start gap-3 py-4">
          <div className="h-8 w-8 rounded-lg bg-sx-accent/15 flex items-center justify-center text-sx-accent shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-sx-text">
              <span className="font-semibold text-white">AI Insight:</span> Chain-snatching
              cases rose 34% this quarter, concentrated on weekends between 7–9 PM near
              transit hubs. Vehicle theft is trending down 8% following increased night patrols.
            </p>
            <p className="text-[11px] text-sx-text-faint mt-1">
              Generated from aggregated statistics — not a substitute for case-level review.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Crime Volume Trend</CardTitle>
              <CardDescription>Year-over-year comparison, statewide</CardDescription>
            </div>
            <Badge variant="neutral">Monthly</Badge>
          </CardHeader>
          <CardContent>
            <ReactECharts option={trendOption} style={{ height: 300 }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Day of Week</CardTitle>
            <CardDescription>Weekend spike pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={dayOfWeekOption} style={{ height: 300 }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crime Type Distribution</CardTitle>
          <CardDescription>Total reported cases — last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ReactECharts option={distributionOption} style={{ height: 320 }} />
        </CardContent>
      </Card>
    </div>
  );
}
