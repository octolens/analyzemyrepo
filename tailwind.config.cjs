/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#e94f2e",
          secondary: "#140505",
          neutral: "#140505",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};
