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
  const { updateAuthState, accessToken } = useAuthStore((state) => state);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      updateAuthState(session.user.id, accessToken);
    } else if (status === 'unauthenticated') {
      updateAuthState(null, null);
    }
  }, [session, status, updateAuthState, accessToken]);

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
