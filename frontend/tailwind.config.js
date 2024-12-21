/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E88E5",
          light: "#63A4FF",
          dark: "#005CB2",
        },
        secondary: {
          DEFAULT: "#FFA726",
          light: "#FFD95B",
          dark: "#C77800",
        },
        accent: {
          DEFAULT: "#43A047",
          light: "#76D275",
          dark: "#00701A",
        },
        background: {
          DEFAULT: "#F7F7F7",
        },
        text: {
          primary: "#333333",
          secondary: "#757575",
        },
      },
    },
  },
  plugins: [],
};
