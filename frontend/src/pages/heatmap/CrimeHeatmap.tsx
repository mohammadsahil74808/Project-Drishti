/**
 * SentinelX AI — Crime Heatmap Page
 *
 * Geospatial view of crime density and hotspots rendered using React-Leaflet.
 * Uses CartoDB Dark Matter tiles to match the dark cyber-aesthetic.
 */
import { useState } from "react";
import { Layers, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { SeverityLevel } from "@/types";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface DummyHotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: SeverityLevel;
  crimeCount: number;
}

const HOTSPOTS: DummyHotspot[] = [
  { id: "h1", name: "Majestic Bus Stand", lat: 12.9779, lng: 77.5738, severity: "critical", crimeCount: 61 },
  { id: "h2", name: "Whitefield ITPL", lat: 12.9845, lng: 77.7366, severity: "high", crimeCount: 44 },
  { id: "h3", name: "Yelahanka New Town", lat: 13.1000, lng: 77.5963, severity: "high", crimeCount: 39 },
  { id: "h4", name: "Indiranagar 100ft Rd", lat: 12.9784, lng: 77.6408, severity: "medium", crimeCount: 27 },
  { id: "h5", name: "Electronic City", lat: 12.8399, lng: 77.6770, severity: "medium", crimeCount: 22 },
  { id: "h6", name: "Jayanagar 4th Block", lat: 12.9298, lng: 77.5824, severity: "low", crimeCount: 11 },
  { id: "h7", name: "Hebbal Flyover", lat: 13.0354, lng: 77.5988, severity: "high", crimeCount: 35 },
];

const severityColors: Record<SeverityLevel, string> = {
  low: "#10B981",    // sx-success
  medium: "#F59E0B", // sx-alert
  high: "#FB923C",   // orange-400
  critical: "#EF4444", // sx-critical
};

const severityDot: Record<SeverityLevel, string> = {
  low: "bg-[#10B981]",
  medium: "bg-[#F59E0B]",
  high: "bg-[#FB923C]",
  critical: "bg-[#EF4444]",
};

const DISTRICTS = ["All Districts", "Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi"];
const CRIME_TYPES = ["All Crime Types", "Theft", "Chain Snatching", "Burglary", "Assault", "Vehicle Theft", "Robbery"];
const TIME_WINDOWS = ["Last 24h", "Last 7 days", "Last 30 days", "Last 90 days"];

// Component to recenter map when selected hotspot changes
function MapController({ selected }: { selected: DummyHotspot | null }) {
  const map = useMap();
  if (selected) {
    map.flyTo([selected.lat, selected.lng], 14, { duration: 1.5 });
  }
  return null;
}

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
          <h1 className="text-xl font-semibold text-white sx-heading">Crime Heatmap</h1>
          <p className="text-sm text-sx-text-dim mt-1">
            Live spatial density and detected hotspots
          </p>
        </div>
        <Badge variant="info" dot>
          Live Feed
        </Badge>
      </div>

      {/* Filter bar */}
      <Card className="sx-panel-base border-none">
        <CardContent className="flex flex-wrap items-center gap-3 py-3.5">
          <Filter className="h-4 w-4 text-sx-accent shrink-0" />
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-sx-surface/60 border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {DISTRICTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            className="bg-sx-surface/60 border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {CRIME_TYPES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={window}
            onChange={(e) => setWindow(e.target.value)}
            className="bg-sx-surface/60 border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {TIME_WINDOWS.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>

          <button
            onClick={() => setShowDensity((s) => !s)}
            className="ml-auto flex items-center gap-2 rounded-lg border border-sx-border px-3 py-2 text-sm text-sx-text hover:text-white hover:bg-sx-accent/10 transition-colors"
          >
            <Layers className="h-4 w-4" />
            {showDensity ? "Density: On" : "Density: Off"}
          </button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Real Leaflet Map */}
        <Card className="xl:col-span-2 overflow-hidden sx-panel-base border-none shadow-glow">
          <CardHeader>
            <CardTitle>Spatial Overview — {district}</CardTitle>
            <CardDescription>{crimeType} · {window}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[480px] w-full bg-[#0A0E17]">
              <MapContainer 
                center={[12.9716, 77.5946]} 
                zoom={11} 
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                
                <MapController selected={selected} />

                {showDensity &&
                  HOTSPOTS.map((h) => (
                    <CircleMarker
                      key={`density-${h.id}`}
                      center={[h.lat, h.lng]}
                      radius={h.crimeCount / 2}
                      pathOptions={{
                        fillColor: severityColors[h.severity],
                        fillOpacity: 0.25,
                        color: "transparent",
                      }}
                    />
                  ))}

                {HOTSPOTS.map((h) => (
                  <CircleMarker
                    key={`point-${h.id}`}
                    center={[h.lat, h.lng]}
                    radius={6}
                    eventHandlers={{
                      click: () => setSelected(h),
                    }}
                    pathOptions={{
                      fillColor: severityColors[h.severity],
                      fillOpacity: 1,
                      color: "#fff",
                      weight: 2,
                    }}
                  >
                    <Popup className="text-black rounded-lg">
                      <div className="p-1">
                        <strong className="block text-sm mb-1">{h.name}</strong>
                        <div className="text-xs">Incidents: {h.crimeCount}</div>
                        <div className="text-xs uppercase tracking-wider font-bold mt-1" style={{color: severityColors[h.severity]}}>
                          {h.severity}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hotspot list */}
        <Card className="sx-panel-base border-none">
          <CardHeader>
            <CardTitle>Detected Hotspots</CardTitle>
            <CardDescription>{HOTSPOTS.length} active in view</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-sx-border/30 max-h-[420px] overflow-y-auto">
              {HOTSPOTS.sort((a, b) => b.crimeCount - a.crimeCount).map((h) => (
                <li
                  key={h.id}
                  onClick={() => setSelected(h)}
                  className={`px-5 py-4 cursor-pointer transition-all ${
                    selected?.id === h.id ? "bg-sx-accent/10 border-l-2 border-sx-accent" : "hover:bg-sx-surface/50 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-white font-medium">{h.name}</p>
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
