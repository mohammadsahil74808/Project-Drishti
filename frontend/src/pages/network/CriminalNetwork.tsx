import { useMemo, useState, useEffect } from "react";
import { 
  Share2, User, 
  Car, Phone, MapPin, Building, Briefcase, FileText,
  AlertTriangle, Crosshair, Fingerprint
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";
import { networkApi } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/toastStore";

// ---- TYPE HEURISTICS ---- //
const getNodeType = (label: string = "") => {
  const l = label.toLowerCase();
  if (l.match(/\b(ga?ng|cartel|syndicate|mafia)\b/)) return "Gang";
  if (l.match(/\b(ka-|mh-|dl-|rj-|ts-|tn-|up-)\d{1,2}\b/)) return "Vehicle";
  if (l.match(/\b\d{10}\b/) || l.includes("phone") || l.includes("mobile")) return "Phone";
  if (l.match(/\b(bank|account|tx-|transfer|wire)\b/)) return "Bank";
  if (l.match(/\b(st|street|nagar|road|cross|layout|block)\b/)) return "Location";
  if (l.match(/\b(insp|constable|psi|sp|dsp|officer)\b/)) return "Officer";
  if (l.match(/\b(fir|cr no|crime no)\b/)) return "FIR";
  return "Suspect";
};

const getTypeColor = (type: string, risk: number = 0) => {
  if (type === "Suspect") return risk >= 75 ? "#EF4444" : risk >= 50 ? "#F59E0B" : "#A855F7";
  if (type === "Gang") return "#FF0055";
  if (type === "Vehicle") return "#00E5FF";
  if (type === "Phone") return "#3B82F6";
  if (type === "Bank") return "#10B981";
  if (type === "Location") return "#F59E0B";
  if (type === "Officer") return "#6366F1";
  if (type === "FIR") return "#F43F5E";
  return "#00E5FF";
};

// SVG paths for ECharts symbols
const SVG_ICONS = {
  Suspect: "path://M12,12c2.21,0,4-1.79,4-4s-1.79-4-4-4S8,5.79,8,8S9.79,12,12,12z M12,14c-2.67,0-8,1.34-8,4v2h16v-2C20,15.34,14.67,14,12,14z",
  Gang: "path://M16,11c1.66,0,2.99-1.34,2.99-3S17.66,5,16,5s-3,1.34-3,3S14.34,11,16,11z M8,11c1.66,0,2.99-1.34,2.99-3S9.66,5,8,5S5,6.34,5,8S6.34,11,8,11z M8,13c-2.33,0-7,1.17-7,3.5V19h14v-2.5C15,14.17,10.33,13,8,13z M16,13c-0.29,0-0.62,0.02-0.97,0.05C16.28,13.93,17,14.83,17,16.5V19h7v-2.5C24,14.17,19.33,13,16,13z",
  Vehicle: "path://M18.92,6.01C18.72,5.42,18.16,5,17.5,5h-11C5.84,5,5.28,5.42,5.08,6.01L3,12v8c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1h12v1c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-8L18.92,6.01z M6.5,16C5.67,16,5,15.33,5,14.5S5.67,13,6.5,13S8,13.67,8,14.5S7.33,16,6.5,16z M17.5,16c-0.83,0-1.5-0.67-1.5-1.5S16.67,13,17.5,13S19,13.67,19,14.5S18.33,16,17.5,16z M5,11l1.5-4.5h11L19,11H5z",
  Phone: "path://M17,1.01L7,1C5.9,1,5,1.9,5,3v18c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V3C19,1.9,18.1,1.01,17,1.01z M12,21c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S12.55,21,12,21z M17,18H7V4h10V18z",
  Bank: "path://M4,10h3v7H4V10z M10.5,10h3v7h-3V10z M2,19h20v3H2V19z M17,10h3v7h-3V10z M12,1L2,6v2h20V6L12,1z",
  Location: "path://M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z M12,11.5c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,11.5,12,11.5z",
  Officer: "path://M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,11.99h7c-0.53,4.12-3.28,7.79-7,8.94V12H5V6.3l7-3.11V11.99z",
  FIR: "path://M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V8L14,2z M13,9V3.5L18.5,9H13z"
};

const getRelationColor = (relation: string = "") => {
  const r = relation.toLowerCase();
  if (r.includes("money") || r.includes("transfer")) return "#10B981";
  if (r.includes("family") || r.includes("relative")) return "#A855F7";
  if (r.includes("co-accused") || r.includes("accomplice")) return "#EF4444";
  if (r.includes("vehicle") || r.includes("drive")) return "#00E5FF";
  return "#64748B";
};

export default function CriminalNetwork() {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<string>("All");
  const { addToast } = useToastStore();
  const [flaggedNodes, setFlaggedNodes] = useState<Set<string>>(new Set());


  const { data, isLoading } = useQuery({
    queryKey: ["network-graph"],
    queryFn: () => networkApi.getGraph(),
    refetchInterval: 30000,
  });

  const allNodes = data?.nodes || [];
  const edges = data?.edges || [];

  const nodes = useMemo(() => {
    return allNodes.filter((n: any) => {
      const type = getNodeType(n.label);
      if (selectedType !== "All" && type !== selectedType) return false;
      return true;
    });
  }, [allNodes, selectedType]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(nodes.map((n:any) => n.id));
    return edges.filter((e:any) => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [edges, nodes]);

  useEffect(() => {
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[0]);
    } else if (nodes.length > 0 && selectedNode) {
       const stillExists = nodes.find((n:any) => n.id === selectedNode.id);
       if (!stillExists) setSelectedNode(nodes[0]);
    }
  }, [nodes, selectedNode]);

  const connectedEdges = selectedNode
    ? edges.filter((e: any) => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  const graphOptions = useMemo(() => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        show: true,
        trigger: "item",
        backgroundColor: "rgba(5, 11, 20, 0.95)",
        borderColor: "rgba(0, 229, 255, 0.3)",
        borderWidth: 1,
        padding: [12, 16],
        textStyle: { color: "#F8FAFC", fontFamily: "monospace", fontSize: 12 },
        formatter: (params: any) => {
          if (params.dataType === "edge") {
             const src = allNodes.find((n:any) => n.id === params.data.source)?.label || 'Unknown';
             const tgt = allNodes.find((n:any) => n.id === params.data.target)?.label || 'Unknown';
            return `<div class="uppercase tracking-widest text-[9px] text-[#00E5FF] mb-1">RELATIONSHIP</div>
                    <div class="font-bold text-white mb-2">${params.data.relation}</div>
                    <div class="text-white/60 text-xs">${src} ↔ ${tgt}</div>`;
          }
          const t = getNodeType(params.data.name);
          return `<div class="uppercase tracking-widest text-[9px] text-[${getTypeColor(t, params.data.riskScore)}] mb-1">${t}</div>
                  <div class="font-bold text-white mb-2">${params.data.name}</div>
                  <div class="flex items-center gap-4 text-xs">
                     <span class="text-white/60">Risk: <span class="text-white font-bold">${params.data.riskScore}</span></span>
                     <span class="text-white/60">Cases: <span class="text-white font-bold">${params.data.caseCount}</span></span>
                  </div>`;
        },
      },
      series: [
        {
          type: "graph",
          layout: "force",
          force: {
            repulsion: 800,
            edgeLength: [100, 250],
            gravity: 0.1,
            friction: 0.6,
            layoutAnimation: true,
          },
          roam: true,
          nodeScaleRatio: 0.6,
          draggable: true,
          label: {
            show: true,
            position: "bottom",
            color: "rgba(255,255,255,0.7)",
            fontSize: 10,
            fontFamily: "monospace",
            distance: 8,
            formatter: (p:any) => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
          },
          lineStyle: {
            width: 1.5,
            curveness: 0.2,
            opacity: 0.4
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
               width: 3,
               opacity: 1,
            },
          },
          data: nodes.map((n: any) => {
             const type = getNodeType(n.label);
             const isSelected = n.id === selectedNode?.id;
             const color = getTypeColor(type, n.risk_score || n.riskScore);
             return {
               id: n.id,
               name: n.label,
               symbol: SVG_ICONS[type as keyof typeof SVG_ICONS] || SVG_ICONS.Suspect,
               symbolSize: isSelected ? 40 : 25 + (n.case_count || n.caseCount || 0) * 1.5,
               itemStyle: {
                 color: color,
                 borderColor: isSelected ? "#FFF" : "rgba(255,255,255,0.8)",
                 borderWidth: isSelected ? 3 : 1,
                 opacity: isSelected ? 1 : 0.8
               },
               riskScore: n.risk_score || n.riskScore,
               caseCount: n.case_count || n.caseCount,
             };
          }),
          edges: filteredEdges.map((e: any) => {
             const color = getRelationColor(e.relation_type || e.relation);
             return {
               source: e.source,
               target: e.target,
               relation: e.relation_type || e.relation,
               lineStyle: {
                  color: color,
               }
             };
          }),
        },
      ],
    };
  }, [nodes, filteredEdges, selectedNode, allNodes]);

  const onEvents = {
    click: (params: any) => {
      if (params.dataType === "node") {
        const node = allNodes.find((n: any) => n.id === params.data.id);
        if (node) setSelectedNode(node);
      }
    },
  };

  const nodeTypeStats = useMemo(() => {
     const stats = { Suspect: 0, Gang: 0, Vehicle: 0, Phone: 0, Bank: 0, Location: 0, Officer: 0, FIR: 0 };
     allNodes.forEach((n:any) => {
        const t = getNodeType(n.label);
        if (t in stats) stats[t as keyof typeof stats]++;
     });
     return Object.entries(stats).filter(([_, count]) => count > 0);
  }, [allNodes]);

  return (
    <div className="flex-1 w-full relative bg-[#020617] overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
      {/* Deep Space Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiLz48L3N2Zz4=')] opacity-20" />
      </div>

      {/* CENTER PANEL: Full Screen Interactive Graph */}
      <div className="absolute inset-0 z-10 flex flex-col">
         {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
               <div className="relative w-20 h-20 flex items-center justify-center mb-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-[#00E5FF]/50" />
                  <Share2 className="h-5 w-5 text-[#00E5FF] animate-pulse" />
               </div>
               <p className="text-[10px] font-mono text-[#00E5FF] uppercase tracking-widest animate-pulse">Initializing Matrix...</p>
            </div>
         ) : (
            <ReactECharts
               option={graphOptions}
               onEvents={onEvents}
               style={{ height: "100%", width: "100%" }}
               opts={{ renderer: "canvas" }}
            />
         )}
      </div>

      {/* FLOATING OVERLAYS CONTAINER */}
      <div className="absolute inset-x-4 bottom-4 z-20 pointer-events-none flex items-end justify-between gap-4">
         
         {/* FLOATING LEFT CARD: Minimal Filters */}
         <div className="w-[200px] pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden">
            <div className="p-3 shrink-0 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between">
               <h1 className="text-[10px] font-black text-white tracking-widest uppercase">Matrix</h1>
               <div className="flex gap-2 text-[8px] font-mono text-white/50">
                  <span>N:{nodes.length}</span>
                  <span>L:{filteredEdges.length}</span>
               </div>
            </div>

            <div className="p-3 flex-1 overflow-y-auto scrollbar-none flex flex-col gap-1.5 max-h-[250px]">
               <button 
                  onClick={() => setSelectedType("All")}
                  className={`flex items-center gap-2 p-1.5 rounded border transition-all ${selectedType === "All" ? "bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]" : "bg-transparent border-transparent text-white/50 hover:bg-white/5"}`}
               >
                  <Share2 className="h-3 w-3 shrink-0" />
                  <span className="text-[9px] uppercase tracking-wider font-bold">All</span>
               </button>
               {nodeTypeStats.map(([type, count]) => {
                  const isSelected = selectedType === type;
                  const color = getTypeColor(type, 100);
                  let Icon = User;
                  if (type === 'Vehicle') Icon = Car;
                  if (type === 'Phone') Icon = Phone;
                  if (type === 'Location') Icon = MapPin;
                  if (type === 'Bank') Icon = Building;
                  if (type === 'Officer') Icon = Briefcase;
                  if (type === 'FIR') Icon = FileText;
                  if (type === 'Gang') Icon = Crosshair;

                  return (
                     <button 
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex items-center justify-between p-1.5 rounded border transition-all ${isSelected ? `bg-black/60 shadow-[0_0_5px_rgba(255,255,255,0.05)] border-white/20` : `bg-transparent border-transparent text-white/50 hover:bg-white/5`}`}
                     >
                        <div className="flex items-center gap-2">
                           <Icon className="h-3 w-3 shrink-0" style={{ color: isSelected ? color : 'currentColor' }} />
                           <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: isSelected ? '#FFF' : undefined }}>{type}</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/30">{count}</span>
                     </button>
                  );
               })}
            </div>
         </div>

         {/* FLOATING RIGHT CARD: Slim Entity Dossier */}
         <AnimatePresence>
            {selectedNode && (
               <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="w-[240px] max-h-[350px] pointer-events-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
               >
                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none p-3 space-y-3">
                     {/* Compact Header */}
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/5 to-black border border-white/10 flex items-center justify-center shrink-0">
                           <Fingerprint className="h-4 w-4 text-white/30" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <h2 className="text-[10px] font-black text-white truncate uppercase tracking-widest">{selectedNode.label}</h2>
                           <div className="flex items-center justify-between mt-1">
                              <span className="text-[7px] text-white/40 uppercase tracking-widest font-bold">ID: {selectedNode.id.split('-')[0]}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${
                                 (selectedNode.risk_score || selectedNode.riskScore) >= 75 ? "bg-[#EF4444]/20 text-[#EF4444]" :
                                 (selectedNode.risk_score || selectedNode.riskScore) >= 50 ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-[#10B981]/20 text-[#10B981]"
                              }`}>
                                 R-{(selectedNode.risk_score || selectedNode.riskScore)}
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* Minimal Stats Line */}
                     <div className="flex items-center justify-between bg-white/5 rounded border border-white/5 p-1.5">
                        <div className="text-center flex-1 border-r border-white/5">
                           <p className="text-[7px] text-white/40 uppercase tracking-widest font-bold">Cases</p>
                           <p className="text-[10px] font-black text-[#00E5FF]">{selectedNode.case_count || selectedNode.caseCount || 0}</p>
                        </div>
                        <div className="text-center flex-1">
                           <p className="text-[7px] text-white/40 uppercase tracking-widest font-bold">Centrality</p>
                           <p className="text-[10px] font-black text-[#8B5CF6]">{(selectedNode.centrality || 0).toFixed(2)}</p>
                        </div>
                     </div>

                     {/* Compact Connections List */}
                     <div>
                        <h3 className="text-[8px] uppercase tracking-widest font-bold text-white/30 flex items-center gap-1 mb-1 border-b border-white/5 pb-1">
                           <Share2 className="h-2 w-2" /> Links ({connectedEdges.length})
                        </h3>
                        <div className="space-y-1">
                           {connectedEdges.length === 0 && (
                              <div className="text-[8px] text-white/20 italic text-center py-1">No links.</div>
                           )}
                           {connectedEdges.map((e:any, i:number) => {
                              const otherId = e.source === selectedNode.id ? e.target : e.source;
                              const other = allNodes.find((n:any) => n.id === otherId);
                              if (!other) return null;
                              const type = getNodeType(other.label);
                              const color = getTypeColor(type, other.risk_score || other.riskScore);
                              return (
                                 <div key={i} className="flex items-center gap-1.5 p-1 bg-transparent hover:bg-white/5 rounded transition-colors group cursor-pointer" onClick={() => setSelectedNode(other)}>
                                    <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center shrink-0 bg-black/50" style={{ color: color }}>
                                       {type === 'Vehicle' ? <Car className="h-2 w-2" /> : type === 'Phone' ? <Phone className="h-2 w-2" /> : type === 'Bank' ? <Building className="h-2 w-2" /> : <User className="h-2 w-2" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                       <p className="text-[8px] font-bold text-white/70 truncate group-hover:text-white">{other.label}</p>
                                    </div>
                                    <div className="text-[6px] text-white/30 uppercase tracking-widest font-bold shrink-0">{e.relation_type || e.relation}</div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Tiny Action Buttons */}
                  <div className="shrink-0 p-2 bg-black/40 border-t border-white/5 flex gap-1.5">
                     <button onClick={() => { addToast(`Accessing classified dossier for ${selectedNode.id}...`, "info"); setTimeout(() => window.location.href="/reports", 1500); }} className="flex-1 flex items-center justify-center gap-1 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 py-1.5 rounded text-[7px] font-bold uppercase tracking-widest transition-all">
                        <FileText className="h-2 w-2" /> Dossier
                     </button>
                     <button onClick={() => { setFlaggedNodes(prev => { const n = new Set(prev); if (n.has(selectedNode.id)) { n.delete(selectedNode.id); addToast(`Removed flag from ${selectedNode.id}`, "info"); } else { n.add(selectedNode.id); addToast(`Subject ${selectedNode.id} flagged for priority surveillance.`, "warning"); } return n; }); }} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[7px] font-bold uppercase tracking-widest transition-all ${flaggedNodes.has(selectedNode.id) ? "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/50 shadow-[0_0_10px_#EF4444]" : "bg-transparent hover:bg-[#EF4444]/10 text-white/40 hover:text-[#EF4444] border border-white/10 hover:border-[#EF4444]/30"}`}>
                        <AlertTriangle className="h-2 w-2" /> {flaggedNodes.has(selectedNode.id) ? "Flagged" : "Flag"}
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}



