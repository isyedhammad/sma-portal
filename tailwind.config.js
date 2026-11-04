/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        punjab: {
          green: '#0A6238',
          greenLight: '#10B981',
          gold: '#D97706',
          sidebar: '#090E17',
          sidebarHeader: '#05080E',
          canvas: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
