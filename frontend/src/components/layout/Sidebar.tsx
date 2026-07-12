/**
 * SentinelX AI — Sidebar
 * Primary navigation for the command dashboard. Collapsible; active route
 * is highlighted via NavLink. Nav targets reference ROUTES from the router
 * so paths are never hardcoded in two places.
 */
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

const NAV_ITEMS = [
  { label: "Dashboard", to: ROUTES.DASHBOARD, icon: LayoutDashboard, end: true },
  { label: "Crime Heatmap", to: ROUTES.HEATMAP, icon: Map, end: false },
  { label: "Crime Analytics", to: ROUTES.ANALYTICS, icon: BarChart3, end: false },
  { label: "AI Assistant", to: ROUTES.ASSISTANT, icon: Bot, end: false },
  { label: "Criminal Network", to: ROUTES.NETWORK, icon: Share2, end: false },
  { label: "Forecast", to: ROUTES.FORECAST, icon: TrendingUp, end: false },
  { label: "Reports", to: ROUTES.REPORTS, icon: FileText, end: false },
  { label: "Alerts", to: ROUTES.ALERTS, icon: Bell, end: false },
  { label: "Settings", to: ROUTES.SETTINGS, icon: Settings, end: false },
];

export default function Sidebar() {
  const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <aside
      className={clsx(
        "h-screen shrink-0 flex flex-col bg-sx-panel backdrop-blur-md border-r border-sx-border transition-all duration-200",
        isSidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sx-border shrink-0 overflow-hidden shadow-glow-dim">
        <ShieldAlert className="h-6 w-6 text-sx-accent shrink-0 drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
        {!isSidebarCollapsed && (
          <span className="text-white tracking-widest whitespace-nowrap sx-heading text-lg">
            Sentinel<span className="text-sx-accent drop-shadow-[0_0_8px_rgba(0,242,254,0.8)]">X</span> AI
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={isSidebarCollapsed ? label : undefined}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sx-accent/15 text-sx-accent"
                  : "text-sx-text-dim hover:bg-sx-panel-light hover:text-sx-text"
              )
            }
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center gap-2 h-12 border-t border-sx-border text-sx-text-dim hover:text-white hover:bg-sx-panel-light transition-colors shrink-0"
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-xs">Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}
