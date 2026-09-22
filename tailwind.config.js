/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Primary B2B Blue (#2563EB)
          700: '#1d4ed8', // Primary Hover (#1D4ED8)
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        slate: {
          900: '#0F172A', // Primary text & Sidebar bg
          800: '#172033', // Sidebar secondary
          700: '#334155',
          600: '#475569', // Secondary text
          500: '#64748B',
          400: '#94A3B8', // Muted text & placeholders
          300: '#CBD5E1',
          200: '#E2E8F0', // Border
          100: '#F1F5F9',
          50: '#F8FAFC',  // App background
        }
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)',
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.10), 0 4px 16px -4px rgba(15, 23, 42, 0.08)',
        'md': '0 4px 12px -2px rgba(15, 23, 42, 0.12), 0 2px 6px -2px rgba(15, 23, 42, 0.07)',
        'popover': '0 8px 30px -4px rgba(15, 23, 42, 0.18), 0 4px 10px -4px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        'dropdown': '0 12px 32px -4px rgba(15, 23, 42, 0.20), 0 4px 12px -4px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
}
