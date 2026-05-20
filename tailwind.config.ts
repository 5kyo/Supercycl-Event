import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg, #0a0d0f)',
        surface: 'var(--color-surface, #11161a)',
        'mono-green': 'var(--color-mono-green, #00d68f)',
        amber: 'var(--color-amber, #fbbf24)',
        orange: 'var(--color-orange, #fb923c)',
        red: 'var(--color-red, #ef4444)',
        blue: 'var(--color-blue, #38bdf8)',
        text: 'var(--color-text, #e6edf3)',
        muted: 'var(--color-muted, #8b949e)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
