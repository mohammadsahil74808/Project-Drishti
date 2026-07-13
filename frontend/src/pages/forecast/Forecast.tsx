import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { TrendingUp, Info, Activity, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import * as echarts from "echarts/core";
import { useQuery } from "@tanstack/react-query";
import { forecastApi, geoApi } from "@/api";

const HORIZONS = ["7 days", "14 days", "30 days"];

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
  const [district, setDistrict] = useState("");
  const [horizon, setHorizon] = useState(HORIZONS[1]);

  const { data: districtsData } = useQuery({
    queryKey: ["districts"],
    queryFn: geoApi.getDistricts,
  });

  const districts = districtsData || [];

  // Use selected district id, fallback to empty
  const districtId = district || (districts.length > 0 ? districts[0].id : "");
  const crimeType = "theft"; // Default crime type for the forecast view

  const { data, isLoading, isError } = useQuery({
    queryKey: ["forecast", districtId, horizon],
    queryFn: () => forecastApi.getForecast(districtId, crimeType),
    enabled: !!districtId,
  });

  const points = data?.points || [];
  
  const dates = points.map((p: any) => p.forecast_date);
  const predicted = points.map((p: any) => p.predicted_count);
  const lower = points.map((p: any) => p.lower_bound);
  const upper = points.map((p: any) => p.upper_bound);
  const actual = points.map((p: any) => p.actual_count);

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
      data: dates,
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
        data: upper,
        lineStyle: { opacity: 0 },
        areaStyle: { 
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(129, 140, 248, 0.2)" },
            { offset: 1, color: "rgba(129, 140, 248, 0.0)" }
          ])
        },
        stack: "band",
        symbol: "none",
      },
      {
        name: "_lowerHelper",
        type: "line",
        data: lower,
        lineStyle: { opacity: 0 },
        symbol: "none",
        stack: "band2",
        tooltip: { show: false },
        areaStyle: { color: "#040814" } // Match background to hollow out the bottom
      },
      {
        name: "Actual",
        type: "line",
        data: actual,
        lineStyle: { color: "#2DD4BF", width: 2 },
        itemStyle: { color: "#2DD4BF", borderWidth: 2, borderColor: "#040814" },
        symbol: "circle",
        symbolSize: 6,
        z: 3,
      },
      {
        name: "Forecast",
        type: "line",
        data: predicted,
        lineStyle: { color: "#818CF8", width: 2, type: "dashed" },
        itemStyle: { color: "#818CF8", borderWidth: 2, borderColor: "#040814" },
        symbol: "circle",
        symbolSize: 6,
        z: 2,
      },
    ],
  };

  const peakDay = points.length > 0 ? points.reduce((prev: any, current: any) => (prev.predicted_count > current.predicted_count) ? prev : current) : null;

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
            {districts.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
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
                <p className="text-2xl font-semibold text-white tracking-tight">{peakDay ? Math.round(peakDay.predicted_count) : "--"}</p>
                <p className="text-sm text-slate-500">cases</p>
              </div>
              <p className="text-xs text-indigo-400 mt-1">Expected on {peakDay ? peakDay.forecast_date : "--"}</p>
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
            {isLoading ? (
               <div className="flex items-center justify-center h-full text-slate-500">Loading forecast...</div>
            ) : isError ? (
               <div className="flex items-center justify-center h-full text-rose-500">Failed to load forecast.</div>
            ) : (
               <ReactECharts option={forecastOption} style={{ height: "100%", width: "100%" }} />
            )}
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
