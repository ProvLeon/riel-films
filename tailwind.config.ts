import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Enhanced Film industry palette
        film: {
          red: {
            50: "#FFF5F5", // Lighter warm red tint
            100: "#FED7D7", // Soft red tint
            200: "#FEB2B2", // Light warm red
            300: "#FC8181", // Medium red
            400: "#F56565", // Bright red
            500: "#E53E3E", // Primary red - adjusted for vibrancy
            600: "#C53030", // Deep red
            700: "#9B2C2C", // Rich red
            800: "#822727", // Dark red
            900: "#63171B", // Very dark red
            950: "#450A0A", // Nearly black red
          },
          black: {
            50: "#F9F9F9", // Nearly white
            100: "#F1F1F1", // Warm white/off-white
            200: "#E1E1E1", // Light creamy gray
            300: "#CECECE", // Light warm gray
            400: "#ADADAD", // Medium light gray
            500: "#888888", // Neutral gray
            600: "#636363", // Medium gray
            700: "#4F4F4F", // Dark gray
            800: "#333333", // Dark charcoal
            900: "#1A1A1A", // Nearly black
            950: "#0A0A0A", // Deep black
          },
          // Updated gray scale for better contrast
          gray: {
            50: "#FAFAFA", // Softer white
            100: "#F5F5F5", // Very light warm gray
            200: "#E5E5E5", // Light warm gray
            300: "#D4D4D4", // Medium light gray
            400: "#A3A3A3", // Medium gray
            500: "#737373", // Neutral gray
            600: "#525252", // Medium dark gray
            700: "#404040", // Dark gray
            800: "#262626", // Very dark gray
            900: "#171717", // Nearly black
          },
          // Enhanced gold palette for accents
          gold: {
            50: "#FFFBEB", // Very light gold tint
            100: "#FEF3C7", // Light gold tint
            200: "#FDE68A", // Light gold
            300: "#FCD34D", // Medium gold
            400: "#FBBF24", // Bright gold
            500: "#F59E0B", // Primary gold - more vibrant
            600: "#D97706", // Deep gold
            700: "#B45309", // Rich gold
            800: "#92400E", // Dark gold
            900: "#78350F", // Very dark gold
          },
          // Adding a warm accent color palette
          amber: {
            50: "#FFFBEB",
            100: "#FEF3C7",
            200: "#FDE68A",
            300: "#FCD34D",
            400: "#FBBF24",
            500: "#F59E0B",
            600: "#D97706",
            700: "#B45309",
            800: "#92400E",
            900: "#78350F",
          },
          warmWhite: {
            50: "#FFFDF9",
            100: "#FFF9F0",
            200: "#FFF5E6",
            300: "#FFEDD9",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        heading: ["Montserrat", "Arial", "sans-serif"],
      },
      // Add some additional customizations
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
