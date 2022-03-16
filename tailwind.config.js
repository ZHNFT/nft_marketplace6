const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    colors: {
      ...colors,
      malibu: '#5095ff',
      cornflower: '#6e85ff',
      blade: '#1f2225',
      ink: '#4a4a4a',
      rhino: '#c8c8c8',
      pitch: '#262b31',
      gunmetal: '#282d34',
      manatee: '#969eab',
      whiteLilac: '#f7f9fc',
      silver: '#77808b'
    },
    extend: {
      borderRadius: {
        large: '75px'
      },
      maxWidth: {
        '8xl': '90rem',
      },
      colors: {
        search: 'rgba(255, 255, 255, 0.05)',
        header: 'rgba(255, 255, 255, 0.25)',
      }
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
