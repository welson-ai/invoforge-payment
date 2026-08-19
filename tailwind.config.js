/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        invoforge: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#f59e0b',
          success: '#10b981',
          danger: '#ef4444',
          background: '#0f0f1a',
          surface: '#1a1a2e',
          'surface-hover': '#252542',
        },
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}