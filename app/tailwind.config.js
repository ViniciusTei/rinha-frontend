/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#FFFFFF',
        'invalid': '#BF0E0E',
        'accent': '#4E9590',
        'brackets': '#F2CAB8',
        'dark': '#000000',
        'gray': '#BFBFBF',
      },
      backgroundImage: {
        'btn': 'linear-gradient(180deg, #E4E4E4 0%, #F7F7F7 100%)',
      }
    },
  },
  plugins: [],
}

