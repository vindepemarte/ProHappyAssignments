/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors from logo
        primary: {
          DEFAULT: '#4ECDC4', // Bright turquoise
          50: '#F0FDFC',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#4ECDC4',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          dark: '#2E86AB', // Deep blue
        },
        secondary: {
          DEFAULT: '#2E86AB', // Deep blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2E86AB',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          yellow: '#FFE66D', // Bright yellow
          red: '#FF6B6B', // Vibrant red
          purple: '#A8E6CF', // Purple/magenta
          navy: '#2C3E50', // Dark navy
        },
        success: '#10b981',
        error: '#FF6B6B', // Using brand red
        warning: '#FFE66D', // Using brand yellow
        info: '#4ECDC4', // Using brand turquoise
        gray: {
          dark: '#2C3E50', // Using brand navy
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}