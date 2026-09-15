/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './context/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          '#0a0a0b',
        surface:     '#111113',
        panel:       '#0d0d0f',
        blood:       '#c8192c',
        'blood-mid': '#e8303f',
        'blood-bg':  'rgba(200,25,44,0.08)',
        emerald:     '#3dbf7e',
        amber:       '#e8a230',
        ink:         '#f2f2f0',
        slate:       '#a8a8a4',
        muted:       '#707070',
        dim:         '#444444',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      animation: {
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'ticker':    'ticker 32s linear infinite',
        'fade-up':   'fade-up 0.18s ease-out',
      },
      keyframes: {
        'pulse-dot': {
          '0%,100%': { opacity: '1'   },
          '50%':     { opacity: '0.3' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'   },
        },
      },
    },
  },
  plugins: [],
}
