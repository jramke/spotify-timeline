import type { Config } from "tailwindcss";
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
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
			fontFamily: {
				sans: ['Plus Jakarta Sans Variable', ...fontFamily.sans]
			},
			colors: {
				spotify: {
					DEFAULT: "hsl(var(--spotify))",
					foreground: "hsl(var(--spotify-foreground))",
				},
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
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"tap": {
					"0%": { transform: "scale(0.98)" },
					"40%": { transform: "scale(1.02)" },
					"100%": { transform: "scale(1)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"tap": "tap 0.4s ease-out",
				"tap-stop": "tap 0s ease-out",
			},
			boxShadow: {
				"inner-shadow-float": `
					0px 1px 0px 0px hsla(0,0%,100%,.1) inset,
					0px 0px 0px 1px hsla(0,0%,100%,.04) inset,
					0px 0px 0px 1px rgba(0,0,0,.2),
					0px 2px 2px 0px rgba(0,0,0,.2),
					0px 4px 4px 0px rgba(0,0,0,.2),
					0px 8px 8px 0px rgba(0,0,0,.2)
				`,
				"inner-shadow-float-light": `
					0px 1px 0px 0px hsla(0,0%,100%,.07) inset,
					0px 0px 0px 1px hsla(0,0%,100%,.02) inset,
					0px 0px 0px 1px rgba(0,0,0,.1),
					0px 2px 2px 0px rgba(0,0,0,.1),
					0px 4px 4px 0px rgba(0,0,0,.1),
					0px 8px 8px 0px rgba(0,0,0,.1)
				`,
			}
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), require('tailwindcss-spring'),],
} satisfies Config;

export default config;
