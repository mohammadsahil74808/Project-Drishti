/**
 * SentinelX AI — Alerts Page
 *
 * Role-targeted alert feed (anomalies, forecast spikes, new hotspots,
 * missing-person matches). Acknowledge action is local state for now —
 * wire to POST /api/v1/alerts/{id}/acknowledge once the backend is live.
 */
import { useState } from "react";
import { Bell, Check, MapPinned, TrendingUp, UserSearch, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { AlertItem, AlertType, SeverityLevel } from "@/types";

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
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: "a2",
    type: "anomaly",
    message: "Anomaly: burglary reports in Yelahanka up 40% vs 4-week average.",
    severity: "high",
    createdAt: new Date(Date.now() - 48 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: "a3",
    type: "missing_person_match",
    message: "AI matched unidentified person report to missing-person case #MP-2291 (87% confidence).",
    severity: "medium",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: "a4",
    type: "forecast_spike",
    message: "Forecast: chain-snatching risk elevated in Indiranagar this weekend (festival + payday overlap).",
    severity: "medium",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    acknowledged: true,
  },
  {
    id: "a5",
    type: "anomaly",
    message: "Vehicle theft anomaly cleared in Electronic City — back within normal range.",
    severity: "low",
    createdAt: new Date(Date.now() - 9 * 3600000).toISOString(),
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
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Alerts</h1>
          <p className="text-sm text-sx-text-dim mt-1">
            Real-time system alerts — {unacknowledgedCount} unacknowledged
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
                filter === f.value
                  ? "bg-sx-accent/15 text-sx-accent border-sx-accent/40"
                  : "text-sx-text-dim border-sx-border hover:text-white hover:bg-sx-panel-light"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => {
          const Icon = TYPE_ICON[alert.type];
          return (
            <Card
              key={alert.id}
              className={alert.acknowledged ? "opacity-60" : undefined}
            >
              <CardContent className="flex items-start gap-4 py-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.severity === "critical"
                      ? "bg-sx-critical/15 text-sx-critical"
                      : alert.severity === "high"
                      ? "bg-orange-500/15 text-orange-400"
                      : alert.severity === "medium"
                      ? "bg-sx-alert/15 text-sx-alert"
                      : "bg-sx-success/15 text-sx-success"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">
                      {TYPE_LABEL[alert.type]}
                    </p>
                    <Badge variant={alert.severity}>{alert.severity}</Badge>
                    {alert.acknowledged && <Badge variant="neutral">Acknowledged</Badge>}
                  </div>
                  <p className="text-sm text-sx-text-dim mt-1">{alert.message}</p>
                  <p className="text-[11px] text-sx-text-faint mt-1.5">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>

                {!alert.acknowledged && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Check className="h-3.5 w-3.5" />}
                    onClick={() => acknowledge(alert.id)}
                    className="shrink-0"
                  >
                    Acknowledge
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-sx-text-dim">
              No alerts match this filter.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
