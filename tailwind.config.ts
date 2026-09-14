import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14181F",
        slate2: "#5A6472",
        paper: "#E9ECF1",
        card: "#FFFFFF",
        foil: "#B9C0CB",
        foilhi: "#E4E8EE",
        signal: "#1F6F5C",
        alert: "#A8432C",
      },
      fontFamily: {
        ui: ["Rubik", "system-ui", "sans-serif"],
        display: ["'Suez One'", "Rubik", "serif"],
      },
      borderRadius: { tile: "14px" },
      boxShadow: {
        tile: "0 1px 0 rgba(20,24,31,.06), 0 6px 18px -10px rgba(20,24,31,.35)",
      },
    },
  },
  plugins: [],
};
export default config;
