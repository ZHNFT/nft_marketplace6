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
        large: '75px',
        tab: '50px'
      },
      maxWidth: {
        '8xl': '90rem',
      },
      colors: {
        search: 'rgba(255, 255, 255, 0.05)',
        header: 'rgba(255, 255, 255, 0.25)',
        tabButton: "#202225",
        cardCaption: 'rgba(32, 34, 37, 0.3)',
        tagDark: 'rgba(32, 34, 37, 0.3)'
      },
      boxShadow: {
        tab: '0px 1px 0px #282D34, inset 2px -3px 10px rgba(21, 23, 26, 0.2), inset 4px 4px 10px rgba(21, 23, 26, 0.7)',
        tabButton: '1px 1px 4px #15171A',
        featuredCard: 'inset 11px 10px 20px rgba(255, 255, 255, 0.03)'
      },
      fontSize: {
        xxs: '10px'
      },
      backgroundImage: {
        'main-page': 'url("/images/bg-main.svg")',
        'frame': 'url("/images/bg-frame.png")',
        'cardOutline1': 'url("/images/bg-card-outline.png")',
        'cardOutline2': 'url("/images/bg-card-outline-2.png")',
        'cardOutline3': 'url("/images/bg-card-outline-3.png")'
      },
      backgroundPosition: {
        'top-center': 'top center'
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
