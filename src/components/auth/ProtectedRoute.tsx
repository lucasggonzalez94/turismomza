'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, validated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && validated) {
      // Redirigir al login si no está autenticado
      router.push('/auth/login');
    }
  }, [validated, isAuthenticated, router]);

  // Si está autenticado, mostrar el contenido protegido
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
