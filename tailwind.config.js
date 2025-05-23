/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        surface: '#ffffff',
        border: '#e5e7eb',
      },
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light']
  }
}
