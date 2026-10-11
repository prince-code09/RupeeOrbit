/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EBE5D8',
          300: '#DDD5C2',
          400: '#C7BBA2',
          500: '#AA9A7E',
          600: '#8C7B60',
          700: '#6E5F48',
          800: '#534735',
          900: '#3A3125',
        },
        ink: {
          950: '#0C1210',
          900: '#141D1A',
          800: '#1E2C27',
          700: '#2D3E38',
          600: '#435850',
          500: '#637A71',
          400: '#8E9F98',
          300: '#CBD5D0',
          200: '#E2E8E5',
          100: '#F0F4F2',
          50: '#F8FAF9',
        },
        mint: {
          50: '#F0FBF7',
          100: '#DDF7ED',
          200: '#BCEDDA',
          300: '#86DDC0',
          400: '#49C59F',
          500: '#1EA67E',
          600: '#128664',
          700: '#106B52',
          800: '#105542',
          900: '#0F4738',
        },
        terracotta: {
          50: '#FDF6F4',
          100: '#FBEBE7',
          200: '#F7D6CD',
          300: '#F0B3A3',
          400: '#E37F69',
          500: '#CF563C',
          600: '#B53C24',
          700: '#922F1C',
          800: '#75281A',
          900: '#602419',
        },
        chartreuse: {
          300: '#BEF264',
          400: '#A3E635',
          500: '#84CC16',
          600: '#65A30D',
        },
        amberGold: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(19, 29, 26, 0.05), 0 1px 2px rgba(19, 29, 26, 0.03)',
        'card': '0 4px 16px -2px rgba(19, 29, 26, 0.06), 0 2px 6px -1px rgba(19, 29, 26, 0.04)',
        'elevated': '0 12px 32px -4px rgba(19, 29, 26, 0.08), 0 4px 12px -2px rgba(19, 29, 26, 0.04)',
        'floating': '0 20px 40px -8px rgba(19, 29, 26, 0.12), 0 8px 16px -4px rgba(19, 29, 26, 0.06)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'orbit-clockwise': 'spin 24s linear infinite',
        'orbit-counter': 'spin-counter 32s linear infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-counter': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
