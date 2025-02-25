import type { Metadata } from 'next';
import { rootFont } from '../config/fonts';
import './globals.css';
import './fonts.css';

import { NextUIProvider } from '@nextui-org/react';
import Providers from '@/store/Providers';
import AuthChecker from '@/components/auth/AuthChecker';

export const metadata: Metadata = {
  title: {
    template: '%s | Turismomza',
    default: 'Inicio | Turismomza',
  },
  description: 'Descubre lo mejor de Mendoza.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar scrollbar-thin text-sm md:text-base">
      <body className={`${rootFont.className} antialiased bg-gray-300`}>
        <Providers>
          <AuthChecker />
          <NextUIProvider>{children}</NextUIProvider>
        </Providers>
      </body>
    </html>
  );
}
