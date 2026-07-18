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
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      animation: {
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'rise-in': 'riseIn 0.6s cubic-bezier(0.22,0.61,0.36,1) both',
        'marquee': 'marquee 36s linear infinite',
      },
      letterSpacing: {
        'tight-heading': '-0.02em',
        'tight-display': '-0.035em',
      },
    },
  },
  plugins: [],
};
