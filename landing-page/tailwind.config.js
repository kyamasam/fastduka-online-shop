/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,

  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        "primary-red": {
          50: "#fef2f3",
          100: "#fee2e3",
          200: "#ffc9cc",
          300: "#fda4a9",
          400: "#fa6f76",
          500: "#f02c36",
          600: "#df232d",
          700: "#bb1a22",
          800: "#9b1920",
          900: "#801c21",
          950: "#46090c",
        },
      },
    },
  },
  plugins: [],
};
