import { useState } from "react";
import { Layers, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { SeverityLevel } from "@/types";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { geoApi } from "@/api";

const severityColors: Record<SeverityLevel, string> = {
  low: "#10B981",    // sx-success
  medium: "#F59E0B", // sx-alert
  high: "#FB923C",   // orange-400
  critical: "#EF4444", // sx-critical
};

const CRIME_TYPES = ["All Crime Types", "Theft", "Chain Snatching", "Burglary", "Assault", "Vehicle Theft", "Robbery"];
const TIME_WINDOWS = ["Last 24h", "Last 7 days", "Last 30 days", "Last 90 days"];

// Component to recenter map when selected hotspot changes
function MapController({ selected }: { selected: any | null }) {
  const map = useMap();
  if (selected && selected.latitude && selected.longitude) {
    map.flyTo([selected.latitude, selected.longitude], 14, { duration: 1.5 });
  }
  return null;
}

export default function CrimeHeatmap() {
  const [district, setDistrict] = useState("");
  const [crimeType, setCrimeType] = useState(CRIME_TYPES[0]);
  const [window, setWindow] = useState(TIME_WINDOWS[1]);
  const [selected, setSelected] = useState<any | null>(null);
  const [showDensity, setShowDensity] = useState(true);

  const { data: districtsData } = useQuery({
    queryKey: ["districts"],
    queryFn: geoApi.getDistricts,
  });

  const districts = districtsData || [];
  const selectedDistrictId = district || (districts.length > 0 ? districts[0].id : "");

  // Note: the backend geo endpoint returns HotspotResponse schema
  // { id, district_id, latitude, longitude, severity, radius, crime_count, ... }
  const { data: hotspots = [], isLoading } = useQuery({
    queryKey: ["geo-hotspots", selectedDistrictId],
    queryFn: () => geoApi.getHotspots(selectedDistrictId),
    enabled: !!selectedDistrictId,
  });

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
            value={selectedDistrictId}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-sx-surface/60 border border-sx-border rounded-lg text-sm text-sx-text px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sx-accent"
          >
            {districts.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
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
            <CardTitle>Spatial Overview</CardTitle>
            <CardDescription>{crimeType} · {window}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[480px] w-full bg-[#0A0E17]">
              {isLoading ? (
                 <div className="absolute inset-0 z-10 flex items-center justify-center text-sx-text-dim">Loading Map Data...</div>
              ) : (
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
                    hotspots.map((h: any) => (
                      <CircleMarker
                        key={`density-${h.id}`}
                        center={[h.latitude, h.longitude]}
                        radius={(h.crime_count || 10) / 2}
                        pathOptions={{
                          fillColor: severityColors[h.severity as SeverityLevel] || "#10B981",
                          fillOpacity: 0.25,
                          color: "transparent",
                        }}
                      />
                    ))}

                  {hotspots.map((h: any) => (
                    <CircleMarker
                      key={`point-${h.id}`}
                      center={[h.latitude, h.longitude]}
                      radius={6}
                      eventHandlers={{
                        click: () => setSelected(h),
                      }}
                      pathOptions={{
                        fillColor: severityColors[h.severity as SeverityLevel] || "#10B981",
                        fillOpacity: 1,
                        color: "#fff",
                        weight: 2,
                      }}
                    >
                      <Popup className="text-black rounded-lg">
                        <div className="p-1">
                          <strong className="block text-sm mb-1">{h.id}</strong>
                          <div className="text-xs">Incidents: {h.crime_count || 0}</div>
                          <div className="text-xs uppercase tracking-wider font-bold mt-1" style={{color: severityColors[h.severity as SeverityLevel]}}>
                            {h.severity}
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hotspot list */}
        <Card className="sx-panel-base border-none">
          <CardHeader>
            <CardTitle>Detected Hotspots</CardTitle>
            <CardDescription>{hotspots.length} active in view</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
               <div className="p-5 text-center text-sx-text-dim">Loading hotspots...</div>
            ) : hotspots.length === 0 ? (
               <div className="p-5 text-center text-sx-text-dim">No hotspots found</div>
            ) : (
              <ul className="divide-y divide-sx-border/30 max-h-[420px] overflow-y-auto">
                {hotspots.sort((a: any, b: any) => (b.crime_count || 0) - (a.crime_count || 0)).map((h: any) => (
                  <li
                    key={h.id}
                    onClick={() => setSelected(h)}
                    className={`px-5 py-4 cursor-pointer transition-all ${
                      selected?.id === h.id ? "bg-sx-accent/10 border-l-2 border-sx-accent" : "hover:bg-sx-surface/50 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-white font-medium truncate max-w-[150px]">{h.id}</p>
                      <Badge variant={h.severity}>{h.severity}</Badge>
                    </div>
                    <p className="text-xs text-sx-text-dim mt-1">{h.crime_count || 0} incidents · 30d</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
