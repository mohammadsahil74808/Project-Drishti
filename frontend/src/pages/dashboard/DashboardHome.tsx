import React, { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import {
  FileWarning, MapPinned, Users, TrendingUp, ArrowUpRight,
  Activity, ShieldAlert, Crosshair, Brain, Network, FileText,
  Database, Server, Cpu, Radio
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { dashboardApi, analyticsApi, alertsApi, firApi } from "@/api";
import { tokenStorage } from "@/api/client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const DashboardClock = React.memo(() => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <>{time}</>;
});

const AnimatedCounter = ({ value }: { value: string | number }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : (value || 0);
  const suffix = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => (latest % 1 === 0 ? latest.toFixed(0) : latest.toFixed(1)) + suffix);
  
  useEffect(() => {
    const animation = animate(count, numericValue, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    return animation.stop;
  }, [numericValue]);

  return <motion.span>{rounded}</motion.span>;
};

const getIconForStat = (label: string) => {
  if (label.toLowerCase().includes("hotspot") || label.toLowerCase().includes("district")) return MapPinned;
  if (label.toLowerCase().includes("missing")) return Users;
  if (label.toLowerCase().includes("wanted") || label.toLowerCase().includes("criminal")) return Crosshair;
  if (label.toLowerCase().includes("investigation")) return Activity;
  if (label.toLowerCase().includes("alert")) return ShieldAlert;
  if (label.toLowerCase().includes("ai risk")) return Brain;
  if (label.toLowerCase().includes("risk")) return TrendingUp;
  return FileWarning;
};

const getColorClassForStat = (label: string) => {
  if (label.toLowerCase().includes("alert") || label.toLowerCase().includes("wanted") || label.toLowerCase().includes("hotspot"))
    return "from-[#FF4500]/20 to-[#FF4500]/5 text-[#FF4500] shadow-[0_0_20px_rgba(255,69,0,0.4)] border-[#FF4500]/30";
  if (label.toLowerCase().includes("missing") || label.toLowerCase().includes("ai"))
    return "from-[#A855F7]/20 to-[#A855F7]/5 text-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.4)] border-[#A855F7]/30";
  if (label.toLowerCase().includes("risk") || label.toLowerCase().includes("investigation"))
    return "from-[#EAB308]/20 to-[#EAB308]/5 text-[#EAB308] shadow-[0_0_20px_rgba(234,179,8,0.4)] border-[#EAB308]/30";
  return "from-[#00F2FE]/20 to-[#00F2FE]/5 text-[#00F2FE] shadow-[0_0_20px_rgba(0,242,254,0.4)] border-[#00F2FE]/30";
};

export default function DashboardHome() {
  const { data: summary, isLoading: isLoadingSummary } = useQuery({ queryKey: ["dashboard-summary"], queryFn: dashboardApi.getSummary, refetchInterval: 30000 });
  const { data: trendData } = useQuery({ queryKey: ["analytics-trend"], queryFn: () => analyticsApi.getTrend("daily") });
  const { data: alertsData } = useQuery({ queryKey: ["alerts"], queryFn: alertsApi.getAlerts, refetchInterval: 30000 });
  const { data: firsData } = useQuery({ queryKey: ["firs-recent"], queryFn: () => firApi.getFirs({ page_size: 5 }) });
  
  const [liveAlerts, setLiveAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (alertsData) setLiveAlerts(alertsData);
  }, [alertsData]);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL).host : "localhost:8000";
    const wsUrl = new URL(`${protocol}//${host}/api/v1/ws/alerts`);
    if (token) wsUrl.searchParams.set("token", token);
    const ws = new WebSocket(wsUrl.toString());
    ws.onmessage = (event) => {
      try {
        const newAlert = JSON.parse(event.data);
        setLiveAlerts((prev) => [newAlert, ...prev].slice(0, 10));
      } catch (err) {}
    };
    return () => ws.close();
  }, []);

  const recentFirs = firsData?.items || [];

  const trendOption = useMemo(() => ({
    backgroundColor: "transparent",
    grid: { left: 45, right: 25, top: 20, bottom: 25 },
    xAxis: {
      type: "category",
      data: trendData?.points?.map((p: any) => p.period) || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "ui-monospace, monospace", margin: 12, fontWeight: 600 },
      splitLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.03)", type: "dashed" } },
      boundaryGap: false
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: "rgba(255,255,255,0.03)", type: "dashed" } },
      axisLabel: { color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "ui-monospace, monospace", margin: 12, fontWeight: 600 },
    },
    series: [
      {
        data: trendData?.points?.map((p: any) => p.count) || [42, 35, 54, 48, 62, 58, 68],
        type: "line",
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 8,
        showSymbol: false,
        lineStyle: { color: "#00E5FF", width: 3, shadowColor: "rgba(0, 229, 255, 0.5)", shadowBlur: 10, shadowOffsetY: 3 },
        itemStyle: { color: "#00E5FF", borderColor: "#050B14", borderWidth: 2 },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(0, 229, 255, 0.2)" },
              { offset: 1, color: "rgba(0, 229, 255, 0)" }
            ],
          },
        },
        animationDuration: 2000,
        animationEasing: "cubicOut"
      },
      {
         type: 'effectScatter',
         coordinateSystem: 'cartesian2d',
         data: (trendData?.points?.length > 0) ? [[trendData.points[trendData.points.length-1].period, trendData.points[trendData.points.length-1].count]] : [["Sun", 68]],
         symbolSize: 12,
         showEffectOn: 'render',
         rippleEffect: { brushType: 'stroke', scale: 3.5 },
         itemStyle: { color: '#00E5FF', shadowBlur: 10, shadowColor: '#00E5FF' },
         zlevel: 1
      }
    ],
    tooltip: { 
      trigger: "axis",
      backgroundColor: "rgba(5, 11, 20, 0.8)",
      borderColor: "rgba(0, 229, 255, 0.3)",
      borderWidth: 1,
      padding: [12, 16],
      textStyle: { color: "#fff", fontSize: 12, fontFamily: "ui-monospace, monospace" },
      axisPointer: {
         type: 'line',
         lineStyle: { color: 'rgba(0, 229, 255, 0.5)', width: 1, type: 'dashed' }
      }
    },
  }), [trendData]);

  return (
    <div className="relative min-h-screen space-y-6">
      {/* Animated Deep Background */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#050B14] rounded-3xl">
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#00F2FE] blur-[150px] mix-blend-screen pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#A855F7] blur-[150px] mix-blend-screen pointer-events-none" />
      </div>

      <div className="px-6 py-2 space-y-6 relative z-10">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-3xl py-5 px-6 overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 via-[#0A101C]/80 to-transparent backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {/* Inner glass reflections */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Karnataka Police AI Command Center
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sx-text-dim mt-2 text-lg font-medium tracking-wide flex items-center gap-2"
                >
                  <Cpu className="h-5 w-5 text-[#00F2FE]" /> Real-Time Crime Intelligence Platform
                </motion.p>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_10px_rgba(0,242,254,0.5)]">
                  <DashboardClock />
                </div>
                <Badge variant="info" className="bg-[#00F2FE]/10 border border-[#00F2FE]/30 text-[#00F2FE] px-3 py-1 shadow-[0_0_15px_rgba(0,242,254,0.3)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2 mr-2 inline-block"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE]"></span></span>
                  SYSTEM SECURED
                </Badge>
              </div>
            </div>

            {/* Live Status Area */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
                <Radio className="h-4 w-4 text-[#00F2FE] animate-pulse" />
                <span className="text-xs text-white/90 uppercase tracking-widest font-bold">AI Core Online</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
                <Activity className="h-4 w-4 text-[#A855F7] animate-[pulse_2s_ease-in-out_infinite]" />
                <span className="text-xs text-white/90 uppercase tracking-widest font-bold">Prediction Engine Active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
                <Database className="h-4 w-4 text-[#10B981]" />
                <span className="text-xs text-white/90 uppercase tracking-widest font-bold">Live Data Stream</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
                <Server className="h-4 w-4 text-[#EAB308]" />
                <span className="text-xs text-white/90 uppercase tracking-widest font-bold">31 Districts Connected</span>
              </div>
              <div className="ml-auto text-[11px] text-white/50 uppercase tracking-widest font-semibold flex items-center gap-2">
                Last Intelligence Sync: <span className="text-[#00F2FE] animate-pulse">Live</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* KPI TILES */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: 1200 }}
        >
          {isLoadingSummary ? (
            Array(8).fill(0).map((_, i) => <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse backdrop-blur-md border border-white/10" />)
          ) : (
            summary?.stats?.map((stat: any) => {
              const Icon = getIconForStat(stat.label);
              const colorTheme = getColorClassForStat(stat.label);
              
              return (
                <motion.div
                  key={stat.label}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5, z: 20 }}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-xl transition-all duration-300 group cursor-default ${colorTheme.split(' shadow')[0]} border-white/10 hover:border-white/30`}
                >
                  {/* Liquid background glow on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${colorTheme.split(' shadow')[0]} blur-xl`} />
                  
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  
                  <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <p className="text-xs text-white/60 uppercase tracking-widest font-bold max-w-[70%] leading-tight group-hover:text-white/90 transition-colors">
                        {stat.label}
                      </p>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border border-white/20 bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 ${colorTheme.split(' ')[1]}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-end justify-between">
                      <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        <AnimatedCounter value={stat.value} />
                      </h3>
                      {/* Optional micro chart or sparkline could go here, for now a decorative element */}
                      <div className="h-1 w-12 rounded-full bg-white/20 overflow-hidden">
                        <div className={`h-full w-2/3 bg-current rounded-full ${colorTheme.split(' ')[1]}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
        {/* Left Column (Trend) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="xl:col-span-2 space-y-6 relative group h-full"
        >
          <motion.div 
            whileHover={{ rotateX: 1, rotateY: -1, z: 10 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="border border-white/10 bg-gradient-to-br from-white/5 to-[#050B14]/80 backdrop-blur-2xl rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden relative h-full flex flex-col"
          >
             {/* Animated Light Sweep & Background Grid */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-[#00E5FF]/5 to-transparent blur-2xl pointer-events-none" />
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-60 mix-blend-overlay pointer-events-none" />
             
             {/* Radar Dots / Particles */}
             <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-1/4 left-1/3 w-1 h-1 bg-[#00E5FF] rounded-full shadow-[0_0_8px_#00E5FF] pointer-events-none" />
             <motion.div animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#8B5CF6] rounded-full shadow-[0_0_10px_#8B5CF6] pointer-events-none" />

             {/* Header */}
             <div className="px-6 pt-6 pb-2 relative z-10 flex justify-between items-start">
                <div>
                   <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] flex items-center gap-3 tracking-wide">
                      Crime Trend Intelligence
                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                         <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E5FF]"></span></span>
                         LIVE
                      </span>
                   </h2>
                   <p className="text-[10px] text-[#00E5FF]/70 mt-2 font-mono uppercase tracking-widest flex items-center gap-2">
                      <Radio className="h-3 w-3 animate-pulse" /> Live Monitoring â€¢ Sync <DashboardClock />
                   </p>
                </div>
                <div className="flex gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]/30 animate-[pulse_1s_ease-in-out_infinite]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]/50 animate-[pulse_1s_ease-in-out_infinite_150ms]" />
                   <div className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]/80 animate-[pulse_1s_ease-in-out_infinite_300ms]" />
                </div>
             </div>

             {/* Chart Area */}
             <div className="flex-1 px-4 relative z-10 w-full mt-2">
                <ReactECharts option={trendOption} style={{ height: '240px', width: '100%' }} />
             </div>

             {/* Bottom Analytics Strip */}
             <div className="px-6 pb-5 pt-4 relative z-10 border-t border-white/5 bg-black/20 mt-auto backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
                   <div className="flex items-center gap-2 bg-gradient-to-r from-white/5 to-transparent border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
                      <TrendingUp className="h-3 w-3 text-[#EF4444]" />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Rising</span>
                      <span className="text-[11px] font-black text-white ml-1">Theft</span>
                   </div>
                   <div className="flex items-center gap-2 bg-gradient-to-r from-white/5 to-transparent border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
                      <TrendingUp className="h-3 w-3 text-[#10B981] rotate-180" />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Falling</span>
                      <span className="text-[11px] font-black text-white ml-1">Assault</span>
                   </div>
                   <div className="flex items-center gap-2 bg-gradient-to-r from-white/5 to-transparent border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
                      <Activity className="h-3 w-3 text-[#00E5FF]" />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Avg Response</span>
                      <span className="text-[11px] font-black text-[#00E5FF] ml-1 shadow-[0_0_5px_rgba(0,229,255,0.5)]">4.2 min</span>
                   </div>
                   <div className="flex items-center gap-2 bg-gradient-to-r from-white/5 to-transparent border border-white/10 px-3 py-1.5 rounded-lg shrink-0">
                      <Brain className="h-3 w-3 text-[#8B5CF6]" />
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/50">Prediction Acc</span>
                      <span className="text-[11px] font-black text-[#8B5CF6] ml-1 shadow-[0_0_5px_rgba(139,92,246,0.5)]">94.8%</span>
                   </div>
                </div>
             </div>
          </motion.div>
        </motion.div>

        {/* Right Column (Alerts & Summaries) */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="border border-white/10 bg-[#050B14]/90 backdrop-blur-3xl rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden relative group"
            style={{ perspective: 1000 }}
          >
            <motion.div 
               whileHover={{ rotateX: 2, rotateY: -2, z: 20 }}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
               className="relative z-10 p-6 h-full flex flex-col"
            >
               {/* Animated Grid & Particles */}
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwyMjksMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-40 mix-blend-screen pointer-events-none" />
               <motion.div animate={{ opacity: [0, 0.5, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
               <motion.div animate={{ opacity: [0, 0.3, 0], scale: [0.5, 2, 0.5] }} transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }} className="absolute bottom-0 right-0 w-48 h-48 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />

               {/* Header */}
               <div className="flex items-center justify-between mb-6 relative z-10 border-b border-white/5 pb-4">
                  <div>
                     <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-white tracking-widest uppercase flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                        <Cpu className="h-4 w-4 text-[#00E5FF]" /> AI Command Intelligence
                     </h3>
                     <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2 py-0.5 rounded-full font-bold shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                           <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E5FF]"></span></span>
                           ONLINE
                        </span>
                        <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">UPTIME: 99.9%</span>
                     </div>
                  </div>
                  <div className="h-10 w-10 rounded-full border border-[#8B5CF6]/40 flex items-center justify-center bg-[#8B5CF6]/10 shadow-[0_0_20px_rgba(139,92,246,0.3)] relative">
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t border-r border-[#00E5FF] opacity-50" />
                     <Brain className="h-5 w-5 text-[#8B5CF6] animate-pulse relative z-10 drop-shadow-[0_0_5px_rgba(139,92,246,1)]" />
                  </div>
               </div>

               {/* System Core Capsules */}
               <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                  <div className="bg-gradient-to-br from-[#00E5FF]/5 to-transparent border border-[#00E5FF]/20 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden group">
                     <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-[#00E5FF]/10 pointer-events-none" />
                     <span className="text-[8px] text-[#00E5FF]/70 font-bold uppercase tracking-widest mb-1">Threat Engine</span>
                     <span className="text-xs font-black text-[#00E5FF] tracking-widest drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]">ANALYZING</span>
                  </div>
                  <div className="bg-gradient-to-br from-[#8B5CF6]/5 to-transparent border border-[#8B5CF6]/20 rounded-xl p-2 flex flex-col items-center justify-center relative overflow-hidden group">
                     <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 bg-[#8B5CF6]/10 pointer-events-none" />
                     <span className="text-[8px] text-[#8B5CF6]/70 font-bold uppercase tracking-widest mb-1">Forecast Engine</span>
                     <span className="text-xs font-black text-[#8B5CF6] tracking-widest drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]">PROCESSING</span>
                  </div>
               </div>

               {/* Live Thinking Panel */}
               <div className="relative mb-6 z-10 border border-[#00E5FF]/10 rounded-xl bg-black/40 overflow-hidden shadow-inner group-hover:border-[#00E5FF]/30 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00E5FF] to-[#8B5CF6]" />
                  <div className="p-4 pl-5">
                     <span className="text-[9px] text-[#00E5FF] font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Activity className="h-3 w-3 animate-pulse" /> Live Stream
                     </span>
                     <div className="font-mono text-[11px] text-white/80 leading-relaxed uppercase tracking-wider h-[80px]">
                        <motion.div 
                           initial={{ clipPath: "inset(0 100% 0 0)" }}
                           animate={{ clipPath: "inset(0 0% 0 0)" }}
                           transition={{ duration: 3, ease: "linear" }}
                        >
                           <span className="text-[#00E5FF]">&gt;</span> DETECTING ELEVATED RISK IN <span className="text-[#EF4444] font-bold">BENGALURU URBAN</span> (48H).
                           <br/><br/>
                           <span className="text-[#00E5FF]">&gt;</span> CROSS-REFERENCING MISSING PERSONS. 3 ANOMALIES FOUND.<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 h-3 ml-1 align-middle bg-[#00E5FF]" />
                        </motion.div>
                     </div>
                  </div>
               </div>

               {/* Holographic Rings */}
               <div className="flex gap-4 relative z-10 mt-auto">
                  {/* Threat Ring */}
                  <div className="flex-1 bg-gradient-to-t from-white/5 to-transparent border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.1)_0%,transparent_70%)]" />
                     <div className="relative w-20 h-20 flex items-center justify-center group mb-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-[2px] border-dashed border-[#EF4444]/30 opacity-70" />
                        <svg className="w-full h-full -rotate-90 absolute inset-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 100 100">
                           <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                           <motion.circle 
                              initial={{ strokeDashoffset: 251 }}
                              animate={{ strokeDashoffset: 251 - (85 / 100) * 251 }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                              cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="6" strokeDasharray="251" strokeLinecap="round" 
                           />
                        </svg>
                        <div className="text-center z-10">
                           <span className="block text-xl font-black text-white drop-shadow-[0_0_8px_#EF4444]">85</span>
                        </div>
                     </div>
                     <div className="text-[10px] text-[#EF4444] font-bold tracking-widest uppercase">ELEVATED</div>
                     <div className="text-[8px] text-white/40 tracking-widest uppercase mt-0.5">Threat Level</div>
                  </div>

                  {/* Confidence Ring */}
                  <div className="flex-1 bg-gradient-to-t from-white/5 to-transparent border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)]" />
                     <div className="relative w-20 h-20 flex items-center justify-center group mb-2">
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-[#8B5CF6]/30 opacity-70" />
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border border-dashed border-[#8B5CF6]/40 opacity-50" />
                        <svg className="w-full h-full -rotate-90 absolute inset-0 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" viewBox="0 0 100 100">
                           <circle cx="50" cy="50" r="32" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                           <motion.circle 
                              initial={{ strokeDashoffset: 201 }}
                              animate={{ strokeDashoffset: 201 - (94.8 / 100) * 201 }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                              cx="50" cy="50" r="32" fill="transparent" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="201" strokeLinecap="round" 
                           />
                        </svg>
                        <div className="text-center z-10">
                           <span className="block text-sm font-black text-white drop-shadow-[0_0_8px_#8B5CF6]">94%</span>
                        </div>
                     </div>
                     <div className="text-[10px] text-[#8B5CF6] font-bold tracking-widest uppercase">CONFIDENCE</div>
                     <div className="text-[8px] text-white/40 tracking-widest uppercase mt-0.5">Prediction</div>
                  </div>
               </div>
            </motion.div>
          </motion.div>

          <Card className="border border-white/10 bg-black/20 backdrop-blur-xl flex flex-col h-[350px] rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <CardHeader className="pb-3 border-b border-white/10 bg-white/5">
              <CardTitle className="flex items-center gap-2 text-white/90 font-bold"><ShieldAlert className="h-5 w-5 text-[#FF4500]" /> Live Alerts Feed</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
              <div className="space-y-3">
                {liveAlerts.length === 0 && <div className="py-8 text-white/40 text-sm text-center font-medium">Monitoring secure channels. No active alerts.</div>}
                {liveAlerts.map((a: any, i: number) => {
                  const isCritical = a.severity === 'critical';
                  const titleMatch = a.message?.match(/^(Murder|Terror|Gang Activity|Women Emergency|Kidnapping|Large Riots)/i);
                  const showPulse = isCritical || titleMatch;
                  
                  return (
                    <motion.div 
                      key={a.id || i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative p-4 rounded-xl border backdrop-blur-md transition-all ${
                        showPulse 
                          ? 'bg-[#FF4500]/10 border-[#FF4500]/50 shadow-[0_0_15px_rgba(255,69,0,0.2)]' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                       {/* Animated border pulse for critical */}
                       {showPulse && <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-[#FF4500]/50 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none" />}
                       
                       <div className="flex items-start justify-between gap-3 relative z-10">
                          <div className="flex-1">
                             <div className="flex items-center gap-2 mb-1">
                                {showPulse && <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4500] opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4500]"></span></span>}
                                <span className={`text-xs font-bold uppercase tracking-widest ${showPulse ? 'text-[#FF4500]' : 'text-white/50'}`}>
                                   {a.severity || "Alert"}
                                </span>
                             </div>
                             <p className={`text-sm font-medium leading-relaxed ${showPulse ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-white/80'}`}>
                                {a.message || a.msg || "Unknown Alert Data"}
                             </p>
                          </div>
                          <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold whitespace-nowrap pt-1">
                             {a.created_at ? new Date(a.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : (a.time || "Just now")}
                          </div>
                       </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row - Activity, Status & Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border border-white/10 bg-black/20 backdrop-blur-xl lg:col-span-1 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col h-[360px]">
          <CardHeader className="pb-3 border-b border-white/10 bg-white/5 shrink-0">
            <CardTitle className="flex items-center gap-2 text-white/90 font-bold"><Activity className="h-5 w-5 text-[#00F2FE]" /> Live Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/20">
            <div className="space-y-4">
              {[...recentFirs.map((f:any)=>({id:`fir-${f.id}`, type:'FIR Registered', time: f.reported_datetime, text:`FIR ${f.fir_no} filed`})), 
                ...liveAlerts.slice(0,3).map((a:any)=>({id:`alert-${a.id}`, type:'Alert Generated', time: a.created_at || a.time, text: a.message?.slice(0, 30)})),
                {id:'mock-1', type: 'Forecast Updated', time: new Date(Date.now() - 1000*60*5).toISOString(), text: 'Risk elevated in Mysuru'},
                {id:'mock-2', type: 'Report Generated', time: new Date(Date.now() - 1000*60*15).toISOString(), text: 'Weekly summary ready'}
               ].sort((a,b)=>new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0,10).map((act: any) => (
                <div key={act.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px_currentColor] border-2 border-[#0A101C] z-10 ${act.type.includes('Alert') ? 'text-[#FF4500] bg-[#FF4500]' : act.type.includes('FIR') ? 'text-[#00F2FE] bg-[#00F2FE]' : 'text-[#A855F7] bg-[#A855F7]'}`} />
                    <div className="w-px h-full bg-white/10 my-0.5" />
                  </div>
                  <div className="pb-4 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white/50 font-mono tracking-widest">{new Date(act.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      <span className={`text-[9px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${act.type.includes('Alert') ? 'text-[#FF4500]' : act.type.includes('FIR') ? 'text-[#00F2FE]' : 'text-[#A855F7]'}`}>{act.type}</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1 line-clamp-1 font-medium">{act.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-black/20 backdrop-blur-xl lg:col-span-1 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col h-[360px]">
          <CardHeader className="pb-3 border-b border-white/10 bg-white/5 shrink-0">
            <CardTitle className="flex items-center gap-2 text-white/90 font-bold"><ShieldAlert className="h-5 w-5 text-[#10B981]" /> System Status Panel</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
             <div className="space-y-2">
                {[
                  { name: "Database Engine", status: "Online", textClass: "text-[#10B981]", bgClass: "bg-[#10B981]/10", dotClass: "bg-[#10B981]", borderClass: "border-[#10B981]/30" },
                  { name: "AI Engine", status: "Online", textClass: "text-[#10B981]", bgClass: "bg-[#10B981]/10", dotClass: "bg-[#10B981]", borderClass: "border-[#10B981]/30" },
                  { name: "Forecast Engine", status: "Online", textClass: "text-[#10B981]", bgClass: "bg-[#10B981]/10", dotClass: "bg-[#10B981]", borderClass: "border-[#10B981]/30" },
                  { name: "API Gateway", status: "Online", textClass: "text-[#10B981]", bgClass: "bg-[#10B981]/10", dotClass: "bg-[#10B981]", borderClass: "border-[#10B981]/30" },
                  { name: "Reports Module", status: "Standby", textClass: "text-[#EAB308]", bgClass: "bg-[#EAB308]/10", dotClass: "bg-[#EAB308]", borderClass: "border-[#EAB308]/30" }
                ].map((sys) => (
                  <div key={sys.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                     <span className="text-sm text-white/80 font-medium tracking-wide">{sys.name}</span>
                     <Badge variant="neutral" className={`px-2 py-0.5 rounded font-bold tracking-widest text-[9px] uppercase shadow-inner ${sys.bgClass} ${sys.textClass} ${sys.borderClass}`}>
                        <span className="relative flex h-1.5 w-1.5 mr-1.5"><span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${sys.dotClass} opacity-75`}></span><span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${sys.dotClass}`}></span></span>
                        {sys.status}
                     </Badge>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="border border-white/10 bg-black/20 backdrop-blur-xl lg:col-span-1 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col h-[360px]">
          <CardHeader className="pb-3 border-b border-white/10 bg-white/5 shrink-0">
            <CardTitle className="flex items-center gap-2 text-white/90 font-bold"><Network className="h-5 w-5 text-[#EAB308]" /> District Risk Ranking</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/20">
             <div className="space-y-3">
               {summary?.district_risk?.map((d: any, i: number) => (
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     key={d.district_id || d.district} 
                     className="flex flex-col w-full p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-white/20 transition-all gap-3"
                  >
                     <div className="flex items-start gap-2 w-full">
                        <span className="text-white/40 font-mono font-bold w-4 text-xs shrink-0 mt-0.5">{i+1}</span>
                        <span className="text-white/90 font-medium tracking-wide text-sm flex-1 break-words">{d.district_name || d.district}</span>
                     </div>
                     <div className="flex items-center justify-between pl-6 w-full gap-4">
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest shrink-0">Risk: <span className="text-white font-black">{d.score}</span></span>
                        <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-white/10 overflow-hidden shadow-inner">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(d.score, 100)}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full ${d.severity === 'critical' ? 'bg-[#EF4444] shadow-[0_0_10px_#EF4444]' : d.severity === 'high' ? 'bg-[#FB923C] shadow-[0_0_10px_#FB923C]' : 'bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]'}`} 
                           />
                        </div>
                     </div>
                  </motion.div>
               ))}
             </div>
          </CardContent>
        </Card>

        {/* Intelligence Previews */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-white/10 bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-[#00F2FE]/50 transition-colors cursor-pointer" onClick={() => window.location.href='/forecast'}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center shrink-0 group-hover:bg-[#00F2FE]/20 transition-colors shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <TrendingUp className="h-6 w-6 text-[#00F2FE]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90 tracking-wide">Predictive Forecast</h3>
                <p className="text-[11px] text-white/50 mt-1 uppercase font-bold tracking-widest">30-day projection</p>
              </div>
              <ArrowUpRight className="h-5 w-5 ml-auto text-white/30 group-hover:text-[#00F2FE] transition-colors" />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-[#EAB308]/50 transition-colors cursor-pointer" onClick={() => window.location.href='/network'}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#EAB308]/10 border border-[#EAB308]/30 flex items-center justify-center shrink-0 group-hover:bg-[#EAB308]/20 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <Network className="h-6 w-6 text-[#EAB308]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90 tracking-wide">Criminal Network</h3>
                <p className="text-[11px] text-white/50 mt-1 uppercase font-bold tracking-widest">Suspect relations</p>
              </div>
              <ArrowUpRight className="h-5 w-5 ml-auto text-white/30 group-hover:text-[#EAB308] transition-colors" />
            </CardContent>
          </Card>

          <Card className="border border-white/10 bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:border-[#A855F7]/50 transition-colors cursor-pointer" onClick={() => window.location.href='/reports'}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center shrink-0 group-hover:bg-[#A855F7]/20 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <FileText className="h-6 w-6 text-[#A855F7]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white/90 tracking-wide">Intelligence Reports</h3>
                <p className="text-[11px] text-white/50 mt-1 uppercase font-bold tracking-widest">Statewide summary</p>
              </div>
              <ArrowUpRight className="h-5 w-5 ml-auto text-white/30 group-hover:text-[#A855F7] transition-colors" />
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}
