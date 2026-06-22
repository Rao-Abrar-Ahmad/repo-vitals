import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/frontend/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0a0a0f",
        card: "#111118",
        "card-hover": "#16161f",
        "text-primary": "#f8f8f8",
        "text-muted": "#6b7280",
        "accent-blue": "#3b82f6",
        "accent-purple": "#8b5cf6",
      },
    },
  },
  plugins: [],
} satisfies Config;
