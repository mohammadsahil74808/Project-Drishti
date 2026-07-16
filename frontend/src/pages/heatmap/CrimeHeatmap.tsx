import { useState, useEffect, useMemo } from "react";
import { Layers, Filter, Crosshair, Maximize, Minus, Plus, Brain, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToastStore } from "@/store/toastStore";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { geoApi } from "@/api";
import type { SeverityLevel } from "@/types";

const severityColors: Record<SeverityLevel, string> = {
  low: "#10B981",    // success
  medium: "#F59E0B", // alert
  high: "#FB923C",   // orange
  critical: "#EF4444", // critical
};

const CRIME_TYPES = ["All Crime", "Theft", "Assault", "Vehicle", "Robbery"];
const TIME_WINDOWS = ["Last 24h", "Last 7d", "Last 30d"];

// Component to recenter map when selected hotspot changes
function MapController({ selected, zoomLevel = 12 }: { selected: any | null, zoomLevel?: number }) {
  const map = useMap();
  useEffect(() => {
     if (selected && selected.centroid?.lat && selected.centroid?.lng) {
       map.flyTo([selected.centroid.lat, selected.centroid.lng], zoomLevel, { duration: 1.5 });
     }
  }, [selected, map, zoomLevel]);
  return null;
}

// Custom controls interacting with map
function MapCustomControls() {
   const map = useMap();
   return (
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[400]">
         <motion.button whileHover={{ scale: 1.1, x: -5 }} onClick={() => map.zoomIn()} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <Plus className="w-5 h-5" />
         </motion.button>
         <motion.button whileHover={{ scale: 1.1, x: -5 }} onClick={() => map.zoomOut()} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <Minus className="w-5 h-5" />
         </motion.button>
         <div className="w-10 h-[1px] bg-white/10 my-1" />
         <motion.button whileHover={{ scale: 1.1, x: -5 }} onClick={() => map.flyTo([14.5, 76.0], 7, { duration: 2 })} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <Maximize className="w-4 h-4" />
         </motion.button>
         <motion.button whileHover={{ scale: 1.1, x: -5 }} className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-2">
            <Layers className="w-4 h-4" />
         </motion.button>
      </div>
   );
}

const isKarnataka = (lat: number, lng: number) => lat >= 11.0 && lat <= 19.0 && lng >= 74.0 && lng <= 78.6;

const createPulsingIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center w-5 h-5 group cursor-pointer">
        <div class="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping" style="background-color: ${color}"></div>
        <div class="relative inline-flex w-3 h-3 rounded-full border-[1.5px] border-white" style="background-color: ${color}; box-shadow: 0 0 15px ${color}"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export default function CrimeHeatmap() {
  const [district, setDistrict] = useState("");
  const [crimeType, setCrimeType] = useState(CRIME_TYPES[0]);
  const [window, setWindow] = useState(TIME_WINDOWS[1]);
  const [selected, setSelected] = useState<any | null>(null);
  const [showDensity, setShowDensity] = useState(true);
  const { addToast } = useToastStore();

  const { data: districtsData } = useQuery({ queryKey: ["districts"], queryFn: geoApi.getDistricts });
  const districts = (districtsData || []).filter((d: any) => !d.state || d.state.toLowerCase() === "karnataka");
  const selectedDistrictId = district;

  const { data: rawHotspots = [], isLoading } = useQuery({
    queryKey: ["geo-hotspots", selectedDistrictId],
    queryFn: () => geoApi.getHotspots(selectedDistrictId),
    refetchInterval: 30000,
  });

  const hotspots = useMemo(() => {
    return rawHotspots.filter((h: any) => h.centroid?.lat && h.centroid?.lng && isKarnataka(h.centroid.lat, h.centroid.lng));
  }, [rawHotspots]);

  return (
    <>
    <style>{`
      .custom-osm-dark {
        filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(120%) saturate(30%);
      }
    `}</style>
    <div className="min-h-[calc(100vh-6rem)] w-full flex flex-col px-4 pt-1 pb-4 space-y-4 relative overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10">
       {/* Background FX */}
       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-30 pointer-events-none z-0" />
       
       <div className="flex-1 w-full relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Main Map Container */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="lg:col-span-3 w-full h-[calc(100vh-6.5rem)] relative rounded-3xl border border-white/10 bg-[#050B14]/80 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group"
          >
             {/* Map Overlay Glows */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/10 via-transparent to-transparent pointer-events-none z-[400]" />
             <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none z-[400]" />

             {/* Live HUD (Top Left) */}
             <div className="absolute top-3 left-3 z-[450] flex flex-col gap-3">

                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-xl flex flex-wrap items-center gap-2">
                   <Filter className="h-3.5 w-3.5 text-[#8B5CF6] ml-2" />
                   <select value={selectedDistrictId} onChange={(e) => { setDistrict(e.target.value); setSelected(null); }} className="bg-transparent border-none text-[11px] font-bold text-white uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-0 [&>option]:bg-[#050B14]">
                      <option value="">All Karnataka</option>
                      {districts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                   </select>
                   <div className="w-[1px] h-3 bg-white/10 mx-1" />
                   <select value={crimeType} onChange={(e) => setCrimeType(e.target.value)} className="bg-transparent border-none text-[11px] font-bold text-[#00E5FF] uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-0 [&>option]:bg-[#050B14]">
                      {CRIME_TYPES.map(c => <option key={c}>{c}</option>)}
                   </select>
                   <div className="w-[1px] h-3 bg-white/10 mx-1" />
                   <select value={window} onChange={(e) => setWindow(e.target.value)} className="bg-transparent border-none text-[11px] font-bold text-[#8B5CF6] uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-0 [&>option]:bg-[#050B14]">
                      {TIME_WINDOWS.map(w => <option key={w}>{w}</option>)}
                   </select>
                   <div className="w-[1px] h-3 bg-white/10 mx-1" />
                   <button onClick={() => setShowDensity((s) => !s)} className="text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white px-2">
                     {showDensity ? "Density On" : "Density Off"}
                   </button>
                </div>
             </div>

             {/* Dynamic Floating Glass Popup for Selected Hotspot */}
             <AnimatePresence>
                {selected && (
                   <motion.div 
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute top-6 right-6 z-[500] w-80 bg-gradient-to-br from-[#050B14]/95 to-black/95 backdrop-blur-md border border-white/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
                   >
                      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: severityColors[selected.severity as SeverityLevel] || "#00E5FF" }} />
                      <div className="p-5 relative">
                         <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¢</button>
                         <div className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1 flex items-center gap-1.5"><Crosshair className="w-3 h-3"/> Target Hotspot</div>
                         <h3 className="text-lg font-black text-white leading-tight mb-4 pr-6">{selected.name || selected.id}</h3>
                         
                         <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                               <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Density Score</div>
                               <div className="text-base font-black text-[#00E5FF] mt-0.5">{selected.crime_density || 0}</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                               <div className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Severity</div>
                               <div className="text-base font-black uppercase mt-0.5" style={{ color: severityColors[selected.severity as SeverityLevel] }}>{selected.severity}</div>
                            </div>
                         </div>
                         
                         <div className="flex gap-2">
                            <button onClick={() => { addToast(`Compiling tactical report for ${selected.name || selected.district || 'Location'}...`, "info"); setTimeout(() => { globalThis.window.location.href = "/reports"; }, 1500); }} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-colors border border-white/5">Generate Report</button>
                            <button onClick={() => addToast(`ðŸš¨ Patrol Unit dispatched to ${selected.name || selected.district || 'Location'}. ETA: 4 mins.`, "warning")} className="flex-1 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-colors border border-[#00E5FF]/30">Dispatch Unit</button>
                         </div>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             {/* Floating Legend */}
             <div className="absolute bottom-3 right-3 z-[450] bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-xl flex items-center gap-4 hidden sm:flex">
                {Object.entries(severityColors).map(([level, color]) => (
                   <div key={level} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                      <span className="text-[9px] uppercase font-bold text-white/70 tracking-widest">{level}</span>
                   </div>
                ))}
             </div>

             {/* The Map */}
             {isLoading ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050B14]/80 backdrop-blur-sm">
                   <div className="w-12 h-12 rounded-full border-t-2 border-[#00E5FF] animate-spin mb-4" />
                   <span className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest animate-pulse">Initializing Geo-Spatial Matrix...</span>
                </div>
             ) : (
                <MapContainer center={[14.5, 76.0]} zoom={6.5} zoomSnap={0.5} style={{ height: "100%", width: "100%", backgroundColor: '#020617' }} zoomControl={false} scrollWheelZoom={false} attributionControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="custom-osm-dark" opacity={0.85} />
                  <MapCustomControls />
                  <MapController selected={selected} zoomLevel={14} />

                  {/* Hotspot Circles (Density) */}
                  {showDensity && hotspots.map((h: any) => (
                     <CircleMarker key={`density-${h.id}`} center={[h.centroid?.lat ?? 0, h.centroid?.lng ?? 0]} radius={(h.crime_density || 10) * 0.8} pathOptions={{ fillColor: severityColors[h.severity as SeverityLevel] || "#10B981", fillOpacity: 0.15, color: "transparent" }} />
                  ))}

                  {/* Hotspot Pulse Markers */}
                  {hotspots.map((h: any) => {
                     const color = severityColors[h.severity as SeverityLevel] || "#10B981";
                     return (
                        <Marker key={`point-${h.id}`} position={[h.centroid?.lat ?? 0, h.centroid?.lng ?? 0]} icon={createPulsingIcon(color)} eventHandlers={{ click: () => setSelected(h) }} />
                     )
                  })}
                </MapContainer>
             )}
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="lg:col-span-1 h-[calc(100vh-6.5rem)] flex flex-col gap-4"
          >
             <div className="flex-1 border border-white/10 bg-gradient-to-b from-[#050B14]/90 to-[#0A101C]/90 backdrop-blur-md rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8)] p-5 overflow-hidden relative flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/5 to-transparent pointer-events-none" />
                
                <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-white tracking-widest uppercase flex items-center gap-2 mb-4 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
                   <Brain className="h-4 w-4 text-[#8B5CF6]" /> Tactical Intelligence
                </h3>

                <div className="space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 flex-1">
                   {isLoading ? (
                      <div className="text-center text-white/30 text-xs py-10 font-mono uppercase tracking-widest">Scanning Sectors...</div>
                   ) : hotspots.length === 0 ? (
                      <div className="text-center text-white/30 text-xs py-10 font-mono uppercase tracking-widest">No Active Threats</div>
                   ) : hotspots.sort((a: any, b: any) => (b.crime_density || 0) - (a.crime_density || 0)).slice(0, 6).map((h: any, i: number) => {
                      const color = severityColors[h.severity as SeverityLevel] || "#10B981";
                      return (
                         <motion.div 
                            key={h.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => setSelected(h)}
                            className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-3 rounded-xl cursor-pointer transition-all group relative overflow-hidden"
                         >
                            <div className="absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5" style={{ backgroundColor: color }} />
                            <div className="flex justify-between items-start pl-2 gap-2">
                               <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-white tracking-wide truncate">{h.name || h.id}</div>
                                  <div className="text-[9px] uppercase tracking-widest text-white/40 mt-1 flex items-center gap-1"><Activity className="w-3 h-3 shrink-0"/> <span className="truncate">Density: {h.crime_density || 0}</span></div>
                               </div>
                               <div className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border" style={{ color: color, borderColor: color, backgroundColor: `${color}20` }}>
                                  {h.severity}
                               </div>
                            </div>
                         </motion.div>
                      )
                   })}
                </div>
             </div>
          </motion.div>
       </div>
    </div>
    </>
  );
}

