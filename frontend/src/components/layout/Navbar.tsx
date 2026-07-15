import { useState, useEffect, useMemo } from "react";
import { Search, Bell, Bot, LogOut, ChevronDown, Command, Shield, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { alertsApi, firApi, reportsApi } from "@/api";
import { formatDistanceToNow, format } from "date-fns";

const ROLE_LABELS: Record<string, string> = {
  constable: "Constable",
  sho: "Station House Officer",
  sp: "Superintendent of Police",
  commissioner: "Commissioner",
  analyst: "Intelligence Analyst",
};

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleAssistant = useUIStore((s) => s.toggleAssistant);
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: alertsApi.getAlerts, refetchInterval: 30000 });
  const { data: firsData } = useQuery({ queryKey: ["firs-recent"], queryFn: () => firApi.getFirs({ page_size: 5 }), refetchInterval: 30000 });
  const { data: reports = [] } = useQuery({ queryKey: ["reports"], queryFn: reportsApi.getReports, refetchInterval: 30000 });

  const notifications = useMemo(() => {
    const items: any[] = [];
    alerts.slice(0, 5).forEach((a: any) => {
      items.push({ id: `alert-${a.id}`, type: "alert", title: "New Alert", desc: a.message || a.msg, time: a.created_at || new Date().toISOString(), severity: a.severity });
    });
    (firsData?.items || []).forEach((f: any) => {
      items.push({ id: `fir-${f.id}`, type: "fir", title: "FIR Registered", desc: `FIR ${f.fir_no} registered for ${f.crime_type}`, time: f.reported_datetime || f.created_at || new Date().toISOString() });
    });
    reports.slice(0, 3).forEach((r: any) => {
      items.push({ id: `report-${r.id}`, type: "report", title: "Report Status", desc: `Report ${r.title} is ${r.status}`, time: r.created_at });
    });
    return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);
  }, [alerts, firsData, reports]);

  const unreadCount = alerts.filter((a: any) => a.severity === 'critical' || a.severity === 'high').length;

  return (
    <header className="h-20 shrink-0 bg-[#050B14]/60 backdrop-blur-3xl rounded-3xl border border-white/10 px-6 flex items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.02)] z-30 relative">
      {/* Top Gloss */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

      {/* Global Search */}
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/20 to-transparent blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative flex items-center bg-black/40 border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all duration-300">
           <Search className="absolute left-4 h-5 w-5 text-white/40 group-focus-within:text-[#00E5FF] transition-colors" />
           <input
             type="text"
             placeholder="Search FIRs, Suspects, Intelligence..."
             className="w-full bg-transparent pl-12 pr-16 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none tracking-wide"
           />
           <div className="absolute right-3 flex items-center gap-1 opacity-50">
             <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-[10px] font-medium text-white border border-white/10">
               <Command className="h-3 w-3" /> K
             </kbd>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        
        {/* Time and Date */}
        <div className="hidden lg:flex flex-col items-end mr-2 pr-4 border-r border-white/10">
           <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-rajdhani text-lg font-bold tracking-wider">{format(time, "HH:mm:ss")}</span>
           </div>
           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B5CF6]">IST · {format(time, "dd MMM yyyy")}</span>
        </div>

        {/* Live Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mr-2">
           <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
           <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Link</span>
        </div>

        <button
          onClick={toggleAssistant}
          className="relative group p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 transition-all duration-300 shadow-lg"
          title="SentinelX AI Core"
        >
          <Bot className="h-5 w-5 text-white/70 group-hover:text-[#00E5FF] transition-colors" />
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(isMenuOpen === 'notifications' ? null : 'notifications')}
            className={`relative p-3 rounded-2xl border transition-all duration-300 shadow-lg ${isMenuOpen === 'notifications' ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 text-[#00E5FF]' : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20'}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 h-5 w-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-[10px] font-bold flex items-center justify-center text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-white/20">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {isMenuOpen === 'notifications' && (
            <div className="absolute right-0 mt-4 w-96 rounded-3xl border border-white/10 bg-[#050B14]/90 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] py-3 z-50 flex flex-col max-h-[500px] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center shrink-0">
                <span className="font-bold text-white tracking-wide">Command Alerts</span>
                <span className="text-[10px] text-[#00E5FF] uppercase tracking-widest font-bold cursor-pointer hover:text-white transition-colors">Mark Read</span>
              </div>
              <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10">
                {notifications.length === 0 && (
                  <div className="p-8 text-center text-white/40 text-sm">All systems nominal</div>
                )}
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors cursor-pointer group">
                    <div className="flex gap-4">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_currentColor] ${
                        n.severity === 'critical' ? 'text-red-500 bg-red-500' :
                        n.severity === 'high' ? 'text-orange-500 bg-orange-500' :
                        n.type === 'fir' ? 'text-[#00E5FF] bg-[#00E5FF]' :
                        n.type === 'report' ? 'text-[#8B5CF6] bg-[#8B5CF6]' : 'text-white/40 bg-white/40'
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#00E5FF] transition-colors">{n.title}</p>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">{n.desc}</p>
                        <p className="text-[10px] text-white/40 mt-2 font-mono uppercase tracking-wider">
                          {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Session Menu */}
        <div className="relative ml-2">
          <button
            onClick={() => setIsMenuOpen(isMenuOpen === 'user' ? null : 'user')}
            className={`flex items-center gap-3 p-1.5 pr-4 rounded-full border transition-all duration-300 shadow-lg ${isMenuOpen === 'user' ? 'bg-white/10 border-white/30' : 'bg-black/40 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 border border-[#00E5FF]/30 flex items-center justify-center text-white font-bold shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              {user?.name?.slice(0, 2).toUpperCase() ?? "OP"}
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-sm font-bold text-white tracking-wide">
                {user?.name ?? "Guest Operator"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF]">
                {user ? ROLE_LABELS[user.role] : "Unverified"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-white/40 ml-1" />
          </button>

          {isMenuOpen === 'user' && (
            <div className="absolute right-0 mt-4 w-64 rounded-3xl border border-white/10 bg-[#050B14]/90 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] py-2 z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Clearance Level</p>
                <div className="flex items-center gap-2">
                   <Shield className="w-4 h-4 text-[#8B5CF6]" />
                   <p className="text-sm font-bold text-white tracking-wide">{user?.badge_no ?? "Restricted"}</p>
                </div>
              </div>
              <div className="p-2">
                 <button
                   onClick={logout}
                   className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-2xl transition-colors group"
                 >
                   Sign out Session
                   <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
