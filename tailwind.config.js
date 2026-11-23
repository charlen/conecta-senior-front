/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1e40af',
        background: '#ffffff',
        surface: '#f8fafc',
        'text-primary': '#0f172a',
        'text-secondary': '#475569',
        border: '#e2e8f0',
        success: '#16a34a',
        warning: '#d97706',
        error: '#dc2626',
      },
      fontSize: {
        base: ['18px', { lineHeight: '1.6' }],
        lg: ['20px', { lineHeight: '1.6' }],
        xl: ['24px', { lineHeight: '1.4' }],
        '2xl': ['32px', { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
      },
      borderRadius: {
        xl: '12px',
        lg: '8px',
      },
    },
  },
  plugins: [],
}
