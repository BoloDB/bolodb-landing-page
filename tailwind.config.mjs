/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        background: 'var(--bg)',
        foreground: 'var(--ink)',
        muted: {
          DEFAULT: 'var(--surface-2)',
          foreground: 'var(--muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--ink)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--ink)',
        },
        brand: 'var(--brand)',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
    },
  },
  plugins: [],
};
