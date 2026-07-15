import { useState } from "react";
import { Bell, Check, MapPinned, TrendingUp, UserSearch, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { AlertItem, AlertType, SeverityLevel } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_ICON: Record<AlertType, typeof Bell> = {
  anomaly: AlertTriangle,
  forecast_spike: TrendingUp,
  new_hotspot: MapPinned,
  missing_person_match: UserSearch,
};

const TYPE_LABEL: Record<AlertType, string> = {
  anomaly: "Anomaly Detected",
  forecast_spike: "Forecast Spike",
  new_hotspot: "New Hotspot",
  missing_person_match: "Missing Person Match",
};

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "a1",
    type: "new_hotspot",
    message: "New hotspot formed near Majestic Bus Stand — crime density up 61% in 72h.",
    severity: "critical",
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: "a2",
    type: "anomaly",
    message: "Anomaly: burglary reports in Yelahanka up 40% vs 4-week average.",
    severity: "high",
    created_at: new Date(Date.now() - 48 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: "a3",
    type: "missing_person_match",
    message: "AI matched unidentified person report to missing-person case #MP-2291 (87% confidence).",
    severity: "medium",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: "a4",
    type: "forecast_spike",
    message: "Forecast: chain-snatching risk elevated in Indiranagar this weekend (festival + payday overlap).",
    severity: "medium",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    acknowledged: true,
  },
  {
    id: "a5",
    type: "anomaly",
    message: "Vehicle theft anomaly cleared in Electronic City — back within normal range.",
    severity: "low",
    created_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    acknowledged: true,
  },
];

const FILTERS: Array<{ label: string; value: SeverityLevel | "all" }> = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [filter, setFilter] = useState<SeverityLevel | "all">("all");

  const acknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const filtered = alerts.filter((a) => filter === "all" || a.severity === filter);
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-black/20 backdrop-blur-md border border-white/5 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Alerts</h1>
          <p className="text-sm text-sx-text-dim mt-1 font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span></span>
            Real-time telemetry — {unacknowledgedCount} unacknowledged
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-bold rounded-lg px-4 py-2 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                filter === f.value
                  ? "bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)] scale-105"
                  : "text-white/50 hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((alert) => {
            const Icon = TYPE_ICON[alert.type];
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={alert.acknowledged ? "opacity-50 hover:opacity-100 transition-opacity duration-300" : undefined}
              >
                <Card className="hover:border-white/20 transition-colors">
                  <CardContent className="flex items-start gap-5 py-5">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                        alert.severity === "critical"
                          ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                          : alert.severity === "high"
                          ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                          : alert.severity === "medium"
                          ? "bg-sx-alert/15 text-sx-alert border border-sx-alert/30"
                          : "bg-sx-success/15 text-sx-success border border-sx-success/30"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-sm font-bold text-white tracking-wide">
                          {TYPE_LABEL[alert.type]}
                        </p>
                        <Badge variant={alert.severity}>{alert.severity}</Badge>
                        {alert.acknowledged && <Badge variant="neutral" className="bg-white/5">Acknowledged</Badge>}
                      </div>
                      <p className="text-[13px] text-white/70 mt-1.5 leading-relaxed">{alert.message}</p>
                      <p className="text-[10px] text-white/40 mt-2 font-mono uppercase tracking-widest font-bold">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>

                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Check className="h-4 w-4" />}
                        onClick={() => acknowledge(alert.id)}
                        className="shrink-0 bg-white/5 border-white/10 text-white/70 hover:text-[#00E5FF] hover:border-[#00E5FF]/50"
                      >
                        Acknowledge
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-[#10B981]/30" />
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-4 rounded-full bg-[#10B981]/10 blur-xl" />
              <CheckCircle2 className="h-12 w-12 text-[#10B981] relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight mb-2">No Active Alerts</h3>
            <p className="text-sm text-white/50 max-w-sm mb-6 leading-relaxed">
              System telemetry is clear. All monitored sectors are operating within standard parameters.
            </p>
            <Button variant="outline" className="text-[#00E5FF] border-[#00E5FF]/30 hover:bg-[#00E5FF]/10" onClick={() => setFilter("all")}>
              View All History
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
