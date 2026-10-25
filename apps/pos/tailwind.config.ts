import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        kucek: {
          cyan: '#0EA5E9',
          'cyan-light': '#38BDF8',
          ocean: '#0284C7',
          'ocean-dark': '#0369A1',
          foam: '#F0F9FF',
          coral: '#FB7185',
          gold: '#F59E0B',
          navy: '#0F172A',
        },
      },
      borderRadius: {
        bubble: '1.25rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 24px -4px rgba(14, 165, 233, 0.35)',
        'glow-emerald': '0 0 24px -4px rgba(16, 185, 129, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
