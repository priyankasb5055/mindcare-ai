/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#1e293b",
        accent: "#3b82f6",
        card: "#111827",
        textPrimary: "#f8fafc",
        textMuted: "#94a3b8",
        warning: "#f59e0b",
        success: "#22c55e",
        danger: "#ef4444",
        accent2: "#8b5cf6",
        textSecondary: "#cbd5e1",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}