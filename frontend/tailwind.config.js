/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#eef2ff',
          500: '#6d28d9',
          700: '#4c1d95'
        },
        surface: '#0f172a'
      },
      boxShadow: {
        soft: '0 6px 20px rgba(2,6,23,0.6)',
        card: '0 8px 30px rgba(15,23,42,0.35)'
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(90deg,#7c3aed 0%, #06b6d4 100%)'
      }
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
