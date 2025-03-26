'use client';

import { FC, ReactNode, useEffect } from 'react';
import SocketProvider from './SocketProvider';
import { useAuthStore } from './authStore';
import { SessionProvider, useSession } from 'next-auth/react';

interface Props {
  children: ReactNode;
}

const AuthStateManager = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const { updateAuthState, authProvider } = useAuthStore();

  useEffect(() => {
    if (authProvider !== 'credentials') {
      if (status === 'authenticated' && session?.user?.id) {
        const token = session.accessToken;
        if (token) {
          updateAuthState(session.user.id, token);
        }
      }
    }
  }, [status, session, updateAuthState, authProvider]);

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
