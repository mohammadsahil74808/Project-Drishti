import type { Config } from "tailwindcss";

// SentinelX AI design tokens — premium cyber command-center theme
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sx-bg": "#040814",
        "sx-surface": "#081020",
        "sx-panel": "rgba(8, 16, 32, 0.65)", // Glassmorphic translucent panel
        "sx-panel-light": "rgba(16, 28, 51, 0.85)",
        "sx-border": "rgba(0, 242, 254, 0.15)", // Subtle neon border
        "sx-accent": "#00F2FE", // Neon Cyan
        "sx-accent-dim": "#4338CA", // Electric Indigo
        "sx-alert": "#FF4500", // High intensity orange/red
        "sx-critical": "#FF003C", // Cyberpunk red
        "sx-success": "#00FFA3", // Neon Green
        "sx-text": "#F8FAFC",
        "sx-text-dim": "#94A3B8",
        "sx-text-faint": "#475569",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Rajdhani", "Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(0,242,254,0.1), 0 8px 32px rgba(0,0,0,0.6)",
        glow: "0 0 24px rgba(0,242,254,0.45)",
        "glow-dim": "0 0 16px rgba(67,56,202,0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 2s alternate infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { boxShadow: "0 0 12px rgba(0,242,254,0.2)" },
          "100%": { boxShadow: "0 0 24px rgba(0,242,254,0.5)" }
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
