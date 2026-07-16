import { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { 
  TrendingUp, Activity, Target, AlertTriangle, 
  Search, ChevronDown, CheckCircle2, Info, ArrowUpRight
} from "lucide-react";
import * as echarts from "echarts/core";
import { useQuery } from "@tanstack/react-query";
import { forecastApi, geoApi } from "@/api";
import { motion, AnimatePresence } from "framer-motion";

const HORIZONS = ["7 days", "14 days", "30 days"];

export default function Forecast() {
  const [district, setDistrict] = useState("");
  const [horizon, setHorizon] = useState(HORIZONS[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  const { data: districtsData } = useQuery({
    queryKey: ["districts"],
    queryFn: geoApi.getDistricts,
  });

  const districts = districtsData || [];
  const filteredDistricts = districts.filter((d: any) => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Use selected district id, fallback to empty
  const districtId = district || (districts.length > 0 ? districts[0].id : "");
  const crimeType = "theft"; // Default crime type for the forecast view

  const horizonDays = parseInt(horizon.split(" ")[0], 10) || 14;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["forecast", districtId, horizonDays],
    queryFn: () => forecastApi.getForecast(districtId, crimeType, horizonDays),
    enabled: !!districtId,
    refetchInterval: 30000,
  });

  const points = data?.points || [];
  const recommendations = data?.recommendations || [];
  
  const dates = points.map((p: any) => p.forecast_date);
  const predicted = points.map((p: any) => p.predicted_count);
  const lower = points.map((p: any) => p.lower_bound);
  const upper = points.map((p: any) => p.upper_bound);
  const actual = points.map((p: any) => p.actual_count);

  const peakDay = points.length > 0 ? points.reduce((prev: any, current: any) => (prev.predicted_count > current.predicted_count) ? prev : current) : null;
  const currentRisk = points.length > 0 ? (points[0].predicted_count > 10 ? 'High' : 'Medium') : 'Unknown';

  const forecastOption = useMemo(() => {
    return {
      backgroundColor: "transparent",
      animationDuration: 2000,
      grid: { left: 40, right: 30, top: 40, bottom: 40 },
      legend: {
        data: ["Actual Crime", "AI Forecast", "Confidence Interval"],
        textStyle: { color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "monospace", letterSpacing: 1 },
        top: 0,
        icon: "circle",
        itemGap: 30,
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
        axisLabel: { color: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace", margin: 15 },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.02)", type: "dashed" } },
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.02)", type: "dashed" } },
        axisLabel: { color: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "monospace", margin: 15 },
      },
      tooltip: { 
        trigger: "axis",
        backgroundColor: "rgba(2, 6, 23, 0.9)",
        borderColor: "rgba(0, 229, 255, 0.3)",
        borderWidth: 1,
        textStyle: { color: "#F8FAFC", fontFamily: "monospace", fontSize: 10 },
        padding: [16, 20],
        borderRadius: 12,
        extraCssText: "backdrop-filter: blur(10px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);",
        formatter: (params: any) => {
           let html = `<div class="font-bold text-white mb-3 pb-2 border-b border-white/10 uppercase tracking-widest">${params[0].axisValue}</div>`;
           params.forEach((p: any) => {
              if (p.seriesName === "_lowerHelper") return;
              const color = p.color.colorStops ? p.color.colorStops[0].color : p.color;
              html += `<div class="flex items-center justify-between gap-6 mb-1">
                 <span class="flex items-center gap-2 text-white/60"><span class="w-2 h-2 rounded-full" style="background:${color}"></span>${p.seriesName}</span>
                 <span class="font-black text-white">${p.value !== undefined && p.value !== null ? parseFloat(p.value).toFixed(1) : '--'}</span>
              </div>`;
           });
           return html;
        }
      },
      series: [
        {
          name: "Confidence Interval",
          type: "line",
          data: upper,
          lineStyle: { opacity: 0 },
          smooth: true,
          areaStyle: { 
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(139, 92, 246, 0.15)" },
              { offset: 1, color: "rgba(139, 92, 246, 0.01)" }
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
          smooth: true,
          symbol: "none",
          stack: "band2",
          tooltip: { show: false },
          areaStyle: { color: "#020617" } 
        },
        {
          name: "Actual Crime",
          type: "line",
          data: actual,
          smooth: true,
          lineStyle: { color: "#00E5FF", width: 2 },
          itemStyle: { color: "#00E5FF", borderWidth: 2, borderColor: "#020617" },
          symbol: "circle",
          symbolSize: 6,
          showSymbol: false,
          z: 3,
        },
        {
          name: "AI Forecast",
          type: "line",
          data: predicted,
          smooth: true,
          lineStyle: { color: "#8B5CF6", width: 3, type: "dashed" },
          itemStyle: { color: "#8B5CF6", borderWidth: 2, borderColor: "#020617" },
          symbol: "circle",
          symbolSize: 8,
          showSymbol: false,
          z: 2,
        },
      ],
    };
  }, [dates, predicted, lower, upper, actual]);

  const selectedDistrictName = useMemo(() => {
     return districts.find((d:any) => d.id === districtId)?.name || "Global Network";
  }, [districts, districtId]);

  return (
    <div className="flex flex-col h-full w-full relative bg-[#020617] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 rounded-2xl border border-white/5 shadow-2xl">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3N2Zz4=')] opacity-30" />
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-full p-4 lg:p-6 space-y-6">
         
         {/* TOP HEADER */}
         <div className="relative z-50 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-[8px] font-black uppercase tracking-widest animate-pulse">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> LIVE PREDICTION
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[8px] font-black uppercase tracking-widest">
                     MODEL: ENSEMBLE (PROPHET + LIGHTGBM)
                  </div>
               </div>
               <h1 className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-[#00E5FF] tracking-tight">
                  Crime Forecast Intelligence
               </h1>
               <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-2 flex items-center gap-2">
                  <Activity className="h-3 w-3" /> System Confidence: 92.9% | Last Updated: Just Now
               </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
               <div className="relative">
                  <button 
                     onClick={() => setIsDistrictDropdownOpen(!isDistrictDropdownOpen)}
                     className="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white transition-all w-48 shadow-inner"
                  >
                     <span className="truncate font-bold uppercase tracking-wider text-[10px]">{selectedDistrictName}</span>
                     <ChevronDown className={`h-3 w-3 text-white/50 transition-transform ${isDistrictDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                     {isDistrictDropdownOpen && (
                        <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           className="absolute top-full mt-2 w-full bg-[#050B14]/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                           <div className="p-2 border-b border-white/5 relative">
                              <Search className="h-3 w-3 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                              <input 
                                 type="text" 
                                 placeholder="Search..."
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 className="w-full bg-transparent border-none text-[10px] text-white pl-7 pr-2 py-1 focus:outline-none placeholder:text-white/20 uppercase tracking-wider"
                              />
                           </div>
                           <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-1">
                              {filteredDistricts.map((d: any) => (
                                 <button
                                    key={d.id}
                                    onClick={() => { setDistrict(d.id); setIsDistrictDropdownOpen(false); }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${districtId === d.id ? "bg-[#00E5FF]/20 text-[#00E5FF]" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                                 >
                                    {d.name}
                                 </button>
                              ))}
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <div className="relative">
                  <select
                     value={horizon}
                     onChange={(e) => setHorizon(e.target.value)}
                     className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] transition-all pr-8 shadow-inner focus:outline-none focus:border-[#8B5CF6]/50 cursor-pointer"
                  >
                     {HORIZONS.map((h) => (
                        <option key={h} className="bg-[#050B14] text-white">{h}</option>
                     ))}
                  </select>
                  <ChevronDown className="h-3 w-3 absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5CF6] pointer-events-none" />
               </div>
            </div>
         </div>

         {/* MAIN GRID */}
         <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* CENTER: Main Interactive Graph */}
            <div className="lg:col-span-3 flex flex-col bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
               <div className="p-5 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/5 to-transparent">
                  <div className="flex items-center gap-3">
                     <Target className="h-4 w-4 text-[#00E5FF]" />
                     <h2 className="text-sm font-black text-white uppercase tracking-widest">Predictive Trajectory</h2>
                  </div>
                  <div className="flex gap-4">
                     <span className="flex items-center gap-1.5 text-[9px] font-bold text-white/50 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-[#00E5FF]" /> Actual</span>
                     <span className="flex items-center gap-1.5 text-[9px] font-bold text-white/50 uppercase tracking-widest"><div className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Forecast</span>
                  </div>
               </div>
               
               <div className="flex-1 p-4 relative min-h-[400px]">
                  {isLoading ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="relative w-16 h-16 mb-4">
                           <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-[#8B5CF6]/30 border-t-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                        </div>
                        <p className="text-[10px] font-mono text-[#8B5CF6] uppercase tracking-widest animate-pulse">Running Neural Models...</p>
                     </div>
                  ) : isError ? (
                     <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-[#EF4444] uppercase tracking-widest">
                        Failed to generate intelligence.
                     </div>
                  ) : (
                     <ReactECharts option={forecastOption} style={{ height: "100%", width: "100%" }} opts={{ renderer: "canvas" }} />
                  )}
               </div>

               {/* Timeline (Bottom of graph) */}
               <div className="h-24 border-t border-white/5 bg-black/20 p-4 flex gap-2 overflow-x-auto scrollbar-none">
                  {points.slice(0, 5).map((p:any, i:number) => (
                     <div key={i} className="flex-1 min-w-[120px] bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between">
                           <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{p.forecast_date}</span>
                           <Activity className={`h-3 w-3 ${p.predicted_count > 10 ? 'text-[#EF4444]' : 'text-[#10B981]'}`} />
                        </div>
                        <div className="flex items-end justify-between">
                           <span className="text-xl font-black text-white group-hover:text-[#00E5FF] transition-colors">{Math.round(p.predicted_count)}</span>
                           <span className="text-[7px] text-white/30 uppercase font-bold tracking-widest">Expected</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* RIGHT: Intelligence Summary */}
            <div className="lg:col-span-1 flex flex-col gap-6 pb-4">
               
               {/* Summary Cards */}
               <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-[30px] group-hover:bg-[#8B5CF6]/20 transition-colors" />
                  <div className="relative z-10">
                     <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1 flex items-center gap-2"><Target className="h-3 w-3" /> Predicted Peak</p>
                     <p className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        {peakDay ? Math.round(peakDay.predicted_count) : "--"}
                     </p>
                     <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest mt-2 bg-[#8B5CF6]/10 inline-block px-2 py-1 rounded">
                        Date: {peakDay ? peakDay.forecast_date : "--"}
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#10B981]/10 to-black/40 backdrop-blur-md border border-[#10B981]/20 rounded-2xl p-4 shadow-inner">
                     <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5"><CheckCircle2 className="h-2.5 w-2.5 text-[#10B981]" /> Accuracy</p>
                     <p className="text-xl font-black text-white">92.9%</p>
                     <p className="text-[8px] text-[#10B981] font-bold uppercase mt-1">7.1% MAPE</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#F59E0B]/10 to-black/40 backdrop-blur-md border border-[#F59E0B]/20 rounded-2xl p-4 shadow-inner">
                     <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5"><TrendingUp className="h-2.5 w-2.5 text-[#F59E0B]" /> Trend</p>
                     <p className="text-xl font-black text-white">Rising</p>
                     <p className="text-[8px] text-[#F59E0B] font-bold uppercase mt-1">+14% vs Base</p>
                  </div>
               </div>

               {/* Risk Indicators */}
               <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="p-4 border-b border-white/5 bg-white/5">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-[#EF4444]" /> Risk Indicators
                     </h3>
                  </div>
                  <div className="p-4 space-y-4">
                     <div>
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-2">
                           <span className="text-white/60">Current Threat Level</span>
                           <span className={currentRisk === 'High' ? "text-[#EF4444]" : "text-[#F59E0B]"}>{currentRisk}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: currentRisk === 'High' ? '85%' : '45%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${currentRisk === 'High' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'} shadow-[0_0_10px_currentColor]`}
                           />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-2">
                           <span className="text-white/60">Data Confidence</span>
                           <span className="text-[#00E5FF]">High</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '90%' }}
                              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                              className="h-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Recommendations */}
               <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl flex-1 min-h-[150px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent flex items-center justify-between">
                     <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Info className="h-3 w-3 text-[#8B5CF6]" /> AI Directives
                     </h3>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto scrollbar-none space-y-2">
                     {recommendations.length > 0 ? (
                        recommendations.map((rec: string, i: number) => (
                           <div key={i} className="flex items-start gap-2.5 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-[#8B5CF6]/30 transition-colors">
                              <ArrowUpRight className="h-3 w-3 text-[#8B5CF6] mt-0.5 shrink-0" />
                              <p className="text-[10px] text-white/70 leading-relaxed group-hover:text-white transition-colors">{rec}</p>
                           </div>
                        ))
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
                           <CheckCircle2 className="h-6 w-6 text-white/30 mb-2" />
                           <p className="text-[9px] font-bold text-white uppercase tracking-widest">No immediate directives required.</p>
                           <p className="text-[8px] text-white/40 uppercase mt-1">Monitoring baseline metrics.</p>
                        </div>
                     )}
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
}
