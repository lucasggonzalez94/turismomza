import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const {
      isAuthenticated,
      setIsAuthenticated,
      setUser,
      setAuthProvider,
      checkAuth,
    } = useAuthStore();

    useEffect(() => {
      const verifyAuthentication = async () => {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
        if (!isAuth) {
          router.replace('/auth/login');
        }
      };

      verifyAuthentication();
    }, [checkAuth, router, setAuthProvider, setIsAuthenticated, setUser]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
