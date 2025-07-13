import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#FAFAFA',
          dark: '#0A0A0A',
        },
        canvas: {
          light: '#FFFFFF',
          dark: '#111111',
        },
        primary: '#4C6EF5',
        secondary: '#7950F2',
        accent: '#12B886',
        text: {
          primary: {
            light: '#1A1A1A',
            dark: '#FAFAFA',
          },
          secondary: {
            light: '#6B7280',
            dark: '#9CA3AF',
          },
        },
        border: {
          light: '#E5E7EB',
          dark: '#1F2937',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
        h1: ['36px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
        h2: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        body: ['16px', { lineHeight: '24px' }],
        small: ['14px', { lineHeight: '20px' }],
        micro: ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        wave: 'wave 1.2s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%': { transform: 'translateY(0px)' },
          '33%': { transform: 'translateY(-6px)' },
          '66%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
