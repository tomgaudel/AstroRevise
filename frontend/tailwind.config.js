module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#c026d3',
        'neon-violet': '#bf00ff',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #c026d3 0%, #bf00ff 100%)',
        'stars':
          'radial-gradient(2px 2px at 20px 30px, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0)),radial-gradient(2px 2px at 60px 70px, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
    },
  },
  plugins: [],
};
