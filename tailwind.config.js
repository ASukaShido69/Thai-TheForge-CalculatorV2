/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Thailand Theme Colors
        thai: {
          gold: '#FFD700',
          red: '#ED1C24',
          blue: '#2E3192',
          lightgold: '#FFF5E1',
          darkgold: '#B8860B',
        },
        // Instagram Minimal Colors
        ig: {
          bg: '#FAFAFA',
          border: '#DBDBDB',
          text: '#262626',
          secondary: '#8E8E8E',
        },
      },
      fontFamily: {
        mali: ['Mali', 'system-ui', 'sans-serif'],
        thai: ['Mali', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
        en: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-thai': 'linear-gradient(135deg, #FFD700 0%, #ED1C24 50%, #2E3192 100%)',
        'gradient-thai-subtle': 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(237,28,36,0.1) 50%, rgba(46,49,146,0.1) 100%)',
        'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
    },
  },
  plugins: [],
}
