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
              DEFAULT: '#7b113a',
              foreground: '#ffffff',
            },
            secondary: {
              DEFAULT: 'rgba(15, 15, 15, 0.5)',
              foreground: '#ffffff',
            },
            focus: '#7b113a',
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
