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
        brand: {
          primary: "#4F46E5", // Indigo-600 (Trust & Tech)
          primaryHover: "#4338CA", // Indigo-700
          secondary: "#10B981", // Emerald-500 (Civic & Growth)
          secondaryHover: "#059669", // Emerald-600
        },
        status: {
          submitted: "#3B82F6", // Blue-500
          pending: "#F59E0B", // Amber-500
          urgent: "#EF4444", // Red-500
          resolved: "#10B981", // Emerald-500
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F9FAFB", // Off-white / Gray-50
          border: "#E5E7EB", // Light Gray / Gray-200
        },
        content: {
          primary: "#111827", // Gray-900
          secondary: "#4B5563", // Gray-600
          muted: "#6B7280", // Gray-500
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        noto: ["var(--font-noto-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
