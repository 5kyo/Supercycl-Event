import type { Config } from 'tailwindcss';

/* Color channel helper — returns Tailwind-compatible color that supports
 * the `/<alpha>` modifier when the CSS variable is in `r g b` channel form. */
const c = (rgbVar: string) => `rgb(var(${rgbVar}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* === Legacy palette (kept for migration) — now alpha-safe via channel form === */
        bg: c('--c-bg-rgb'),
        'surface-solid': 'var(--surface-elevated)',
        surface: 'var(--surface-1)',
        'mono-green': c('--c-accent-rgb'),
        amber: c('--c-warning-rgb'),
        orange: c('--c-warning-rgb'),
        red: c('--c-sell-rgb'),
        blue: c('--c-info-rgb'),
        text: c('--c-text-rgb'),
        muted: 'var(--text-secondary)',

        /* === Mobile design system palette === */
        accent: {
          DEFAULT: c('--c-accent-rgb'),
          light: '#7EF0A8',
          dark: '#00B254',
          glow: 'var(--accent-glow)',
          soft: 'var(--accent-soft)',
          tint: 'var(--accent-tint)',
        },
        'text-primary': c('--c-text-rgb'),
        'text-secondary': 'var(--text-secondary)',
        'text-secondary-strong': 'var(--text-secondary-strong)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-inverse': 'var(--text-inverse)',
        'border-subtle': 'var(--border-subtle)',
        'border-glass': 'var(--border-glass)',
        'border-glass-strong': 'var(--border-glass-strong)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        'surface-elevated': 'var(--surface-elevated)',
        'surface-track': 'var(--surface-track)',
        warning: c('--c-warning-rgb'),
        info: c('--c-info-rgb'),
        sell: c('--c-sell-rgb'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'display-md': ['24px', { lineHeight: '30px', fontWeight: '700' }],
        'title-lg': ['20px', { lineHeight: '26px', fontWeight: '700' }],
        'title-md': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'title-sm': ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '22px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      spacing: {
        '2xs': '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,230,118,0.08)',
        'btn-primary': '0 4px 14px rgba(0,230,118,0.3)',
        modal: '0 24px 60px rgba(0,0,0,0.5)',
        toast: '0 8px 32px rgba(0,0,0,0.6)',
        'focus-ring': '0 0 0 3px rgba(0,230,118,0.25)',
      },
      backdropBlur: {
        subtle: '12px',
        card: '20px',
        overlay: '30px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '240ms',
        slow: '380ms',
      },
    },
  },
  plugins: [],
};
export default config;
