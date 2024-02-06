/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './index.html',
        '.src/styles/main.css',
    ],
    theme: {
        extend: {
            boxShadow: {
                darkShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
              },
        },
    },
    plugins: [],
};