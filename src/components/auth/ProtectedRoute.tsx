'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FC, ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.replace('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  return session ? <>{children}</> : null;
};

export default ProtectedRoute;
