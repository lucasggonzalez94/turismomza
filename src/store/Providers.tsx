'use client';

import { FC, ReactNode, useEffect } from 'react';
import SocketProvider from './SocketProvider';
import { useAuthStore } from './authStore';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

interface Props {
  children: ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]);

  return (
    <SessionProvider>
      <SocketProvider>{children}</SocketProvider>
    </SessionProvider>
  );
};

export default Providers;
