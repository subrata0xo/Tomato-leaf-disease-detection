/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#22c55e",
        accent: "#10b981",
        "bg-main": "#020617",
        "text-main": "#f8fafc",
        "text-dim": "#94a3b8",
      },
    },
  },
  plugins: [],
}
