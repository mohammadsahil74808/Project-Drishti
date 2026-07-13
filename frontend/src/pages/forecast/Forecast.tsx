/**
 * SentinelX AI — Predictive Crime Forecast Page
 *
 * Minimalist, elite AI dashboard styling.
 * Prophet + LightGBM ensemble output rendered with elegant confidence bands.
 */
import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { TrendingUp, Info, Activity, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import * as echarts from "echarts/core";

const DISTRICTS = ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi"];
const HORIZONS = ["7 days", "14 days", "30 days"];

// Dummy forecast series: date, predicted, lower, upper, actual (past only)
const DATES = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
const ACTUAL = [61, 58, 65, 70, 68, 74, 80, null, null, null, null, null, null, null];
const PREDICTED = [62, 59, 63, 71, 69, 73, 79, 84, 88, 91, 87, 93, 97, 102];
const LOWER = PREDICTED.map((v) => Math.round(v * 0.85));
const UPPER = PREDICTED.map((v) => Math.round(v * 1.15));
const PREDICTED_FUTURE = PREDICTED.map((v, i) => i >= 6 ? v : null);

const forecastOption = {
  backgroundColor: "transparent",
  grid: { left: 40, right: 30, top: 40, bottom: 30 },
  legend: {
    data: ["Actual", "Forecast", "Confidence Band"],
    textStyle: { color: "#94A3B8", fontSize: 12, fontFamily: "Inter" },
    top: 0,
    icon: "circle",
    itemGap: 24,
  },
  xAxis: {
    type: "category",
    data: DATES,
    axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    axisLabel: { color: "#64748B", fontSize: 11, fontFamily: "Inter" },
    splitLine: { show: false },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.03)" } },
    axisLabel: { color: "#64748B", fontSize: 11, fontFamily: "Inter" },
  },
  tooltip: { 
    trigger: "axis",
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "rgba(255,255,255,0.1)",
    textStyle: { color: "#F8FAFC", fontFamily: "Inter" },
    padding: [12, 16],
    borderRadius: 8,
  },
  series: [
    {
      name: "Confidence Band",
      type: "line",
      data: UPPER,
      lineStyle: { opacity: 0 },
      areaStyle: { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(129, 140, 248, 0.2)" }, // Soft Indigo
          { offset: 1, color: "rgba(129, 140, 248, 0.0)" }
        ])
      },
      stack: "band",
      symbol: "none",
    },
    {
      name: "_lowerHelper",
      type: "line",
      data: LOWER,
      lineStyle: { opacity: 0 },
      symbol: "none",
      stack: "band2",
      tooltip: { show: false },
      areaStyle: { color: "#040814" } // Match background to hollow out the bottom
    },
    {
      name: "Actual",
      type: "line",
      data: ACTUAL,
      lineStyle: { color: "#2DD4BF", width: 2 }, // Soft Teal
      itemStyle: { color: "#2DD4BF", borderWidth: 2, borderColor: "#040814" },
      symbol: "circle",
      symbolSize: 6,
      z: 3,
    },
    {
      name: "Forecast",
      type: "line",
      data: PREDICTED_FUTURE,
      lineStyle: { color: "#818CF8", width: 2, type: "dashed" }, // Soft Indigo
      itemStyle: { color: "#818CF8", borderWidth: 2, borderColor: "#040814" },
      symbol: "circle",
      symbolSize: 6,
      z: 2,
    },
  ],
};

const backtestOption = {
  backgroundColor: "transparent",
  grid: { left: 45, right: 20, top: 30, bottom: 25 },
  xAxis: {
    type: "category",
    data: ["Wk-4", "Wk-3", "Wk-2", "Wk-1"],
    axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    axisLabel: { color: "#64748B", fontSize: 11, fontFamily: "Inter" },
    axisTick: { show: false },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.03)" } },
    axisLabel: { color: "#64748B", fontSize: 11, formatter: "{value}%", fontFamily: "Inter" },
  },
  tooltip: { 
    trigger: "axis",
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "rgba(255,255,255,0.1)",
    textStyle: { color: "#F8FAFC" }
  },
  series: [
    {
      type: "bar",
      data: [8.2, 6.9, 7.4, 5.8],
      itemStyle: { 
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#818CF8" },
          { offset: 1, color: "rgba(129, 140, 248, 0.2)" }
        ]),
        borderRadius: [4, 4, 0, 0] 
      },
      barWidth: 24,
    },
  ],
};

export default function Forecast() {
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [horizon, setHorizon] = useState(HORIZONS[1]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Predictive Forecast</h1>
          <p className="text-sm text-slate-400 mt-1 font-light">
            Prophet + LightGBM ensemble — {horizon} horizon
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-slate-900/50 border border-slate-700/50 rounded-md text-sm text-slate-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            {DISTRICTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="bg-slate-900/50 border border-slate-700/50 rounded-md text-sm text-slate-200 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            {HORIZONS.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-none rounded-xl">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Predicted Peak Day</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-white tracking-tight">102</p>
                <p className="text-sm text-slate-500">cases</p>
              </div>
              <p className="text-xs text-indigo-400 mt-1">Expected on Day 14</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Target className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-none rounded-xl">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Risk Trend</p>
              <p className="text-2xl font-semibold text-white tracking-tight">Rising</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+14% vs baseline</span>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Activity className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-none rounded-xl">
          <CardContent className="p-5 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Model Accuracy</p>
              <p className="text-2xl font-semibold text-white tracking-tight">92.9%</p>
              <p className="text-xs text-teal-400 mt-1">7.1% MAPE</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400">
              <Badge variant="success" className="bg-teal-500/20 text-teal-400 border-none hover:bg-teal-500/20">Optimal</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-none rounded-xl">
        <CardHeader className="px-6 py-5 border-b border-slate-800/60">
          <div>
            <CardTitle className="text-lg font-medium text-white">{district} — Forecast vs Actual</CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">Shaded band represents 85–115% confidence interval</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full h-[360px]">
            <ReactECharts option={forecastOption} style={{ height: "100%", width: "100%" }} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/40 border border-slate-800/60 backdrop-blur-md shadow-none rounded-xl">
        <CardHeader className="px-6 py-5 border-b border-slate-800/60 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium text-white">Backtest Error (MAPE)</CardTitle>
          <div className="flex items-center gap-2 group cursor-pointer">
            <Info className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">How is this calculated?</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full h-[240px]">
            <ReactECharts option={backtestOption} style={{ height: "100%", width: "100%" }} />
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-3xl">
            Model retrains nightly on the latest FIR data. Lower MAPE (Mean Absolute Percentage Error) indicates tighter historical prediction accuracy over the trailing 4-week window.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
