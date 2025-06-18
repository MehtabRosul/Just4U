
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'], // Maintained for shadcn compatibility, but default is dark.
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: {
          DEFAULT: 'hsl(var(--input))',
          placeholder: 'hsl(var(--input-placeholder))',
          ring: 'hsl(var(--input-ring))',
        },
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Specific theme variables from new design
        'top-utility': {
          DEFAULT: 'hsl(var(--top-utility-bg))',
          foreground: 'hsl(var(--top-utility-fg))',
        },
        'primary-header': {
          DEFAULT: 'hsl(var(--primary-header-bg))',
        },
        'global-nav': {
          DEFAULT: 'hsl(var(--global-nav-bg))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'marquee-text': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-horizontal': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-horizontal-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'soft-glow': {
          '0%, 100%': { 'box-shadow': '0 0 10px 0px hsl(var(--primary) / 0.4)' },
          '50%': { 'box-shadow': '0 0 20px 5px hsl(var(--primary) / 0.6)' },
        },
        'slow-pan': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' },
        },
        'pulse-opacity-anim': { // Renamed to avoid conflict if 'pulse-opacity' is a pre-existing Tailwind name
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        'aurora-bg': {
          '0%': { 'background-position': '0% 0%' },
          '50%': { 'background-position': '100% 100%' },
          '100%': { 'background-position': '0% 0%' },
        },
        'color-cycle-stone': {
          '0%, 100%': { 'background-color': 'hsl(var(--muted))' }, // Using CSS var for stone-like
          '33%': { 'background-color': 'hsl(var(--secondary))' }, // Using CSS var
          '66%': { 'background-color': 'hsl(var(--border))' }, // Using CSS var
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee-text': 'marquee-text 25s linear infinite',
        'marquee-horizontal': 'marquee-horizontal 40s linear infinite', 
        'marquee-horizontal-reverse': 'marquee-horizontal-reverse 40s linear infinite',
        'soft-glow-red': 'soft-glow 3s ease-in-out infinite alternate',
        'slow-pan-neutral': 'slow-pan 15s ease-in-out infinite alternate',
        'pulse-opacity-rose': 'pulse-opacity-anim 2.5s ease-in-out infinite alternate',
        'aurora-dark': 'aurora-bg 20s ease-in-out infinite alternate',
        'color-cycle-stone-bg': 'color-cycle-stone 10s ease-in-out infinite alternate',
      },
      height: { 
        '6': '1.5rem', 
        '16': '4rem', 
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar')({ nocompatible: true }), 
  ],
} satisfies Config;

