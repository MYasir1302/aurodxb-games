import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0a0c16",
          darker: "#06070d",
          card: "#121526",
          cardHover: "#181d33",
          border: "#1f2644",
          cyan: "#00f0ff",
          cyanHover: "#38f8ff",
          purple: "#a855f7",
          purpleHover: "#c084fc",
          pink: "#ff2a85",
          yellow: "#ffd200",
        },
      },
      boxShadow: {
        neonCyan: "0 0 20px -3px rgba(0, 240, 255, 0.4)",
        neonPurple: "0 0 20px -3px rgba(168, 85, 247, 0.4)",
        neonPink: "0 0 20px -3px rgba(255, 42, 133, 0.4)",
        cardGlow: "0 10px 30px -10px rgba(0, 240, 255, 0.15)",
      },
      animation: {
        pulseGlow: "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
