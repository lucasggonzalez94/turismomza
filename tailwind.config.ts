import type { Config } from 'tailwindcss';
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
            background: '#d9d9d9',
            foreground: '#333333',
            primary: {
              DEFAULT: '#E95718',
              foreground: '#d9d9d9',
            },
            secondary: {
              DEFAULT: 'rgba(15, 15, 15, 0.5)',
              foreground: '#d9d9d9',
            },
            focus: '#E95718',
          },
        },
      },
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
    }),
  ],
};
export default config;
