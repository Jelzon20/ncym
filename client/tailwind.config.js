/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      },
      backgroundImage: {
        'hero': "url('./src/assets/bg.png')",
      },
    },
    fontFamily: {
      abc: ["Poppins", "normal"],
      futura: ["Futura", "sans-serif"],
      thransty: ["Thransty", "sans-serif"],
    }
  },
  plugins: [
    require("flowbite/plugin"),
    // require('@tailwindcss/line-clamp'),
  ],
}