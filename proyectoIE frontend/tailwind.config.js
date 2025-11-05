/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#22d3ee", accent: "#a3e635" },
      boxShadow: { glass: "0 10px 30px rgba(0,0,0,0.3)" }
    }
  },
  plugins: []
}
