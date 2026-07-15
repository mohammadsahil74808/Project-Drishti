import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 flex w-full bg-[#020617] overflow-hidden selection:bg-[#00E5FF]/30 selection:text-white font-inter">
      {/* Dynamic Parallax Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-50 transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${(mousePos.x - window.innerWidth / 2) * -0.015}px, ${(mousePos.y - window.innerHeight / 2) * -0.015}px)` }}
      >
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-[#00E5FF]/10 via-[#00E5FF]/5 to-transparent rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-tl from-[#8B5CF6]/10 via-[#8B5CF6]/5 to-transparent rounded-full blur-[150px] mix-blend-screen" />
      </div>
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCIvPjwvc3ZnPg==')]" />

      <div className="z-10 h-full py-4 pl-4 shrink-0 flex flex-col justify-center transition-all duration-300">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 z-10 relative h-full">
        <div className="px-4 md:px-6 pt-4 shrink-0">
           <Navbar />
        </div>
        
        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden px-4 md:px-6 pt-2 pb-6 relative scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 min-h-full w-full max-w-full flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
