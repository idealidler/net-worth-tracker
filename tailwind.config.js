/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // New, comprehensive color palette
        background: 'var(--color-background)', // Deep, dark background
        surface: 'var(--color-surface)',   // Slightly lighter surface for cards
        primary: {
          DEFAULT: '#22D3EE', // A vibrant cyan
          light: '#67E8F9',
          dark: '#0E7490',
        },
        accent: {
          green: '#34D399', // For positive values
          red: '#F87171',   // For negative values
        },
        text: {
          DEFAULT: 'var(--color-text-main)', // Main text color
          muted: 'var(--color-text-muted)',   // Softer text for labels
        },
      },
    },
  },
  plugins: [],
}