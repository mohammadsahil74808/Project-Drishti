import React, { useState, useMemo, type FormEvent } from "react";
import { 
  FileText, Download, CheckCircle2, XCircle, Loader2, Plus, Search, 
  Filter, Calendar, MapPin, BarChart2, Activity, Printer, FileSpreadsheet, 
  Eye, ChevronRight, HardDriveDownload, Archive, Layers, Shield, Cpu, 
  RefreshCcw, Clock, AlertCircle, X, DownloadCloud
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { reportsApi, geoApi } from "@/api";
import { useToastStore } from "@/store/toastStore";
import type { ReportType } from "@/types";
import { format } from "date-fns";

const REPORT_TYPES: Array<{ value: ReportType; label: string, icon: React.ElementType, desc: string }> = [
  { value: "weekly", label: "Weekly District Summary", icon: Calendar, desc: "Aggregate 7-day tactical review" },
  { value: "hotspot", label: "Hotspot Assessment", icon: MapPin, desc: "Geo-spatial risk concentration" },
  { value: "case", label: "Case File Intelligence", icon: Archive, desc: "Deep dive dossier generation" },
];

export default function Reports() {
  const queryClient = useQueryClient();
  
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  
  // Form State
  const [formType, setFormType] = useState<ReportType>("weekly");
  const [formDistrict, setFormDistrict] = useState("");
  
  // Toast State
  const [toast, setToast] = useState<{show: boolean, msg: string, type: 'info'|'success'|'error'}>({show: false, msg: '', type: 'info'});

  const showToast = (msg: string, type: 'info'|'success'|'error' = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // Queries
  const { data: districtsData } = useQuery({ queryKey: ["districts"], queryFn: geoApi.getDistricts });
  const districts = useMemo(() => districtsData || [], [districtsData]);
  
  const selectedDistrictId = formDistrict || (districts.length > 0 ? districts[0].id : "");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsApi.getReports(),
    refetchInterval: (query) => {
      const data = query.state.data as any[] | undefined;
      return data?.some(r => r.status === 'pending' || r.status === 'generating') ? 2000 : false;
    }
  });

  const { mutate: generateReport, isPending: isGenerating } = useMutation({
    mutationFn: reportsApi.createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setIsModalOpen(false);
      showToast("Intelligence report synthesis initiated.", "success");
    },
    onError: () => {
      showToast("Failed to initiate report synthesis.", "error");
    }
  });

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    const label = REPORT_TYPES.find((t) => t.value === formType)?.label ?? "Report";
    const distName = districts.find((d: any) => d.id === selectedDistrictId)?.name || "All";
    generateReport({
      title: `${label} - ${distName}`,
      type: formType,
      district_id: selectedDistrictId,
    });
  };

  const handleDownload = async (reportId: string, title: string) => {
    showToast(`Downloading secure dossier: ${title}...`, "info");
    try {
      const response = await reportsApi.downloadReport(reportId);
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_${reportId.substring(0,6)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Download complete. Connection secured.", "success");
    } catch (e) {
    }
  };

  const handleExportPDF = () => showToast("Exporting index to PDF...", "info");
  const handleExportCSV = () => showToast("Exporting data to CSV...", "info");

  // Stats Calculations
  const stats = useMemo(() => {
    const total = reports.length;
    const today = new Date().toDateString();
    const generatedToday = reports.filter((r: any) => new Date(r.created_at).toDateString() === today).length;
    const pending = reports.filter((r: any) => ['pending', 'generating'].includes(r.status)).length;
    const failed = reports.filter((r: any) => r.status === 'failed').length;
    return { total, generatedToday, pending, failed };
  }, [reports]);

  // Filtering
  const filteredReports = useMemo(() => {
    return reports.filter((r: any) => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchType = typeFilter === 'all' || r.type === typeFilter;
      // Filter by district matching logic
      const matchDistrict = districtFilter === 'all' || r.title.includes(districtFilter) || r.district_id === districtFilter;
      return matchSearch && matchStatus && matchType && matchDistrict;
    }).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [reports, search, statusFilter, typeFilter, districtFilter]);

  // Render Status Badge
  const renderStatus = (status: string) => {
    switch (status) {
      case 'ready':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Secured</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Failed</span>
          </div>
        );
      case 'generating':
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Processing</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-[calc(100vh-5rem)] relative">
      {/* Background Decorators */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#00E5FF]/5 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#8B5CF6]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] flex items-center gap-3"
            >
              <Layers className="w-8 h-8 text-[#00E5FF]" /> Intelligence Dossiers
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/50 mt-2 text-sm font-medium tracking-wide flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8B5CF6]" /> Encrypted report generation and distribution matrix.
            </motion.p>
          </div>
          
          <motion.button 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsModalOpen(true)}
            className="group relative px-6 py-3 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/40 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <Plus className="w-5 h-5 text-[#00E5FF] group-hover:rotate-90 transition-transform" />
            <span className="font-bold text-[#00E5FF] uppercase tracking-widest text-xs">Synthesize Report</span>
          </motion.button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Archives", val: stats.total, icon: Archive, color: "#00E5FF" },
            { label: "Generated Today", val: stats.generatedToday, icon: Activity, color: "#10B981" },
            { label: "Active Processing", val: stats.pending, icon: Cpu, color: "#F59E0B", pulse: true },
            { label: "Failed Syntheses", val: stats.failed, icon: AlertCircle, color: "#EF4444" },
          ].map((s, i) => (
            <motion.div 
              key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-[#050B14]/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-white/20 transition-all shadow-lg"
            >
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: s.color }} />
              <div className="flex justify-between items-start">
                <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{s.label}</p>
                <s.icon className={`w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity ${s.pulse ? 'animate-pulse' : ''}`} style={{ color: s.color }} />
              </div>
              <p className="text-3xl font-black mt-3 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">{s.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#00E5FF] transition-colors" />
            <input 
              type="text" placeholder="Search dossiers by title..." 
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00E5FF]/50 focus:bg-white/10 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-[#8B5CF6]/50 transition-colors">
                <Filter className="w-3.5 h-3.5 text-[#8B5CF6] mr-2" />
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-transparent border-none text-[11px] font-bold text-white uppercase tracking-wider focus:ring-0 cursor-pointer [&>option]:bg-[#050B14]">
                   <option value="all">All Types</option>
                   {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
             </div>
             <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-[#00E5FF]/50 transition-colors">
                <Activity className="w-3.5 h-3.5 text-[#00E5FF] mr-2" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-transparent border-none text-[11px] font-bold text-white uppercase tracking-wider focus:ring-0 cursor-pointer [&>option]:bg-[#050B14]">
                   <option value="all">All Status</option>
                   <option value="ready">Ready</option>
                   <option value="pending">Processing</option>
                   <option value="failed">Failed</option>
                </select>
             </div>
             
             {/* Export Buttons */}
             <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                <button onClick={handleExportPDF} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-white/50 hover:text-white group" title="Export PDF Index">
                   <FileText className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button onClick={handleExportCSV} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-white/50 hover:text-[#10B981] group" title="Export CSV Data">
                   <FileSpreadsheet className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        {/* Data Grid / Cards */}
        <div className="bg-[#050B14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           {isLoading ? (
              <div className="p-12 space-y-4">
                 {[1,2,3,4,5].map((i: number) => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse flex items-center px-6 gap-6">
                       <div className="w-8 h-8 rounded bg-white/10" />
                       <div className="w-1/3 h-4 rounded bg-white/10" />
                       <div className="w-24 h-4 rounded bg-white/10 ml-auto" />
                    </div>
                 ))}
              </div>
           ) : filteredReports.length === 0 ? (
              <div className="p-24 flex flex-col items-center justify-center text-center">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                    <Search className="w-10 h-10 text-white/20" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2 tracking-wide">No Intelligence Found</h3>
                 <p className="text-sm text-white/40 max-w-md mb-8">
                    The requested filter parameters yielded zero results in the central database.
                 </p>
                 <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    Generate New Report
                 </button>
              </div>
           ) : (
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-white/5 border-b border-white/10">
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 w-[40%]">Dossier Name</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Classification</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Generated Timestamp</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Network Status</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {filteredReports.map((r: any, i: number) => (
                          <motion.tr 
                             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.5) }}
                             key={r.id} className="hover:bg-white/[0.02] transition-colors group"
                          >
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:border-white/30 transition-colors">
                                      <FileText className="w-4 h-4 text-[#8B5CF6]" />
                                   </div>
                                   <div>
                                      <p className="text-sm font-bold text-white tracking-wide truncate max-w-[300px] group-hover:text-[#00E5FF] transition-colors">{r.title}</p>
                                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-1">ID: {r.id.substring(0,8)}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 text-[10px] uppercase font-bold tracking-widest">
                                   {r.type}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-xs text-white/80 font-mono tracking-wider">{format(new Date(r.created_at), "dd MMM yyyy")}</p>
                                <p className="text-[10px] text-white/40 font-mono mt-1">{format(new Date(r.created_at), "HH:mm:ss 'IST'")}</p>
                             </td>
                             <td className="px-6 py-4">
                                {renderStatus(r.status)}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                   <button 
                                      disabled={r.status !== 'ready'}
                                      onClick={() => handleDownload(r.id, r.title)}
                                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                                      title="Download Secure PDF"
                                   >
                                      <HardDriveDownload className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                                   </button>
                                   <button 
                                      disabled={r.status !== 'ready'}
                                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6] hover:border-[#8B5CF6]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                      title="Live Preview"
                                   >
                                      <Eye className="w-4 h-4" />
                                   </button>
                                </div>
                             </td>
                          </motion.tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
      </div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
               className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
               onClick={() => setIsModalOpen(false)}
             />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl bg-gradient-to-b from-[#0A101C] to-[#050B14] border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden"
             >
               {/* Modal Header Effect */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]" />
               
               <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h2 className="text-2xl font-black text-white tracking-wide">Synthesize Report</h2>
                        <p className="text-sm text-white/50 mt-1">Configure intelligence parameters for generation</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-6">
                     <div className="space-y-4">
                        <label className="block text-xs uppercase font-bold tracking-widest text-white/50">Classification Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           {REPORT_TYPES.map(t => (
                              <div 
                                 key={t.value} 
                                 onClick={() => setFormType(t.value)}
                                 className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                                    formType === t.value 
                                       ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.15)]' 
                                       : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                                 }`}
                              >
                                 <t.icon className={`w-6 h-6 mb-3 ${formType === t.value ? 'text-[#00E5FF]' : 'text-white/40'}`} />
                                 <h4 className={`text-sm font-bold tracking-wide ${formType === t.value ? 'text-white' : 'text-white/70'}`}>{t.label}</h4>
                                 <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{t.desc}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-xs uppercase font-bold tracking-widest text-white/50 mb-3">Target District Vector</label>
                        <div className="relative group">
                           <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#8B5CF6] transition-colors" />
                           <select 
                              value={formDistrict} 
                              onChange={e => setFormDistrict(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-white/10 transition-all appearance-none cursor-pointer [&>option]:bg-[#050B14]"
                           >
                              <option value="">All Regions (Statewide)</option>
                              {districts.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                     </div>

                     <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition-all">
                           Cancel
                        </button>
                        <button 
                           type="submit" 
                           disabled={isGenerating}
                           className="relative px-8 py-3 bg-white text-[#050B14] hover:bg-[#00E5FF] hover:text-[#050B14] rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                           {isGenerating ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                           ) : (
                              <><RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Execute Synthesis</>
                           )}
                        </button>
                     </div>
                  </form>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <AnimatePresence>
         {toast.show && (
            <motion.div 
               initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
               className="fixed bottom-6 right-6 z-[100] max-w-sm w-full"
            >
               <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start gap-3 ${
                  toast.type === 'success' ? 'bg-[#10B981]/10 border-[#10B981]/30' : 
                  toast.type === 'error' ? 'bg-[#EF4444]/10 border-[#EF4444]/30' : 
                  'bg-[#00E5FF]/10 border-[#00E5FF]/30'
               }`}>
                  {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" /> : 
                   toast.type === 'error' ? <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" /> : 
                   <DownloadCloud className="w-5 h-5 text-[#00E5FF] shrink-0 animate-pulse" />}
                  <div>
                     <p className={`text-sm font-bold ${
                        toast.type === 'success' ? 'text-[#10B981]' : 
                        toast.type === 'error' ? 'text-[#EF4444]' : 
                        'text-[#00E5FF]'
                     }`}>
                        {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'System Error' : 'System Notice'}
                     </p>
                     <p className="text-white/80 text-xs mt-1 leading-relaxed">{toast.msg}</p>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

// Inline Icon to fix missing import since lucide-react chevron down was missing in top
const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);



