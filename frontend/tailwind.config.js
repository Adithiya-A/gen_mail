/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#635BFF',
          700: '#5346E0',
          800: '#4338CA',
          900: '#312E81',
          primary: '#635BFF',
          secondary: '#7C3AED',
          surface: '#F8F9FE',
          card: '#FFFFFF',
          dark: '#111827',
          heading: '#13182E',
          muted: '#64748B',
          border: '#E8EBF8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', '"Kalam"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(99, 91, 255, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(99, 91, 255, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'card': '0 2px 12px rgba(22, 28, 45, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
