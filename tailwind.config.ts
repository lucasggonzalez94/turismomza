import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        magiesta: ['Magiesta', 'sans-serif'],
      },
      extend: {
        animation: {
          scroll:
            'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
          cubeDelay: 'cubeGridScaleDelay 1.3s infinite ease-in-out',
        },
        keyframes: {
          scroll: {
            to: {
              transform: 'translate(calc(-50% - 0.5rem))',
            },
          },
          cubeGridScaleDelay: {
            '0%, 70%, 100%': { transform: 'scale(1)' },
            '35%': { transform: 'scale(0)' },
          },
        },
        transitionDelay: {
          '0': '0ms',
          '100': '100ms',
          '200': '200ms',
          '300': '300ms',
          '400': '400ms',
        },
      },
    },
  },
  plugins: [
    nextui({
      layout: {
        disabledOpacity: '0.3',
        radius: {
          small: '4px',
          medium: '6px',
          large: '8px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
      },
      themes: {
        light: {
          colors: {
            background: '#ffffff',
            foreground: '#333333',
            primary: {
              DEFAULT: '#E95718',
              foreground: '#ffffff',
            },
            secondary: {
              DEFAULT: 'rgba(15, 15, 15, 0.5)',
              foreground: '#ffffff',
            },
            focus: '#E95718',
          },
        },
      },
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
      });
    }),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwind-scrollbar'),
  ],
};
export default config;
