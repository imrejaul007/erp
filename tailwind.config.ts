import type { Config } from 'tailwindcss'

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        // Enhanced luxury perfume color palette with high contrast
        oud: {
          50: '#fdfcf9',
          100: '#f8f4ed',
          200: '#f0e6d6',
          300: '#e4d1b3',
          400: '#A67C3A', // Darker for better contrast
          500: '#8B5A2B', // Much darker main oud color
          600: '#73481F', // Very dark for text
          700: '#5C3619', // High contrast text
          800: '#3D2410', // Very high contrast
          900: '#2A1A0B', // Nearly black
          950: '#1A1007', // Almost black
        },
        // Deep luxury gold palette
        gold: {
          50: '#fffef7',
          100: '#fffaeb',
          200: '#fef2c7',
          300: '#fde047',
          400: '#facc15',
          500: '#D4AF37', // Classic luxury gold
          600: '#B8860B',
          700: '#8B6914',
          800: '#6B5416',
          900: '#4A3F11',
          950: '#2D2609',
        },
        // Rich chocolate browns
        mahogany: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#A0522D',
          600: '#8B4513',
          700: '#723A12',
          800: '#5D2F0F',
          900: '#4A240C',
          950: '#2F1607',
        },
        // Elegant deep purples
        royal: {
          50: '#faf7ff',
          100: '#f4edff',
          200: '#e9ddff',
          300: '#d4c2ff',
          400: '#b794f6',
          500: '#6A4C93',
          600: '#553C7B',
          700: '#4A2C6A',
          800: '#3D2456',
          900: '#2D1B42',
          950: '#1A0F2E',
        },
        // Sophisticated teals
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#4A9B8E',
          600: '#3D8B7C',
          700: '#2F6B63',
          800: '#285951',
          900: '#1E3E38',
          950: '#0F2419',
        },
        // Warm luxury neutrals
        pearl: {
          50: '#fdfdf9',
          100: '#faf9f2',
          200: '#f5f2e8',
          300: '#ede8d3',
          400: '#e1d8bc',
          500: '#FAF7F2',
          600: '#E8E2D4',
          700: '#C7BBA8',
          800: '#9B8F7E',
          900: '#6B625A',
          950: '#3A342F',
        },
        // High contrast text colors
        ink: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#2C1810', // Primary dark text
          600: '#3A2818',
          700: '#1F0E08',
          800: '#140A05',
          900: '#0A0503',
          950: '#000000',
        },
        // shadcn/ui colors
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        arabic: ['Cairo', 'Noto Sans Arabic', 'system-ui', 'sans-serif'],
        luxury: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(135deg, #C8A876 0%, #D4AF37 25%, #B8860B 75%, #8B6914 100%)',
        'luxury-warm': 'linear-gradient(135deg, #FAF7F2 0%, #F5F2E8 50%, #E8E2D4 100%)',
        'luxury-gold': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #8B6914 100%)',
        'luxury-oud': 'linear-gradient(135deg, #C8A876 0%, #B8965D 50%, #9A7B47 100%)',
        'luxury-royal': 'linear-gradient(135deg, #6A4C93 0%, #553C7B 50%, #4A2C6A 100%)',
        'luxury-teal': 'linear-gradient(135deg, #4A9B8E 0%, #3D8B7C 50%, #2F6B63 100%)',
        'luxury-paper': 'radial-gradient(ellipse at top, #fdfcf9 0%, #f8f4ed 50%, #f0e6d6 100%)',
      },
      boxShadow: {
        'luxury': '0 4px 14px 0 rgba(200, 168, 118, 0.12), 0 2px 6px 0 rgba(200, 168, 118, 0.08)',
        'luxury-md': '0 8px 20px 0 rgba(200, 168, 118, 0.15), 0 4px 8px 0 rgba(200, 168, 118, 0.1)',
        'luxury-lg': '0 16px 32px 0 rgba(200, 168, 118, 0.18), 0 8px 16px 0 rgba(200, 168, 118, 0.12)',
        'luxury-xl': '0 24px 48px 0 rgba(200, 168, 118, 0.22), 0 12px 24px 0 rgba(200, 168, 118, 0.15)',
        'gold': '0 4px 14px 0 rgba(212, 175, 55, 0.15), 0 2px 6px 0 rgba(212, 175, 55, 0.1)',
        'royal': '0 4px 14px 0 rgba(106, 76, 147, 0.15), 0 2px 6px 0 rgba(106, 76, 147, 0.1)',
        'teal': '0 4px 14px 0 rgba(74, 155, 142, 0.15), 0 2px 6px 0 rgba(74, 155, 142, 0.1)',
        'inner-luxury': 'inset 0 2px 4px 0 rgba(200, 168, 118, 0.06)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config