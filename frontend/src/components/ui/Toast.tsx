import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore, ToastType } from '../../store/toastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastConfig: Record<ToastType, { icon: React.ReactNode; bgClass: string; borderClass: string; textClass: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-[#10B981]" />,
    bgClass: 'bg-[#10B981]/10',
    borderClass: 'border-[#10B981]/30',
    textClass: 'text-[#10B981]',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 text-[#EF4444]" />,
    bgClass: 'bg-[#EF4444]/10',
    borderClass: 'border-[#EF4444]/30',
    textClass: 'text-[#EF4444]',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
    bgClass: 'bg-[#F59E0B]/10',
    borderClass: 'border-[#F59E0B]/30',
    textClass: 'text-[#F59E0B]',
  },
  info: {
    icon: <Info className="w-5 h-5 text-[#00F2FE]" />,
    bgClass: 'bg-[#00F2FE]/10',
    borderClass: 'border-[#00F2FE]/30',
    textClass: 'text-[#00F2FE]',
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`flex items-start gap-3 p-4 w-[350px] rounded-2xl backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto ${config.bgClass} ${config.borderClass}`}
            >
              <div className="shrink-0 mt-0.5">{config.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white/90 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-white/40 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
