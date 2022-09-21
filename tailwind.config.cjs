/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("flowbite/plugin"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#e94f2e",
          secondary: "#140505",
          neutral: "#F9FAFB",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};
