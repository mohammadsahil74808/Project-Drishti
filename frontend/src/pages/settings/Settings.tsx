import React, { useState, type FormEvent, useMemo } from "react";
import { 
  User, Bell, Lock, Save, Shield, Eye, EyeOff, Check, X, Info, 
  CheckCircle2, ChevronRight, Activity, Smartphone, Server, Cpu, 
  Paintbrush, Palette, Sparkles, Globe, Monitor, Moon, Sun, Terminal, Key,
  Fingerprint
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { usersApi } from "@/api";

// -------------------------------------------------------------
// REUSABLE COMPONENTS
// -------------------------------------------------------------
const PremiumCard = ({ children, title, icon: Icon, desc }: { children: React.ReactNode, title: string, icon: any, desc: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    className="bg-gradient-to-br from-[#050B14]/80 to-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="flex items-center gap-4 mb-8 relative z-10 border-b border-white/10 pb-6">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
        <Icon className="w-6 h-6 text-[#00E5FF]" />
      </div>
      <div>
        <h2 className="text-xl font-black text-white tracking-wide">{title}</h2>
        <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1 font-bold">{desc}</p>
      </div>
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);

const PremiumInput = ({ label, value, onChange, disabled = false, type = "text", icon: Icon }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] text-white/50 uppercase font-black tracking-widest pl-1">{label}</label>
    <div className="relative group">
       {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#00E5FF] transition-colors" />}
       <input 
         type={type} value={value} onChange={onChange} disabled={disabled}
         className={`w-full bg-white/5 border border-white/10 rounded-xl ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#00E5FF]/50 focus:bg-white/10 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
       />
    </div>
  </div>
);

const ToggleSwitch = ({ checked, onChange, label, desc, icon: Icon }: any) => (
  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group" onClick={onChange}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${checked ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/5 text-white/30 group-hover:text-white/60'}`}>
         <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className={`text-sm font-bold tracking-wide transition-colors ${checked ? 'text-white' : 'text-white/70'}`}>{label}</p>
        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{desc}</p>
      </div>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 ${checked ? 'bg-[#10B981]' : 'bg-white/10'}`}>
      <motion.div 
         layout transition={{ type: "spring", stiffness: 700, damping: 30 }}
         className="w-4 h-4 rounded-full bg-white shadow-sm"
         style={{ marginLeft: checked ? '24px' : '0px' }}
      />
    </div>
  </div>
);

// -------------------------------------------------------------
// SECTIONS
// -------------------------------------------------------------

const ProfileSection = React.memo(({ user }: { user: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "+91 9876543210");
  const [email, setEmail] = useState(user?.email ?? "officer@ksp.gov.in");
  const [station, setStation] = useState(user?.station_name ?? "");

  return (
    <PremiumCard title="Officer Identity" desc="Official command credentials" icon={Fingerprint}>
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
           <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#050B14] to-black border border-white/10 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-full h-full rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden relative">
                 <User className="w-12 h-12 text-white/20" />
                 {/* Fake scanning effect */}
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
           </div>
           <Badge text={user?.role?.toUpperCase() ?? "OFFICER"} color="#8B5CF6" />
        </div>
        
        <div className="flex-1 w-full space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumInput label="Full Name" value={name} onChange={(e: any) => setName(e.target.value)} disabled={!isEditing} icon={User} />
              <PremiumInput label="Badge Number" value={user?.badge_no ?? "KSP-0000"} disabled={true} icon={Shield} />
              <PremiumInput label="Email Address" value={email} onChange={(e: any) => setEmail(e.target.value)} disabled={!isEditing} icon={Globe} />
              <PremiumInput label="Phone Number" value={phone} onChange={(e: any) => setPhone(e.target.value)} disabled={!isEditing} icon={Smartphone} />
              <PremiumInput label="Police Station" value={station} onChange={(e: any) => setStation(e.target.value)} disabled={!isEditing} icon={Terminal} />
              <PremiumInput label="District" value={user?.district_name ?? "Headquarters"} disabled={true} icon={Activity} />
           </div>

           <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button 
                 onClick={() => setIsEditing(!isEditing)}
                 className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    isEditing 
                       ? 'bg-white text-black hover:bg-[#00E5FF] shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                       : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
                 }`}
              >
                 {isEditing ? 'Save Profile' : 'Edit Credentials'}
              </button>
           </div>
        </div>
      </div>
    </PremiumCard>
  );
});

const NotificationsSection = React.memo(() => {
  const [notifyAnomaly, setNotifyAnomaly] = useState(true);
  const [notifyForecast, setNotifyForecast] = useState(true);
  const [notifyMissing, setNotifyMissing] = useState(true);
  const [notifySms, setNotifySms] = useState(false);

  return (
    <PremiumCard title="Alert Matrix" desc="System notification preferences" icon={Bell}>
      <div className="space-y-2">
         <ToggleSwitch checked={notifyAnomaly} onChange={() => setNotifyAnomaly(!notifyAnomaly)} label="Anomaly Detonations" desc="Statistically unusual crime spikes in jurisdiction" icon={Activity} />
         <ToggleSwitch checked={notifyForecast} onChange={() => setNotifyForecast(!notifyForecast)} label="Predictive Forecasts" desc="AI-predicted risk crossing severity thresholds" icon={Sparkles} />
         <ToggleSwitch checked={notifyMissing} onChange={() => setNotifyMissing(!notifyMissing)} label="Facial Recognition Matches" desc="Live CCTV matches for missing persons" icon={User} />
         <ToggleSwitch checked={notifySms} onChange={() => setNotifySms(!notifySms)} label="Critical SMS Dispatch" desc="High-priority alerts sent via carrier network" icon={Smartphone} />
      </div>
    </PremiumCard>
  );
});

const SecuritySection = React.memo(() => {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  
  const strength = useMemo(() => {
    if (!newPw) return 0;
    let score = 0;
    if (newPw.length > 8) score += 25;
    if (newPw.match(/[A-Z]/)) score += 25;
    if (newPw.match(/[0-9]/)) score += 25;
    if (newPw.match(/[^A-Za-z0-9]/)) score += 25;
    return score;
  }, [newPw]);

  const { mutate, isPending, isSuccess } = useMutation({ mutationFn: usersApi.changePassword });

  const handleSave = (e: FormEvent) => {
     e.preventDefault();
     if (newPw === confirmPw && newPw.length > 0) {
        mutate({ old_password: currentPw, new_password: newPw });
     }
  };

  return (
    <PremiumCard title="Access Security" desc="Encryption & Authentication" icon={Lock}>
      <form onSubmit={handleSave} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PremiumInput label="Current Cipher" type="password" value={currentPw} onChange={(e: any) => setCurrentPw(e.target.value)} icon={Key} />
            <div className="relative">
               <PremiumInput label="New Cipher" type={showPw ? "text" : "password"} value={newPw} onChange={(e: any) => setNewPw(e.target.value)} icon={Lock} />
               <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-9 text-white/30 hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               </button>
            </div>
            <PremiumInput label="Verify New Cipher" type={showPw ? "text" : "password"} value={confirmPw} onChange={(e: any) => setConfirmPw(e.target.value)} icon={CheckCircle2} />
            
            <div className="flex flex-col justify-center px-2">
               <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/50">Cipher Strength</span>
                  <span className="text-[10px] font-mono text-white/70">{strength}%</span>
               </div>
               <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#EF4444] transition-all duration-500" style={{ width: `${Math.min(strength, 25)}%`, opacity: strength > 0 ? 1 : 0 }} />
                  <div className="h-full bg-[#F59E0B] transition-all duration-500" style={{ width: `${Math.max(0, Math.min(strength - 25, 25))}%` }} />
                  <div className="h-full bg-[#10B981] transition-all duration-500" style={{ width: `${Math.max(0, Math.min(strength - 50, 25))}%` }} />
                  <div className="h-full bg-[#00E5FF] transition-all duration-500 shadow-[0_0_10px_#00E5FF]" style={{ width: `${Math.max(0, Math.min(strength - 75, 25))}%` }} />
               </div>
               <p className="text-[9px] text-white/40 uppercase tracking-widest mt-2">Requires: 8+ Chars, Upper, Num, Symbol</p>
            </div>
         </div>

         <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <AnimatePresence>
               {isSuccess && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[#10B981]">
                     <CheckCircle2 className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Cipher Updated Securely</span>
                  </motion.div>
               )}
            </AnimatePresence>
            <button 
               type="submit" 
               disabled={isPending || newPw !== confirmPw || strength < 75}
               className="ml-auto px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
               {isPending ? 'Encrypting...' : 'Update Cipher'}
            </button>
         </div>
      </form>
    </PremiumCard>
  );
});

const AppearanceSection = React.memo(() => {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('blue');

  return (
    <PremiumCard title="Interface Aesthetics" desc="Command Center Visuals" icon={Palette}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
            <label className="block text-[10px] text-white/50 uppercase font-black tracking-widest mb-3">Core Theme</label>
            <div className="grid grid-cols-3 gap-3">
               {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor }
               ].map(t => (
                  <button 
                     key={t.id} onClick={() => setTheme(t.id)}
                     className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${theme === t.id ? 'bg-white/10 border-[#00E5FF]/50 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                  >
                     <t.icon className="w-5 h-5" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
                  </button>
               ))}
            </div>
         </div>
         <div>
            <label className="block text-[10px] text-white/50 uppercase font-black tracking-widest mb-3">Accent Hologram</label>
            <div className="grid grid-cols-4 gap-3">
               {[
                  { id: 'blue', color: '#00E5FF', label: 'Neon' },
                  { id: 'police', color: '#3B82F6', label: 'Police' },
                  { id: 'emerald', color: '#10B981', label: 'Secure' },
                  { id: 'purple', color: '#8B5CF6', label: 'Royal' }
               ].map(c => (
                  <button 
                     key={c.id} onClick={() => setAccent(c.id)}
                     className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${accent === c.id ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                     <div className={`w-4 h-4 rounded-full shadow-[0_0_10px_${c.color}]`} style={{ backgroundColor: c.color }} />
                     <span className={`text-[9px] font-bold uppercase tracking-wider ${accent === c.id ? 'text-white' : 'text-white/40'}`}>{c.label}</span>
                  </button>
               ))}
            </div>
         </div>
      </div>
    </PremiumCard>
  );
});

const AIPreferencesSection = React.memo(() => {
  const [style, setStyle] = useState('precise');
  const [lang, setLang] = useState('en');

  return (
    <PremiumCard title="Sentinel Engine" desc="AI Model Parameters" icon={Cpu}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div>
            <label className="block text-[10px] text-white/50 uppercase font-black tracking-widest mb-3">Response Vector</label>
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
               {[
                  { id: 'precise', label: 'Precise' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'detailed', label: 'Detailed' }
               ].map(s => (
                  <button 
                     key={s.id} onClick={() => setStyle(s.id)}
                     className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${style === s.id ? 'bg-white/10 text-[#8B5CF6] shadow-sm' : 'text-white/40 hover:text-white'}`}
                  >
                     {s.label}
                  </button>
               ))}
            </div>
         </div>
         <div>
            <label className="block text-[10px] text-white/50 uppercase font-black tracking-widest mb-3">Linguistics Module</label>
            <select 
               value={lang} onChange={e => setLang(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white uppercase tracking-wider focus:outline-none focus:border-[#8B5CF6]/50 cursor-pointer [&>option]:bg-[#050B14]"
            >
               <option value="en">English (Global)</option>
               <option value="kn">Kannada (Regional)</option>
            </select>
         </div>
      </div>
    </PremiumCard>
  );
});

const AboutSection = React.memo(() => (
  <PremiumCard title="System Diagnostics" desc="Version & Integrity" icon={Server}>
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
       <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)] shrink-0">
          <Shield className="w-10 h-10 text-white" />
       </div>
       <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
             <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Build Version</p>
             <p className="text-sm font-mono text-white mt-1">v2.4.1-beta</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
             <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Neural Core Status</p>
             <p className="text-sm font-mono text-[#10B981] mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                ONLINE (99.9%)
             </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 col-span-2 flex justify-between items-center">
             <div>
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Uplink Gateway</p>
                <p className="text-xs font-mono text-white/70 mt-1 truncate">wss://api.sentinelx.gov.in/v1</p>
             </div>
             <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
       </div>
    </div>
  </PremiumCard>
));

const Badge = ({ text, color }: { text: string, color: string }) => (
  <div className="px-3 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest shadow-inner" style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color: color }}>
     {text}
  </div>
);

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export default function Settings() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6 max-w-[1200px] mx-auto min-h-[calc(100vh-5rem)] relative pb-20">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-[#00E5FF]/5 blur-[120px]" />
         <div className="absolute bottom-[20%] left-[5%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="border-b border-white/10 pb-6 mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] flex items-center gap-3"
          >
            <Monitor className="w-8 h-8 text-[#8B5CF6]" /> System Configuration
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-white/50 mt-2 text-sm font-medium tracking-wide">
            Manage your SentinelX identity, security clearance, and local interface parameters.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Left Column */}
           <div className="lg:col-span-7 space-y-8">
              <ProfileSection user={user} />
              <SecuritySection />
           </div>
           
           {/* Right Column */}
           <div className="lg:col-span-5 space-y-8">
              <NotificationsSection />
              <AppearanceSection />
              <AIPreferencesSection />
              <AboutSection />
           </div>
        </div>
      </div>
    </div>
  );
}
