/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Custom color palette for entertainment app
        primary: {
          DEFAULT: '#FC4747',
          dark: '#E43D3D',
          light: '#FD5F5F',
        },
        dark: {
          DEFAULT: '#10141E',
          light: '#161D2F',
          lighter: '#5A698F',
        },
        light: {
          DEFAULT: '#FFFFFF',
          dim: '#F8F8F8',
        },
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        128: '32rem',
      },
      fontSize: {
        xxs: '0.625rem',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
