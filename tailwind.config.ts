import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bengali: [
          "Noto Sans Bengali",
          "Noto Sans Bengali UI",
          "Hind Siliguri",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          50: "#e6efec",
          400: "#338169",
          500: "#006243",
          950: "#000e0a",
        },
        ink: {
          700: "#212121",
          800: "#171717",
          900: "#111111",
        },
        grayui: {
          100: "#f4f4f6",
          200: "#ebecf0",
          300: "#dddfe4",
          600: "#8c929c",
          700: "#5b616d",
          800: "#414651",
          900: "#222732",
          950: "#0a0c11",
        },
      },
      boxShadow: {
        button: "0 4px 0 rgba(0, 0, 0, 0.22)",
        glow: "0 14px 30px rgba(0, 98, 67, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
