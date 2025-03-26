import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { data: session } = useSession();
    const { isAuthenticated, accessToken } = useAuthStore();

    useEffect(() => {
      if (!session && !isAuthenticated && !accessToken) {
        router.replace('/auth/login');
      }
    }, [session, isAuthenticated, accessToken, router]);

    if (!session && !isAuthenticated && !accessToken) {
      return null; // O un componente de loading
    }

    return <WrappedComponent {...props} />;
  };
}
