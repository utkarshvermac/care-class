/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070A12",
          900: "#0A0E1A",
          800: "#12182A",
          700: "#1A2138",
          600: "#232B45",
          500: "#3A4360",
        },
        paper: {
          50: "#FBFAF7",
          100: "#F5F3ED",
          200: "#E9E6DC",
        },
        gold: {
          400: "#F2CA6D",
          500: "#E8B84B",
          600: "#C9932A",
        },
        present: {
          400: "#5CE0A3",
          500: "#3DD68C",
          600: "#26B873",
        },
        absent: {
          400: "#F5859A",
          500: "#F1637A",
          600: "#D63F58",
        },
        cancelled: {
          400: "#8B96AB",
          500: "#6C7A99",
          600: "#525F7B",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gold-glow": "radial-gradient(circle at top left, rgba(232,184,75,0.16), transparent 60%)",
        "meter-track": "linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08))",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 30px -12px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(232,184,75,0.4), 0 0 24px rgba(232,184,75,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "needle-in": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
        "needle-in": "needle-in 0.8s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
