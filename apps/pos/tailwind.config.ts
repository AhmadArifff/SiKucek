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
    },
  },
  plugins: [],
};

export default config;
