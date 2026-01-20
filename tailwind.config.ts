import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom esports theme colors
        "neon-blue": {
          DEFAULT: "hsl(217 91.2% 59.8%)", // Original sidebar-ring, now primary neon blue
          50: "hsl(217 91.2% 85%)",
          100: "hsl(217 91.2% 80%)",
          200: "hsl(217 91.2% 70%)",
          300: "hsl(217 91.2% 60%)",
          400: "hsl(217 91.2% 50%)",
          500: "hsl(217 91.2% 40%)",
          600: "hsl(217 91.2% 30%)",
          700: "hsl(217 91.2% 20%)",
          800: "hsl(217 91.2% 15%)",
          900: "hsl(217 91.2% 10%)",
        },
        "neon-purple": {
          DEFAULT: "hsl(270 80% 60%)",
          50: "hsl(270 80% 90%)",
          100: "hsl(270 80% 80%)",
          200: "hsl(270 80% 70%)",
          300: "hsl(270 80% 60%)",
          400: "hsl(270 80% 50%)",
          500: "hsl(270 80% 40%)",
          600: "hsl(270 80% 30%)",
          700: "hsl(270 80% 20%)",
          800: "hsl(270 80% 15%)",
          900: "hsl(270 80% 10%)",
        },
        "neon-red": {
          DEFAULT: "hsl(350 80% 60%)",
          50: "hsl(350 80% 90%)",
          100: "hsl(350 80% 80%)",
          200: "hsl(350 80% 70%)",
          300: "hsl(350 80% 60%)",
          400: "hsl(350 80% 50%)",
          500: "hsl(350 80% 40%)",
          600: "hsl(350 80% 30%)",
          700: "hsl(350 80% 20%)",
          800: "hsl(350 80% 15%)",
          900: "hsl(350 80% 10%)",
        },
        dark: {
          DEFAULT: "hsl(220 15% 10%)", // Dark background
          foreground: "hsl(210 20% 98%)", // Light text on dark background
          card: "hsl(220 15% 15%)", // Slightly lighter dark for cards
          border: "hsl(220 15% 25%)", // Border color
        },
      },
      borderRadius: {
        lg: "1rem", // More rounded
        md: "0.75rem",
        sm: "0.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "neon-glow": {
          "0%, 100%": { textShadow: "0 0 5px hsl(var(--neon-blue)), 0 0 10px hsl(var(--neon-blue))" },
          "50%": { textShadow: "0 0 10px hsl(var(--neon-blue)), 0 0 20px hsl(var(--neon-blue))" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px var(--tw-shadow-color)" },
          "50%": { boxShadow: "0 0 15px var(--tw-shadow-color)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-glow": "neon-glow 1.5s ease-in-out infinite alternate",
        "pulse-glow-blue": "pulse-glow 2s ease-in-out infinite alternate var(--neon-blue)",
        "pulse-glow-purple": "pulse-glow 2s ease-in-out infinite alternate var(--neon-purple)",
        "pulse-glow-red": "pulse-glow 2s ease-in-out infinite alternate var(--neon-red)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;