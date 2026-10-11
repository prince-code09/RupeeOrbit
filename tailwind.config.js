/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#070C16',
          900: '#0B1220', // Main background
          850: '#0E1726',
          800: '#111C30', // Secondary background
          750: '#16243A', // Card surface
          700: '#1C2E4A',
          650: '#203454',
          600: '#263E63', // Refined borders
          500: '#345282',
        },
        forest: {
          950: '#070C16',
          900: '#0B1220',
          850: '#0E1726',
          800: '#111C30',
          700: '#16243A',
          600: '#1F3452',
        },
        parchment: {
          50: '#16243A',   // card surface (#16243A)
          100: '#1A2C46',  // slightly lighter card surface / pill
          150: '#1E3352',
          200: '#223A5E',  // subtle borders & inner pills
          300: '#2A4874',  // card borders
          400: '#3A5F96',
          500: '#547EB8',
          600: '#7B9FD1',
          700: '#A4BFE4',
          800: '#CFE0F5',
          900: '#EAF2FB',
        },
        ink: {
          950: '#FFFFFF',  // primary crisp white
          900: '#F1F5F9',  // main text (#F1F5F9)
          800: '#E2E8F0',
          700: '#CBD5E1',
          600: '#A8B6CA',  // muted text (#A8B6CA)
          500: '#94A3B8',  // secondary muted
          400: '#64748B',
          300: '#475569',
          200: '#334155',
          100: '#1E293B',
          50: '#0F172A',
        },
        accent: {
          blue: '#63B3ED',  // Primary accent (cyan/sky #63B3ED)
          teal: '#5EEAD4',  // Secondary accent (mint/teal #5EEAD4)
          cyan: '#38BDF8',
        },
        mint: {
          50: '#0F2922',
          100: '#13392E',
          200: '#1A4D3E',
          300: '#266D57',
          400: '#2DD4BF',
          500: '#5EEAD4',
          600: '#14B8A6',
          700: '#0D9488',
          800: '#0F766E',
          900: '#115E59',
        },
        terracotta: {
          50: '#2E1513',
          100: '#3F1C18',
          200: '#5A2620',
          300: '#7E3228',
          400: '#B84534',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        gold: {
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
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
        script: ['"Caveat"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'card': '0 4px 20px -2px rgba(2, 6, 23, 0.55), 0 2px 8px -1px rgba(2, 6, 23, 0.35)',
        'elevated': '0 12px 36px -4px rgba(2, 6, 23, 0.75), 0 4px 16px -2px rgba(2, 6, 23, 0.5)',
        'floating': '0 24px 48px -8px rgba(2, 6, 23, 0.9), 0 8px 24px -4px rgba(2, 6, 23, 0.65)',
        'glow-cyan': '0 0 25px rgba(99, 179, 237, 0.25)',
        'glow-teal': '0 0 25px rgba(94, 234, 212, 0.25)',
        'glow-emerald': '0 0 25px rgba(94, 234, 212, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'orbit-clockwise': 'spin 28s linear infinite',
        'orbit-counter': 'spin-counter 36s linear infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'spin-counter': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
