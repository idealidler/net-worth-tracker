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
        /* Let Tailwind dynamically inject the opacity into our RGB variables */
        background: 'rgb(var(--color-background) / <alpha-value>)', 
        surface: 'rgb(var(--color-surface) / <alpha-value>)',   
        primary: {
          DEFAULT: '#22D3EE', 
          light: '#67E8F9',
          dark: '#0E7490',
        },
        accent: {
          green: '#34D399', 
          red: '#F87171',   
        },
        text: {
          DEFAULT: 'rgb(var(--color-text-main) / <alpha-value>)', 
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',   
        },
      },
    },
  },
  plugins: [],
}