/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft Neumorphic Bento Theme Palette
        theme: {
          accent: '#4D8DFF',
          'accent-hover': '#3A7AEB',
          'accent-dark': '#5687F6',
          emerald: '#2ECC71',
          orange: '#FF6B4A',
          charcoal: '#2C3E50',
          slate: '#718096',
          periwinkle: '#E8F0FE',
          'ice-start': '#EBF0F9',
          'ice-end': '#F4F7FC'
        },
        navy: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bedc',
          400: '#609dc9',
          500: '#3c81b2',
          600: '#2b6694',
          700: '#225278',
          800: '#1e4463',
          900: '#1b3a53',
          950: '#0b192c',
        },
        ice: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#4D8DFF',
          600: '#5687F6',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      boxShadow: {
        'bento': '0px 10px 30px rgba(112, 144, 176, 0.12)',
        'bento-hover': '0px 14px 34px rgba(112, 144, 176, 0.18)',
        'bento-sm': '0px 4px 16px rgba(112, 144, 176, 0.08)',
        'capsule': '0px 10px 30px rgba(112, 144, 176, 0.14)',
        'pill-active': '0px 6px 18px rgba(77, 141, 255, 0.35)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'capsule': '28px'
      }
    },
  },
  plugins: [],
}
