/**
 * SentinelX AI — Top Navbar
 * Global search, AI Assistant quick-toggle, alert bell, and user session menu.
 * Sits above the routed page content inside DashboardLayout.
 */
import { useState } from "react";
import { Search, Bell, Bot, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";

const ROLE_LABELS: Record<string, string> = {
  constable: "Constable",
  sho: "Station House Officer",
  sp: "Superintendent of Police",
  commissioner: "Commissioner",
  analyst: "Analyst",
};

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleAssistant = useUIStore((s) => s.toggleAssistant);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 border-b border-sx-border bg-sx-panel backdrop-blur-md px-4 flex items-center justify-between gap-4 shadow-sm z-10">
      {/* Global search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-faint" />
        <input
          type="text"
          placeholder="Search FIRs, suspects, locations…"
          className="w-full bg-sx-surface/50 border border-sx-border rounded-lg pl-9 pr-3 py-2 text-sm text-sx-text placeholder:text-sx-text-faint focus:outline-none focus:ring-1 focus:ring-sx-accent focus:border-sx-accent focus:shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleAssistant}
          className="flex items-center gap-2 rounded-lg p-2 text-sx-text-dim hover:text-white hover:bg-sx-panel-light transition-colors"
          title="AI Assistant"
        >
          <Bot className="h-[18px] w-[18px]" />
        </button>

        <button
          className="relative rounded-lg p-2 text-sx-text-dim hover:text-white hover:bg-sx-panel-light transition-colors"
          title="Alerts"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-sx-critical text-[10px] font-bold flex items-center justify-center text-white">
            3
          </span>
        </button>

        {/* User session menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg pl-2 pr-3 py-1.5 hover:bg-sx-panel-light transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-sx-accent/20 border border-sx-accent/40 flex items-center justify-center text-sx-accent text-xs font-semibold shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() ?? "SX"}
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-white">
                {user?.name ?? "Guest Officer"}
              </span>
              <span className="text-[11px] text-sx-text-dim">
                {user ? ROLE_LABELS[user.role] : "Not signed in"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-sx-text-faint" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-lg border border-sx-border bg-sx-panel shadow-panel py-1 z-50">
              <div className="px-3 py-2 border-b border-sx-border">
                <p className="text-[11px] text-sx-text-faint">Badge No.</p>
                <p className="text-sm text-sx-text">{user?.badgeNo ?? "—"}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sx-critical hover:bg-sx-panel-light transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
