/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7437',
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD1C2',
          300: '#FFB49A',
          400: '#FF9466',
          500: '#FF7437',
          600: '#F5561A',
          700: '#D94210',
          800: '#B33610',
          900: '#8C2B0D',
        },
      },
    },
  },
  plugins: [],
};
