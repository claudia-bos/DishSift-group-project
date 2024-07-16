/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          0: "#ffffff",
          50: "#ecf8fb",
          100: "#caebf5",
          200: "#a9dfef",
          300: "#88d2e9",
          400: "#67c6e3",
          500: "#46badd",
          600: "#27acd4",
          700: "#2191b3",
          800: "#1b7692",
          900: "#155b71",
          1000: "#0f4150",
        },
        secondary: {
          0: "#ffffff",
          50: "#f8e2db",
          100: "#f5d4ca",
          200: "#efbaa9",
          300: "#e99f88",
          400: "#e38467",
          500: "#dd6946",
          600: "#d45027",
          700: "#b34321",
          800: "#92371b",
          900: "#712a15",
          1000: "#501e0f",
        },
        other: {
          blue: "#ecf8fb",
          gray: "#D4D4D4",
          buttons: "#1b7692",
          hover: "#27acd4",
        },
        font: {
          garamond: ['"EB Garamond"', "serif"],
          "comic-sans": ['"Comic Sans MS"', "cursive"],
          "brush-script": ['"Brush Script MT"', "cursive"],
        },
      },
    },
  },
  plugins: [],
};
