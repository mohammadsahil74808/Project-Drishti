import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Bot,
  Share2,
  TrendingUp,
  FileText,
  Bell,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { useUIStore } from "@/store/uiStore";
import { ROUTES } from "@/router/routes";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard, end: true },
  { label: "Crime Map", to: ROUTES.HEATMAP, icon: Map, end: false },
  { label: "Analytics", to: ROUTES.ANALYTICS, icon: BarChart3, end: false },
  { label: "AI Assistant", to: ROUTES.ASSISTANT, icon: Bot, end: false },
  { label: "Connections", to: ROUTES.NETWORK, icon: Share2, end: false },
  { label: "Forecast", to: ROUTES.FORECAST, icon: TrendingUp, end: false },
  { label: "Reports", to: ROUTES.REPORTS, icon: FileText, end: false },
  { label: "Alerts", to: ROUTES.ALERTS, icon: Bell, end: false },
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings, end: false },
];

export default function Sidebar() {
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 240 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full shrink-0 flex flex-col bg-[#050B14]/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.02)] relative z-20 group/sidebar"
    >
      {/* Glossy Top Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

      <div className="flex items-center gap-3 px-6 h-24 shrink-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/5 to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 border border-[#00E5FF]/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
           <ShieldAlert className="h-5 w-5 text-[#00E5FF]" />
        </div>
        {!isSidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-white font-black tracking-widest text-lg font-rajdhani uppercase">
              Sentinel<span className="text-[#00E5FF]">X</span>
            </span>
            <span className="text-[9px] text-[#8B5CF6] font-bold uppercase tracking-[0.2em]">Command Engine</span>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-2 scrollbar-none">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={isSidebarCollapsed ? label : undefined}
            className={({ isActive }) =>
              clsx(
                "group relative flex items-center gap-4 rounded-2xl px-3 py-3 font-medium transition-all duration-300 overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-[#00E5FF]/10 to-transparent text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#00E5FF] rounded-r-full shadow-[0_0_10px_#00E5FF]" 
                  />
                )}

                {/* Icon Container */}
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 z-10",
                  isActive 
                    ? "bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]" 
                    : "bg-black/20 border border-white/5 group-hover:border-white/20 group-hover:bg-white/10"
                )}>
                  <Icon className="h-5 w-5" />
                </div>

                {!isSidebarCollapsed && (
                  <span className="text-sm truncate font-medium z-10 tracking-wide">{label}</span>
                )}
                
                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-white/0 group-hover:via-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="mx-4 mb-6 mt-2 h-12 rounded-xl border border-white/10 bg-black/40 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-3 transition-all duration-300 group overflow-hidden relative shrink-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-wider uppercase">Collapse</span>
          </>
        )}
      </button>
    </motion.aside>
  );
}
