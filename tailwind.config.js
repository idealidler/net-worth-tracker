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
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        /* Mapped to our raw RGB CSS variables for dynamic opacity support */
        background: 'rgb(var(--color-background) / <alpha-value>)', 
        surface: 'rgb(var(--color-surface) / <alpha-value>)',   
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)', 
        },
        accent: {
          green: 'rgb(var(--color-asset) / <alpha-value>)', 
          red: 'rgb(var(--color-liability) / <alpha-value>)',   
        },
        text: {
          DEFAULT: 'rgb(var(--color-text-main) / <alpha-value>)', 
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',   
        },
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
    },
  },
  plugins: [],
}