import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, EyeOff, Brain, Network, ShieldCheck, User, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api";

export default function Login() {
  const navigate = useNavigate();
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const [badgeNo, setBadgeNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  
  const { mutate: login, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      loginSuccess(data);
      navigate("/", { replace: true });
    },
    onError: (err: any) => {
      const detail = err.response?.data?.detail;
      let message = "Authentication failed. Please try again.";
      if (Array.isArray(detail)) {
        message = detail.map((e: any) => e.msg).join(", ");
      } else if (typeof detail === "string") {
        message = detail;
      }
      setError(message);
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!badgeNo.trim() || !password.trim()) {
      setError("Enter both badge number and password.");
      return;
    }
    login({ badge_no: badgeNo.trim(), password });
  };

  return (
    <div className="min-h-screen w-full bg-[#020510] text-white flex flex-col font-sans overflow-hidden relative selection:bg-[#00E5FF]/30 selection:text-white">
      
      {/* GLOBAL STYLES FOR AUTOFILL */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active{
            -webkit-box-shadow: 0 0 0 30px #050812 inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* BACKGROUND EFFECTS */}
      {/* Soft gradient orb in top left */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00E5FF]/10 blur-[120px] pointer-events-none" />
      {/* Soft gradient orb in bottom right */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/10 blur-[120px] pointer-events-none" />
      
      {/* Background Map & Network Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden flex items-center justify-center lg:justify-start lg:pl-20">
         {/* Abstract Network/Map SVG */}
         <svg width="600" height="600" viewBox="0 0 600 600" className="w-[80vw] max-w-[800px] h-auto lg:w-[60vw] opacity-30 text-[#00E5FF]">
            <path d="M200 100 L300 150 L250 300 L150 250 Z" stroke="currentColor" strokeWidth="1" fill="none" className="animate-[pulse_4s_infinite]" />
            <path d="M300 150 L450 120 L500 250 L350 350 L250 300" stroke="currentColor" strokeWidth="1" fill="none" className="animate-[pulse_5s_infinite]" />
            <path d="M350 350 L450 450 L300 500 L200 400 L150 250" stroke="currentColor" strokeWidth="1" fill="none" className="animate-[pulse_6s_infinite]" />
            {/* Nodes */}
            <circle cx="200" cy="100" r="3" fill="#00E5FF" className="animate-ping" />
            <circle cx="300" cy="150" r="4" fill="#00E5FF" />
            <circle cx="450" cy="120" r="3" fill="#00E5FF" />
            <circle cx="500" cy="250" r="4" fill="#00E5FF" />
            <circle cx="350" cy="350" r="5" fill="#8B5CF6" className="animate-ping" />
            <circle cx="250" cy="300" r="4" fill="#00E5FF" />
            <circle cx="150" cy="250" r="3" fill="#00E5FF" />
            <circle cx="450" cy="450" r="3" fill="#00E5FF" />
            <circle cx="300" cy="500" r="4" fill="#00E5FF" />
            <circle cx="200" cy="400" r="3" fill="#00E5FF" />
            {/* Map outline approximation */}
            <path d="M100 150 Q 150 50 250 80 T 400 100 T 550 200 T 500 400 T 350 550 T 150 450 Z" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" fill="none" />
         </svg>
      </div>

      {/* TOP HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 lg:p-8 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              SENTINEL<span className="text-[#00E5FF]">X</span> AI
            </h1>
            <p className="text-[10px] text-white/50 tracking-wider">
              Crime Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex-1 flex flex-col lg:flex-row z-10 w-full max-w-[1800px] mx-auto">
        
        {/* LEFT SIDE: Info & Showcase */}
        <div className="relative w-full lg:w-[55%] flex flex-col justify-center px-6 lg:px-16 pt-32 lg:pt-0 pb-12 lg:pb-32 min-h-screen lg:min-h-0">
          
          <div className="max-w-xl z-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Intelligent.<br />
              Proactive.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#3B82F6]">Always Ahead.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="text-white/60 text-lg max-w-md leading-relaxed"
            >
              Empowering Karnataka Police with AI-driven intelligence and real-time crime analytics.
            </motion.p>
          </div>

          {/* Bottom Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute bottom-16 lg:bottom-24 left-6 lg:left-16 flex flex-wrap lg:flex-nowrap gap-4 z-30"
          >
            {[
               { icon: Brain, title: "AI Forecasting", desc: "Predict crime trends with advanced AI.", color: "#8B5CF6" },
               { icon: Network, title: "Network Analysis", desc: "Uncover hidden criminal connections.", color: "#00E5FF" },
               { icon: ShieldCheck, title: "Real-Time Intelligence", desc: "Actionable insights for faster decisions.", color: "#00E5FF" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-[160px] lg:w-[180px] shadow-lg flex flex-col items-center text-center group hover:border-white/20 transition-all">
                 <div className="mb-3">
                    <feature.icon className="w-8 h-8 opacity-80" style={{ color: feature.color }} />
                 </div>
                 <h3 className="text-xs font-bold text-white mb-1.5">{feature.title}</h3>
                 <p className="text-[10px] text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* THE OFFICER IMAGE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute top-[10%] lg:top-[10%] right-[-10%] lg:right-[2%] w-[350px] lg:w-[450px] pointer-events-none z-20"
          >
            <img 
               src="/—Pngtree—3d render cartoon police officer_23072711.png" 
               alt="SentinelX AI Officer" 
               className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
               onError={(e) => {
                  e.currentTarget.style.display = 'none';
               }}
            />
          </motion.div>

        </div>

        {/* RIGHT SIDE: Login Card */}
        <div className="relative w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 z-40 min-h-[80vh] lg:min-h-screen">
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-[480px] relative lg:-ml-16"
          >
            {/* Outer Glow / Border container */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-[2.5rem] z-0" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 to-[#8B5CF6]/20 blur-2xl opacity-40 rounded-[2.5rem] z-0" />

            {/* Inner Glass Card */}
            <div className="relative z-10 bg-[#0A0F1F]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden">
               
               {/* Noise Texture */}
               <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
               />

               {/* Inner top shine */}
               <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

               {/* Logo / Title inside card */}
               <div className="flex flex-col items-center mb-8 relative z-10">
                  <div className="relative mb-4 group">
                     {/* Outer glow */}
                     <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] blur-xl opacity-40 rounded-full transition-opacity group-hover:opacity-60" />
                     {/* Logo container */}
                     <div className="w-16 h-16 bg-gradient-to-b from-[#0F172A] to-[#020510] border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] relative z-10 overflow-hidden">
                        {/* Shimmer sweep */}
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_infinite]" />
                        {/* SentinelX Icon */}
                        <Shield className="w-8 h-8 text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                     </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Officer Login</h2>
                  <p className="text-xs text-white/50 mt-1.5">Enter your credentials to continue</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  
                  {/* Badge Number */}
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-medium text-white/70 pl-1">Badge Number</label>
                     <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/50 to-[#8B5CF6]/50 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur-sm transition-opacity duration-300" />
                        <div className="relative flex items-center bg-[#050812] border border-white/10 rounded-xl px-4 py-3 group-focus-within/input:border-white/30 transition-colors">
                           <User className="w-4 h-4 text-white/40 group-focus-within/input:text-[#00E5FF] transition-colors shrink-0 mr-3" />
                           <input 
                              type="text" 
                              value={badgeNo}
                              onChange={(e) => setBadgeNo(e.target.value)}
                              placeholder="Enter your badge number"
                              className="w-full bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 placeholder:text-white/20"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                     <label className="text-[11px] font-medium text-white/70 pl-1">Password</label>
                     <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/50 to-[#8B5CF6]/50 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur-sm transition-opacity duration-300" />
                        <div className="relative flex items-center bg-[#050812] border border-white/10 rounded-xl px-4 py-3 group-focus-within/input:border-white/30 transition-colors">
                           <Lock className="w-4 h-4 text-white/40 group-focus-within/input:text-[#00E5FF] transition-colors shrink-0 mr-3" />
                           <input 
                              type={showPassword ? "text" : "password"} 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="w-full bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 placeholder:text-white/20 pr-10"
                           />
                           <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 text-white/30 hover:text-white/60 transition-colors"
                           >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between pt-1 pb-2">
                     <label className="flex items-center gap-2 cursor-pointer group/check">
                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${rememberMe ? 'bg-transparent border-[#00E5FF]' : 'bg-transparent border-white/20 group-hover/check:border-white/40'}`}>
                           {rememberMe && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-[#00E5FF] rounded-[2px]" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <span className="text-xs text-white/50 group-hover/check:text-white/80 transition-colors">Remember me</span>
                     </label>
                     
                     <button type="button" className="text-xs text-[#00E5FF] hover:text-white transition-colors">
                        Forgot Password?
                     </button>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                     {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-xs text-[#EF4444] text-center bg-[#EF4444]/10 py-2 rounded-lg border border-[#EF4444]/20">
                           {error}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button 
                     type="submit"
                     disabled={isPending}
                     className="relative w-full group/btn outline-none mt-2"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] rounded-xl blur opacity-70 group-hover/btn:opacity-100 transition duration-300" />
                     <div className="relative w-full bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white rounded-xl px-4 py-3.5 flex items-center justify-center shadow-lg transition-transform active:scale-[0.98]">
                        {isPending ? (
                           <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                           <>
                              <span className="font-bold text-sm">Login</span>
                              <div className="absolute right-4 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                                 <ArrowRight className="w-3 h-3 text-white" />
                              </div>
                           </>
                        )}
                     </div>
                  </button>

                  <div className="text-center pt-4 flex items-center justify-center gap-1.5 text-white/40">
                     <Lock className="w-3 h-3" />
                     <span className="text-[10px]">Secure & Encrypted Connection</span>
                  </div>

               </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM STATUS BAR */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-black/40 backdrop-blur-md border-t border-white/5 z-50 flex items-center justify-between px-6">
         <div className="flex items-center gap-6 text-[9px] text-white/50 uppercase tracking-widest font-medium">
            <span className="hidden sm:inline">System Status</span>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
               Backend Connected
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
               AI Engine Online
            </div>
            <div className="flex items-center gap-2 hidden md:flex">
               <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
               Secure Connection
            </div>
         </div>
         <div className="flex items-center gap-1.5 text-[9px] text-white/30 uppercase tracking-widest">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">Karnataka Police Intelligence Network</span>
         </div>
      </div>

    </div>
  );
}
