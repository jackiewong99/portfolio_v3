/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      forest: {
        100: "#ddfddb",
        200: "#a7d7c5",
        300: "#80b5a0",
        600: "#1eb178",
        700: "#5c8d89",
        800: "#12714d",
        900: "#275854",
      },
      yellow: {
        100: "#fdfdf8",
      },
    },
  },
  plugins: [],
};
