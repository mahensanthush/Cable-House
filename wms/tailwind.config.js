/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to look at all your React files
  ],
  theme: {
    extend: {
      // You can add custom colors here to match the image exactly
      colors: {
        'cable-blue': '#2563eb',
        'worker-dark': '#1e293b',
      }
    },
  },
  plugins: [],
}