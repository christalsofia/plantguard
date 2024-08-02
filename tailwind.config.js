/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/*.html'],
  theme: {
    extend: {
      colors: {
        'salem': {
          '50': '#f0fdf3',
          '100': '#dcfce5',
          '200': '#bcf6cd',
          '300': '#87eea7',
          '400': '#4bdd79',
          '500': '#24c356',
          '600': '#17a243',
          '700': '#167f38',
          '800': '#176430',
          '900': '#15522a',
          '950': '#052e14'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

