'use client';

import { FC, ReactNode, useEffect } from 'react';
import SocketProvider from './SocketProvider';
import { useAuthStore } from './authStore';
import { usePathname } from 'next/navigation';

interface Props {
  children: ReactNode;
}

const Providers: FC<Props> = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]);

  return <SocketProvider>{children}</SocketProvider>;
};

export default Providers;
