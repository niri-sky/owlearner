const { nextui } = require("@nextui-org/react");
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      colors:{
        primary:"#C713CB",
        title:"#1D2026",
        txt:"#4E5566",
        bgColor:"#FAF9F6",
        bColor:"#C4C4C4",
        yColor:"#FD440F",
        priColor:"#0B72FF"
      }
    },
  },
  plugins: [nextui()],
};
export default config;
