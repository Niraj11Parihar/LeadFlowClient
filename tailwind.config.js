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
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FAFBFC',
          ground: '#F7F8FA',
        },
        neutral: {
          900: '#111827',
          700: '#374151',
          600: '#4B5563',
          500: '#667085',
          400: '#98A2B3',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#EEF0F3',
          50: '#F9FAFB',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'sm': '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px -1px rgba(16, 24, 40, 0.04)',
        'card': '0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'card-hover': '0 4px 12px -2px rgba(16, 24, 40, 0.08), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
        'popover': '0 10px 38px -10px rgba(16, 24, 40, 0.14), 0 4px 12px -4px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
