/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        secondary: {
          500: "#3b82f6",
          600: "#2563eb",
        },
        accent: {
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        error: {
          500: "#ef4444",
          600: "#dc2626",
        },
        warning: {
          500: "#f97316",
        },
      },
      fontFamily: {
        inter: ["Inter"],
      },
    },
  },
  plugins: [],
};
