/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13ec13',
        'primary-dark': '#0ebf0e',
        'background-light': '#f6f8f6',
        'dark-green': '#111811',
      },
      fontFamily: {
        sans: ['Noto Sans Thai', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
