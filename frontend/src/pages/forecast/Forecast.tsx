/**
 * SentinelX AI — Predictive Crime Forecast Page
 *
 * Prophet + LightGBM ensemble output (dummy series here) rendered with
 * confidence bands — never a bare point estimate, per the project blueprint's
 * emphasis on statistical rigor for the jury/command staff.
 */
import { useState } from "react";
import ReactECharts from "echarts-for-react";
import { TrendingUp, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const DISTRICTS = ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi"];
const HORIZONS = ["7 days", "14 days", "30 days"];

// Dummy forecast series: date, predicted, lower, upper, actual (past only)
const DATES = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
const ACTUAL = [61, 58, 65, 70, 68, 74, 80, null, null, null, null, null, null, null];
const PREDICTED = [62, 59, 63, 71, 69, 73, 79, 84, 88, 91, 87, 93, 97, 102];
const LOWER = PREDICTED.map((v) => Math.round(v * 0.85));
const UPPER = PREDICTED.map((v) => Math.round(v * 1.15));

const forecastOption = {
  backgroundColor: "transparent",
  grid: { left: 40, right: 20, top: 30, bottom: 30 },
  legend: {
    data: ["Actual", "Predicted", "Confidence Band"],
    textStyle: { color: "#9CA3AF", fontSize: 11 },
    top: 0,
  },
  xAxis: {
    type: "category",
    data: DATES,
    axisLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 10 },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 11 },
  },
  tooltip: { trigger: "axis" },
  series: [
    {
      name: "Confidence Band",
      type: "line",
      data: UPPER,
      lineStyle: { opacity: 0 },
      areaStyle: { color: "rgba(59,130,246,0.12)" },
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
    },
    {
      name: "Predicted",
      type: "line",
      data: PREDICTED,
      lineStyle: { color: "#3B82F6", width: 2, type: "dashed" },
      itemStyle: { color: "#3B82F6" },
      symbol: "circle",
      symbolSize: 5,
    },
    {
      name: "Actual",
      type: "line",
      data: ACTUAL,
      lineStyle: { color: "#10B981", width: 2 },
      itemStyle: { color: "#10B981" },
      symbol: "circle",
      symbolSize: 5,
    },
  ],
};

const backtestOption = {
  backgroundColor: "transparent",
  grid: { left: 40, right: 20, top: 20, bottom: 30 },
  xAxis: {
    type: "category",
    data: ["Wk-4", "Wk-3", "Wk-2", "Wk-1"],
    axisLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 11 },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#1F2937" } },
    axisLabel: { color: "#9CA3AF", fontSize: 11, formatter: "{value}%" },
  },
  tooltip: { trigger: "axis" },
  series: [
    {
      type: "bar",
      data: [8.2, 6.9, 7.4, 5.8],
      itemStyle: { color: "#3B82F6", borderRadius: [4, 4, 0, 0] },
      barWidth: 28,
    },
  ],
};

export default function Forecast() {
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [horizon, setHorizon] = useState(HORIZONS[1]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Predictive Crime Forecast</h1>
          <p className="text-sm text-sx-text-dim mt-1">
            Prophet + LightGBM ensemble — {horizon} horizon
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-sx-panel border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {DISTRICTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
            className="bg-sx-panel border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {HORIZONS.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-sx-text-dim">Predicted Peak Day</p>
            <p className="text-lg font-semibold text-white mt-1">Day 14 · 102 cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-sx-text-dim">Risk Trend</p>
            <div className="flex items-center gap-2 mt-1">
              <TrendingUp className="h-4 w-4 text-sx-critical" />
              <p className="text-lg font-semibold text-white">Rising</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-xs text-sx-text-dim">Model Accuracy (MAPE)</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg font-semibold text-white">7.1%</p>
              <Badge variant="success">Good fit</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{district} — Forecast vs Actual</CardTitle>
            <CardDescription>Shaded band = 85–115% confidence interval</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ReactECharts option={forecastOption} style={{ height: 320 }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backtest Error (MAPE) — Last 4 Weeks</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts option={backtestOption} style={{ height: 220 }} />
        </CardContent>
        <div className="flex items-start gap-2 px-5 pb-5 -mt-2">
          <Info className="h-3.5 w-3.5 text-sx-text-faint shrink-0 mt-0.5" />
          <p className="text-[11px] text-sx-text-faint">
            Model retrains nightly on the latest FIR data. Lower MAPE indicates
            tighter historical prediction accuracy.
          </p>
        </div>
      </Card>
    </div>
  );
}
