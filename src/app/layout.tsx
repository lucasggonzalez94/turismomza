import type { Metadata } from 'next';
import { rootFont } from '../config/fonts';
import './globals.css';
import './fonts.css';

import { NextUIProvider } from '@nextui-org/react';

export const metadata: Metadata = {
  title: 'Turismomza | Home',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar scrollbar-thin text-sm md:text-base">
      <body className={`${rootFont.className} antialiased`}>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
