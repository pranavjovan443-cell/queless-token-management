/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00f2ff",
        secondary: "#bc13fe",
        accent: "#ff0066",
        cyber: "#0a0a14",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 242, 255, 0.4)',
        'glow-secondary': '0 0 20px rgba(188, 19, 254, 0.4)',
      }
    },
  },
  plugins: [],
};
