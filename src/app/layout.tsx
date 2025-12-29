import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { rootFont } from '../config/fonts';
import './globals.css';
import './fonts.css';

import Providers from '@/store/Providers';
import Spinner from '@/components/ui/Spinner/Spinner';

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
    <html lang="es" className="scrollbar scrollbar-thin text-sm md:text-base">
      <body
        className={`${rootFont.className} antialiased bg-[#d9d9d9] box-border`}
      >
        <Providers>
          <Spinner />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
