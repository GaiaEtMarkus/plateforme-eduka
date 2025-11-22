/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'eduka-orange': '#FF9966',
        'eduka-dark': '#1a1a1a',
        'eduka-gray': '#f5f5f5',
      },
    },
  },
  plugins: [],
}
