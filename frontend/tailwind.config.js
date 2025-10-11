/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRD-specified outdoor racing color palette
        primary: '#1F3A2E', // Deep Forest Green
        secondary: '#2F3E46', // Slate / Charcoal
        accent: '#D9772B', // Burnt Orange (CTA)
        panel: '#E2E8E6', // Sky Mist / Light Gray
        success: '#5F7F60', // Muted Moss (Complete)
        warning: '#D1A038', // Goldenrod
      },
    },
  },
  plugins: [],
}
