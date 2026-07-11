/**
 * SentinelX AI — Crime Heatmap Page
 *
 * Geospatial view of crime density and hotspots. Rendered here as a
 * lightweight SVG mock (dummy coordinates) so the page runs with zero
 * external config. Swap the <MockMap /> body for a Mapbox GL + Deck.gl
 * HeatmapLayer/HexagonLayer once VITE_MAPBOX_TOKEN is set — the filter
 * bar and hotspot list already match the real `/api/v1/geo/*` contract.
 */
import { useState } from "react";
import { Layers, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { SeverityLevel } from "@/types";

interface DummyHotspot {
  id: string;
  name: string;
  x: number; // percentage position within mock map
  y: number;
  severity: SeverityLevel;
  crimeCount: number;
}

const HOTSPOTS: DummyHotspot[] = [
  { id: "h1", name: "Majestic Bus Stand", x: 42, y: 38, severity: "critical", crimeCount: 61 },
  { id: "h2", name: "Whitefield ITPL", x: 78, y: 30, severity: "high", crimeCount: 44 },
  { id: "h3", name: "Yelahanka New Town", x: 40, y: 12, severity: "high", crimeCount: 39 },
  { id: "h4", name: "Indiranagar 100ft Rd", x: 60, y: 40, severity: "medium", crimeCount: 27 },
  { id: "h5", name: "Electronic City", x: 55, y: 82, severity: "medium", crimeCount: 22 },
  { id: "h6", name: "Jayanagar 4th Block", x: 38, y: 60, severity: "low", crimeCount: 11 },
  { id: "h7", name: "Hebbal Flyover", x: 46, y: 20, severity: "high", crimeCount: 35 },
];

const severityDot: Record<SeverityLevel, string> = {
  low: "bg-sx-success",
  medium: "bg-sx-alert",
  high: "bg-orange-400",
  critical: "bg-sx-critical",
};

const DISTRICTS = ["All Districts", "Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi"];
const CRIME_TYPES = ["All Crime Types", "Theft", "Chain Snatching", "Burglary", "Assault", "Vehicle Theft", "Robbery"];
const TIME_WINDOWS = ["Last 24h", "Last 7 days", "Last 30 days", "Last 90 days"];

export default function CrimeHeatmap() {
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [crimeType, setCrimeType] = useState(CRIME_TYPES[0]);
  const [window, setWindow] = useState(TIME_WINDOWS[1]);
  const [selected, setSelected] = useState<DummyHotspot | null>(null);
  const [showDensity, setShowDensity] = useState(true);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Crime Heatmap</h1>
          <p className="text-sm text-sx-text-dim mt-1">
            Live spatial density and detected hotspots
          </p>
        </div>
        <Badge variant="info" dot>
          Demo data
        </Badge>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-3.5">
          <Filter className="h-4 w-4 text-sx-text-faint shrink-0" />
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
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            className="bg-sx-panel border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {CRIME_TYPES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value)}
            className="bg-sx-panel border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {TIME_WINDOWS.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>

          <button
            onClick={() => setShowDensity((s) => !s)}
            className="ml-auto flex items-center gap-2 rounded-lg border border-sx-border px-3 py-2 text-sm text-sx-text-dim hover:text-white hover:bg-sx-panel-light transition-colors"
          >
            <Layers className="h-4 w-4" />
            {showDensity ? "Density: On" : "Density: Off"}
          </button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Mock map */}
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle>Spatial Overview — {district}</CardTitle>
            <CardDescription>{crimeType} · {window}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[480px] bg-[#0A0E17] overflow-hidden">
              {/* grid backdrop */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {showDensity &&
                HOTSPOTS.map((h) => (
                  <div
                    key={`glow-${h.id}`}
                    className="absolute rounded-full blur-2xl pointer-events-none"
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      width: `${h.crimeCount * 3}px`,
                      height: `${h.crimeCount * 3}px`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor:
                        h.severity === "critical"
                          ? "rgba(239,68,68,0.35)"
                          : h.severity === "high"
                          ? "rgba(251,146,60,0.3)"
                          : h.severity === "medium"
                          ? "rgba(245,158,11,0.25)"
                          : "rgba(16,185,129,0.2)",
                    }}
                  />
                ))}

              {HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelected(h)}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  title={h.name}
                >
                  <span
                    className={`block h-3 w-3 rounded-full ${severityDot[h.severity]} ring-4 ring-white/10 group-hover:ring-white/30 transition-all`}
                  />
                </button>
              ))}

              <div className="absolute bottom-3 left-3 text-[11px] text-sx-text-faint bg-sx-panel/80 backdrop-blur px-2.5 py-1.5 rounded-md border border-sx-border">
                Mock spatial view — Mapbox GL + Deck.gl HeatmapLayer wires in here
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hotspot list */}
        <Card>
          <CardHeader>
            <CardTitle>Detected Hotspots</CardTitle>
            <CardDescription>{HOTSPOTS.length} active in view</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-sx-border max-h-[420px] overflow-y-auto">
              {HOTSPOTS.sort((a, b) => b.crimeCount - a.crimeCount).map((h) => (
                <li
                  key={h.id}
                  onClick={() => setSelected(h)}
                  className={`px-5 py-3 cursor-pointer transition-colors ${
                    selected?.id === h.id ? "bg-sx-panel-light" : "hover:bg-sx-panel-light/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-sx-text font-medium">{h.name}</p>
                    <Badge variant={h.severity}>{h.severity}</Badge>
                  </div>
                  <p className="text-xs text-sx-text-dim mt-1">{h.crimeCount} incidents · 30d</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
