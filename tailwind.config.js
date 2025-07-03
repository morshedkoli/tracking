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
        primary: '#31473A',
        secondary: '#EDF4F2',
        'primary-light': '#4A6357',
        'primary-dark': '#243329',
        'secondary-light': '#F4F9F7',
        'secondary-dark': '#D9E6E1'
      },
    },
  },
  plugins: [],
};