/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      '1920': '1920px',
      '1800': '1800px',
      '1280': '1280px',
      '1370': '1370px',
      '1380': '1380px',
      '1080': '1080px',
      '880': '880px',
      '800': '800px',
      '500': '500px',
      '550': '550px',
      '450': '450px',
      '400': '400px',
      '350': '350px',
      'lg': '1024px',
      'md': '768px',
      'sm': '320px',
      'lgv': {'raw': '(orientation: portrait) and (min-height: 500px)'},
    },
    extend: {
      fontFamily: {
        anonymous: ['Anonymous Pro', 'monospace'],
        prompt: ['Prompt', 'monospace'],
      },
    },
  },
  plugins: [],
}

