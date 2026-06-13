/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 45px rgba(244, 114, 182, 0.28)',
        gold: '0 18px 50px rgba(245, 158, 11, 0.18)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(-4deg)' },
          '50%': { transform: 'translate3d(8px, -18px, 0) rotate(4deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.8)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-420px 0' },
          '100%': { backgroundPosition: '420px 0' },
        },
      },
      animation: {
        floatSlow: 'floatSlow 9s ease-in-out infinite',
        twinkle: 'twinkle 3.6s ease-in-out infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  plugins: [],
};
