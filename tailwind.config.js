/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#FAFAF7',
        ink: '#1C1D1B',
        accent: '#3A5A73',
        'accent-light': '#4A7291',
        'accent-dark': '#2A4255',
        muted: '#8C8B84',
        rust: '#B4712E',
        success: '#4F7A57',
        critical: '#AB4A42',
        surface: '#F2F2EE',
        border: '#E0E0D8',
        'border-strong': '#C8C8BF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'sm-warm': '0 1px 3px 0 rgba(28, 29, 27, 0.08)',
        'md-warm': '0 4px 12px 0 rgba(28, 29, 27, 0.10)',
        'lg-warm': '0 8px 24px 0 rgba(28, 29, 27, 0.12)',
      },
    },
  },
  plugins: [],
}
