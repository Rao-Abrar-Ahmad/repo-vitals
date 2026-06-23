import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/frontend/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        card: "var(--bg-card)",
        "card-hover": "var(--bg-card-hover)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "accent-blue": "#3b82f6",
        "accent-purple": "#8b5cf6",
      },
    },
  },
  plugins: [],
} satisfies Config;
