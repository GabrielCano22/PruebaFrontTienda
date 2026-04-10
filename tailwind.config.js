/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'crimson': {
          50:  '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#D7263D',
          600: '#BE1E34',
          700: '#9F1629',
          800: '#7F1D2B',
          900: '#5C1520',
        },
        'surface':   '#02182B',
        'surface-2': '#071F37',
        'surface-3': '#0A2A44',
        'surface-4': '#0E3555',
        'surface-5': '#134068',
        'border-dark':   '#164063',
        'border-subtle': '#0E3555',
        'border-strong': '#1E5A8A',
      },
      fontFamily: {
        heading: ['Rubik', 'system-ui', 'sans-serif'],
        body:    ['Nunito Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
