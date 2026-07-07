import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      colors: {
        surface: {
          50: '#F8F7F4', // Warm soft stone
          100: '#F3EFEA',
          200: '#E4DFD8',
          800: '#2A2825',
          900: '#1A1918', // Deep warm obsidian
          950: '#0F0E0D',
        },
        huasteca: '#166534',
        altiplano: '#B45309',
        centro: '#9A3412',
        media: '#A16207',
      },
    },
  },
  plugins: [],
};

export default config;

