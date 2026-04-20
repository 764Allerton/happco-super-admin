/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // class | media
  important: true,
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'defaultDarkColor': '#749B98',
        'defaultDarkThemeColor': '#749B98',
        'defaultLightColor': '#86A9A6',
        'defaultLightSlideColor': '#C1D1CF',
        'defaultWhiteColor': '#FFF',
        'defaultBlackColor': '#1e1e1e',
        'defaultDarkColorChat': '#BEDFD5',
        'defaultLightColorChat': '#E8F8F3',
      },
      backgroundImage: {
        'gradient-to-r-default': 'linear-gradient(to bottom, #4D9D90, #c7d4d4)',
        'authBg': "url('/src/Assets/Media/bgAuth.png')",
        'forgotBg': "url('/src/Assets/Media/bgForgot.png')",
      },
      boxShadow: {
        'custom': 'rgba(0, 0, 0, 0.10) 0px 5px 15px',
      },
      fontFamily: {
        'sans': ['Arial', 'Avenir', 'sans-serif'],
      },
      height: {
        content: "92.5vh",
      },
      screens: {
        'mdMin': { 'max': '767px' },
        'smMin': { 'max': '500px' },
      },
      fontWeight: {
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
      },
    }
  },
  plugins: [],
}
