/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, literary color palette inspired by the uploaded image
        primary: {
          50: "#fdf8f3",
          100: "#f9ede1",
          200: "#f2d9c2",
          300: "#e8bf98",
          400: "#dca06c",
          500: "#d4874a",
          600: "#c6713f",
          700: "#a45a36",
          800: "#844932",
          900: "#6b3d2b",
          950: "#3a1e15",
        },
        secondary: {
          50: "#f7f6f4",
          100: "#ede9e3",
          200: "#ddd4c7",
          300: "#c7b8a4",
          400: "#b09a81",
          500: "#9f8467",
          600: "#92765b",
          700: "#79614d",
          800: "#635042",
          900: "#524237",
          950: "#2b221c",
        },
        accent: {
          50: "#fef7ed",
          100: "#fdecd4",
          200: "#fad5a8",
          300: "#f6b871",
          400: "#f19338",
          500: "#ed7611",
          600: "#de5c07",
          700: "#b84408",
          800: "#93360e",
          900: "#762d0f",
          950: "#401405",
        },
        neutral: {
          50: "#faf9f7",
          100: "#f2f0ec",
          200: "#e6e2db",
          300: "#d5cfc4",
          400: "#c0b7a8",
          500: "#a89c8a",
          600: "#8f8270",
          700: "#756b5c",
          800: "#625a4e",
          900: "#524c43",
          950: "#2b2722",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(135deg, rgba(212, 135, 74, 0.1) 0%, rgba(164, 90, 54, 0.1) 100%)",
        "card-pattern":
          "linear-gradient(145deg, rgba(247, 246, 244, 0.8) 0%, rgba(237, 233, 227, 0.8) 100%)",
      },
      boxShadow: {
        warm: "0 4px 6px -1px rgba(164, 90, 54, 0.1), 0 2px 4px -1px rgba(164, 90, 54, 0.06)",
        "warm-lg":
          "0 10px 15px -3px rgba(164, 90, 54, 0.1), 0 4px 6px -2px rgba(164, 90, 54, 0.05)",
      },
    },
  },
  plugins: [],
};
