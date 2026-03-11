module.exports = {
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        'primary-dark': '#388E3C',
        'primary-light': '#C8E6C9',
        secondary: '#FFC107',
        accent: '#8BC34A',
        text: '#212121',
        'text-light': '#757575',
        background: '#F5F5F5',
        surface: '#FFFFFF',
      },
    },
  },
  plugins: [],
};