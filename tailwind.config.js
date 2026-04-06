/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'surface': '#0F1117',
        'surface-2': '#161B25',
        'surface-3': '#1E2433',
        'surface-4': '#252D3D',
        'border-dark': '#2A3347',
      },
      fontFamily: {
        heading: ['Rubik', 'sans-serif'],
        body: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
