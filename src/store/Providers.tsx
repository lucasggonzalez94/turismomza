'use client';

import { FC, ReactNode, useEffect } from 'react';
import SocketProvider from './SocketProvider';
import { useAuthStore } from './authStore';
import { SessionProvider, useSession } from 'next-auth/react';

interface Props {
  children: ReactNode;
}

const AuthStateManager = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const updateAuthState = useAuthStore((state) => state.updateAuthState);

  // Actualizar el estado de autenticación cuando cambie la sesión
  useEffect(() => {
    updateAuthState(session);
  }, [session, updateAuthState]);

  return <>{children}</>;
};

const Providers: FC<Props> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthStateManager>
        <SocketProvider>{children}</SocketProvider>
      </AuthStateManager>
    </SessionProvider>
  );
};

export default Providers;
