import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        baseline: {
          primary: "#01579B",
          secondary: "#FFA726",
          tertiary: "#424242",
          "neutral-offwhite": "#FAFAFA",
          "neutral-white": "#FFFFFF",
          "neutral-light-black": "#212121",
          "neutral-black": "#080808",
        },
        functional: {
          positive: "#007018",
          warning: "#F5C200",
          negative: "#C20618",
        },
        surface: {
          "high-emphasis": "rgba(8, 8, 8, 0.88)",
          "medium-emphasis": "rgba(8, 8, 8, 0.6)",
          disabled: "rgba(8, 8, 8, 0.16)",
        },
        standings: {
          gold: "#ffd700",
          silver: "#C0C0C0",
          bronze: "#CD7F32"
        },
        "light-blue": {
          "50": "#E1F5FE",
          "100": "#B3E5FC",
          "200": "#81D4FA",
          "300": "#4FC3F7",
          "400": "#29B6F6",
          "500": "#03A9F4",
          "600": "#039BE5",
          "700": "#0288D1",
          "800": "#0277BD",
          "900": "#01579B",
        },
      },
      backgroundImage: {
        "global-gradient": "linear-gradient(90deg, #0B4EA0 0%, #F09819 100%)",
        "orange-radial-gradient":
          "radial-gradient(circle, rgba(240, 152, 25, 0.45) 0%, rgba(240, 152, 25, 0.20) 50%, rgba(243, 156, 35, 0.00) 100%)",
        "blue-radial-gradient":
          "radial-gradient(circle, rgba(0, 119, 204, 0.35) 0%, rgba(0, 177, 233, 0.20) 50%, rgba(0, 177, 233, 0.00) 100%)",
        "background-gradient":
          "linear-gradient(90deg, rgba(255, 152, 0, 0.3) 0%, rgba(255, 167, 38, 0.3) 50%, rgba(153, 100, 23, 0.18) 100%)",
        "background-blue-gradient":
          "linear-gradient(90deg, rgba(240, 152, 25, 0.3) 0%, rgba(243, 156, 35, 0.3) 30%, rgba(0, 177, 233, 0.3) 80%, rgba(0, 119, 204, 0.3) 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontSize: {
        "2.5xl": ["1.75rem", {}],
        "3.5xl": ["2rem", {}],
        "6.5xl": ["4rem", {}],
        "7.5xl": ["5.625rem", {}],
      },
      lineHeight: {
        "11.2": "2.8rem",
        "15.2": "3.8rem",
        "19.2": "4.8rem",
        "27": "6.75rem",
      },
      letterSpacing: {
        "wider-sm": "0.04375rem",
      },
    },
    colors: {
      orange: {
        "50": "#FFF3E0",
        "100": "#FFE0B2",
        "200": "#FFCC80",
        "300": "#FFB74D",
        "400": "#FFA726",
        "500": "#FF9800",
        "600": "#FB8C00",
        "700": "#F57C00",
        "800": "#EF6C00",
        "900": "#E65100",
      },
      gray: {
        "50": "#FAFAFA",
        "100": "#F5F5F5",
        "200": "#EEEEEE",
        "300": "#E0E0E0",
        "400": "#BDBDBD",
        "500": "#9E9E9E",
        "600": "#757575",
        "700": "#616161",
        "800": "#424242",
        "900": "#212121",
      },
    },
    fontFamily: {
      manrope: ["Manrope", "sans"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
