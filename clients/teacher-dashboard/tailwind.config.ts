import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bcolor: "#f2f2f2",
        txt: "#2a3547",
        primary: "#7266FC",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),

    function ({ addUtilities }: any) {
      addUtilities(
        {
          ".sidebar-scrollbar": {
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              // "box-shadow": "inset 0 0 5px grey",
              // "border-radius": "10px",
              background: "rgba(0,0,0,.05)",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#ddd",
              "border-radius": "1px",
            },
          },
          ".scrollbar-width": {
            "&::-webkit-scrollbar": {
              width: "5px",
            },
          },
        },
        ["responsive"]
      );
    },
  ],
};
export default config;
