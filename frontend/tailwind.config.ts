import type { Config } from "tailwindcss";

// SentinelX AI design tokens — dark police command-center theme
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sx-bg": "#0B0F17",
        "sx-surface": "#0F1420",
        "sx-panel": "#111827",
        "sx-panel-light": "#1A2333",
        "sx-border": "#1F2937",
        "sx-accent": "#3B82F6",
        "sx-accent-dim": "#1D4ED8",
        "sx-alert": "#F59E0B",
        "sx-critical": "#EF4444",
        "sx-success": "#10B981",
        "sx-text": "#E5E7EB",
        "sx-text-dim": "#9CA3AF",
        "sx-text-faint": "#6B7280",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)",
        glow: "0 0 20px rgba(59,130,246,0.35)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
