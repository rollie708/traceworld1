import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0D0C",
        panel: "#191B19",
        gold: "#C3A56B",
        ivory: "#E8E7E0",
      },
    },
  },
  plugins: [],
};

export default config;
