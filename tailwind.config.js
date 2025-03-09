/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        supnum: {
          blue: '#2C4091',
          green: '#44A957',
          teal: '#439AA9',
          'gray-light': '#F4F7FB',
          'blue-light': '#E4F0F7',
        },
        primary: {
          DEFAULT: '#2C4091',
          50: '#F4F7FB',
          100: '#E4F0F7',
          200: '#9AA5D1',
          300: '#7885C2',
          400: '#5666B3',
          500: '#2C4091',
          600: '#243374',
          700: '#1B2657',
          800: '#13193A',
          900: '#0A0C1D',
        },
        secondary: {
          DEFAULT: '#44A957',
          50: '#E8F5EA',
          100: '#D1EBD5',
          200: '#A3D7AB',
          300: '#75C380',
          400: '#47AF56',
          500: '#44A957',
          600: '#358745',
          700: '#266534',
          800: '#184422',
          900: '#0A2211',
        },
        accent: {
          DEFAULT: '#439AA9',
          50: '#E8F3F5',
          100: '#D1E7EB',
          200: '#A3CFD7',
          300: '#75B7C3',
          400: '#479FAF',
          500: '#439AA9',
          600: '#357B87',
          700: '#265C65',
          800: '#183D43',
          900: '#0A1E22',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'inner-md': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 