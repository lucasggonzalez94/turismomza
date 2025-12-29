import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        siren: {
          '50': '#fef1f8',
          '100': '#fde6f3',
          '200': '#fdcde7',
          '300': '#fda4d3',
          '400': '#fa6cb4',
          '500': '#f44096',
          '600': '#e41e73',
          '700': '#c61059',
          '800': '#a3114a',
          '900': '#7b113a',
          '950': '#540322',
        },
        trinidad: {
          '50': '#fef6ee',
          '100': '#fdebd7',
          '200': '#fad4ae',
          '300': '#f7b57a',
          '400': '#f38c44',
          '500': '#ef6d20',
          '600': '#e95718',
          '700': '#ba3d14',
          '800': '#943218',
          '900': '#782b16',
          '950': '#40130a',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        magiesta: ['Magiesta', 'sans-serif'],
      },
      extend: {
        animation: {
          scroll:
            'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
        },
        keyframes: {
          scroll: {
            to: {
              transform: 'translate(calc(-50% - 0.5rem))',
            },
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
      });
    }),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwind-scrollbar'),
    require('tailwindcss-animate'),
  ],
};
export default config;
