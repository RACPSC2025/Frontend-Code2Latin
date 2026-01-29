/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html,js}', './public/**/*.{js,jsx,ts,tsx,html,js}'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};
