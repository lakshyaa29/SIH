/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sih: {
          primary: '#0F172A',     // Deep Navy
          accent: '#2563EB',      // Royal Blue
          saffron: '#F97316',     // Saffron India Accent
          green: '#16A34A',       // Green India Accent
          emerald: '#059669',     // Success Emerald
          surface: '#F8FAFC',     // Light Background Surface
          card: '#FFFFFF',        // Card Background
          border: '#E2E8F0',      // Border Slate
          muted: '#64748B',       // Muted Text
          highlight: '#EFF6FF'    // Highlight Blue Tint
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
