/**
 * SentinelX AI — Crime Analytics Page
 *
 * Advanced trend and distribution analysis with glowing ECharts visualizations.
 * Includes Area Line Charts, Gradient Bar Charts, and a Radar Chart.
 */
import ReactECharts from "echarts-for-react";
import { Sparkles, BrainCircuit } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import * as echarts from "echarts/core";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const trendOption = {
  backgroundColor: "transparent",
  grid: { left: 45, right: 20, top: 40, bottom: 30 },
  legend: {
    data: ["This Year", "Last Year"],
    textStyle: { color: "#94A3B8", fontSize: 12, fontFamily: "Inter" },
    top: 0,
    icon: "circle"
  },
  xAxis: {
    type: "category",
    data: MONTHS,
    axisLine: { lineStyle: { color: "rgba(0, 242, 254, 0.15)" } },
    axisLabel: { color: "#94A3B8", fontSize: 11, fontFamily: "Inter" },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "rgba(0, 242, 254, 0.05)", type: "dashed" } },
    axisLabel: { color: "#94A3B8", fontSize: 11, fontFamily: "Inter" },
  },
  tooltip: { 
    trigger: "axis",
    backgroundColor: "rgba(8, 16, 32, 0.85)",
    borderColor: "rgba(0, 242, 254, 0.3)",
    textStyle: { color: "#F8FAFC" }
  },
  series: [
    {
      name: "This Year",
      type: "line",
      smooth: true,
      data: [820, 932, 901, 1034, 1290, 1330, 1320],
      lineStyle: { 
        color: "#00F2FE", 
        width: 3,
        shadowColor: "rgba(0, 242, 254, 0.5)",
        shadowBlur: 10
      },
      itemStyle: { color: "#00F2FE", shadowBlur: 10, shadowColor: "#00F2FE" },
      symbol: "circle",
      symbolSize: 8,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(0, 242, 254, 0.4)" },
          { offset: 1, color: "rgba(0, 242, 254, 0.0)" }
        ])
      }
    },
    {
      name: "Last Year",
      type: "line",
      smooth: true,
      data: [780, 850, 870, 920, 1010, 1080, 1120],
      lineStyle: { color: "#475569", width: 2, type: "dashed" },
      itemStyle: { color: "#475569" },
      symbol: "none",
    },
  ],
};

const distributionOption = {
  backgroundColor: "transparent",
  grid: { left: 110, right: 30, top: 20, bottom: 20 },
  xAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "rgba(0, 242, 254, 0.05)", type: "dashed" } },
    axisLabel: { color: "#94A3B8", fontSize: 11, fontFamily: "Inter" },
  },
  yAxis: {
    type: "category",
    data: ["Theft", "Snatching", "Burglary", "Assault", "Vehicle", "Cyber", "Robbery"],
    axisLine: { lineStyle: { color: "rgba(0, 242, 254, 0.15)" } },
    axisLabel: { color: "#F8FAFC", fontSize: 12, fontFamily: "Rajdhani" },
  },
  tooltip: { 
    trigger: "axis",
    backgroundColor: "rgba(8, 16, 32, 0.85)",
    borderColor: "rgba(0, 242, 254, 0.3)",
    textStyle: { color: "#F8FAFC" }
  },
  series: [
    {
      type: "bar",
      barWidth: 16,
      data: [1240, 860, 740, 512, 690, 340, 210],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 0, color: "#00F2FE" },
          { offset: 1, color: "#4338CA" }
        ]),
        borderRadius: [0, 4, 4, 0],
        shadowColor: "rgba(0, 242, 254, 0.2)",
        shadowBlur: 5
      },
    },
  ],
};

const threatOption = {
  backgroundColor: "transparent",
  grid: { left: 90, right: 30, top: 20, bottom: 20 },
  xAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "rgba(0, 242, 254, 0.05)", type: "dashed" } },
    axisLabel: { color: "#94A3B8", fontSize: 11, fontFamily: "Inter" },
  },
  yAxis: {
    type: "category",
    data: ["Residential", "Commercial", "Transit Hubs", "Weekends", "Night Shifts"],
    axisLine: { lineStyle: { color: "rgba(0, 242, 254, 0.15)" } },
    axisLabel: { color: "#F8FAFC", fontSize: 12, fontFamily: "Rajdhani" },
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(8, 16, 32, 0.85)",
    borderColor: "rgba(0, 242, 254, 0.3)",
    textStyle: { color: "#F8FAFC" }
  },
  series: [
    {
      name: "Incidents",
      type: "bar",
      barWidth: 14,
      data: [100, 150, 250, 280, 220],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 0, color: "#FF4500" }, // Cyberpunk orange/red
          { offset: 1, color: "rgba(255, 69, 0, 0.2)" }
        ]),
        borderRadius: [0, 4, 4, 0],
        shadowColor: "rgba(255, 69, 0, 0.4)",
        shadowBlur: 8
      }
    }
  ]
};

export default function CrimeAnalytics() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white sx-heading">Crime Analytics</h1>
        <p className="text-sm text-sx-text-dim mt-1">
          Trend, distribution, and pattern analysis across Karnataka
        </p>
      </div>

      {/* AI Insight banner */}
      <Card className="sx-panel-base border-sx-accent/30 bg-sx-surface/60 relative overflow-hidden group">
        {/* Animated glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-sx-accent/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        
        <CardContent className="flex items-start gap-4 py-4 relative z-10">
          <div className="h-10 w-10 rounded-lg bg-sx-surface border border-sx-accent/40 flex items-center justify-center text-sx-accent shrink-0 shadow-[0_0_15px_rgba(0,242,254,0.3)] group-hover:shadow-[0_0_25px_rgba(0,242,254,0.5)] transition-shadow duration-500">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white tracking-wide sx-heading text-sm">Sentinel Insight</span>
              <Sparkles className="h-3.5 w-3.5 text-sx-accent animate-pulse" />
            </div>
            <p className="text-sm text-sx-text/90 leading-relaxed">
              Chain-snatching cases rose <strong className="text-sx-alert">34%</strong> this quarter, concentrated on weekends between 7–9 PM near transit hubs. Vehicle theft is trending down <strong className="text-sx-success">8%</strong> following increased night patrols.
            </p>
            <p className="text-[11px] text-sx-text-faint mt-1.5 uppercase tracking-wider font-semibold">
              Source: Aggregated Geospatial Analytics Pipeline
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 sx-panel-base border-none shadow-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Crime Volume Trend</CardTitle>
                <CardDescription>Year-over-year comparison, statewide</CardDescription>
              </div>
              <Badge variant="info" className="bg-sx-accent/10 border-sx-accent/30 text-sx-accent">Live Telemetry</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[320px]">
              <ReactECharts option={trendOption} style={{ height: "100%", width: "100%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="sx-panel-base border-none shadow-glow">
          <CardHeader>
            <CardTitle>Threat Profiling</CardTitle>
            <CardDescription>Modus Operandi dimensional spread</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[320px] -mt-4">
              <ReactECharts option={threatOption} style={{ height: "100%", width: "100%" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="sx-panel-base border-none shadow-glow-dim">
        <CardHeader>
          <CardTitle>Crime Type Distribution</CardTitle>
          <CardDescription>Total reported cases — last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[320px]">
            <ReactECharts option={distributionOption} style={{ height: "100%", width: "100%" }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
