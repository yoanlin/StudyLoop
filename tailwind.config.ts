import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          100: "D9D9D9",
          200: "8A5E5E",
        },
        dark: {
          100: "#DEDCDC", // font-color1
          200: "#b0aeae", // font-color2
          300: "#403837", // hover-color
          400: "#292423", // dark-theme-color1
          500: "#181313", // dark-theme-color2
        },
        foreground: "var(--foreground)",
      },
      fontFamily: {
        bowlbyOneSC: "var(--font-bowlbyOneSC)",
      },
    },
  },
  plugins: [],
} satisfies Config;
