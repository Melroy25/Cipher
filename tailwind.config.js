/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        cyber: {
          green: "#00ff66",
          darkgreen: "#003b15",
          lime: "#00e65b",
          dim: "#4ade80",
          black: "#030804",
          surface: "rgba(8, 20, 12, 0.75)",
          border: "rgba(0, 255, 102, 0.2)",
          borderHover: "rgba(0, 255, 102, 0.6)",
          textMuted: "#88aa90"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Google Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        serif: ['Cinzel', 'Playfair Display', 'serif']
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 255, 102, 0.4)',
        'neon-strong': '0 0 30px rgba(0, 255, 102, 0.7), 0 0 10px rgba(0, 255, 102, 0.9)',
        'card-glow': '0 0 20px rgba(0, 255, 102, 0.15)'
      }
    },
  },
  plugins: [],
}
