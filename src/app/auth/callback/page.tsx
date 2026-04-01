'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import useNavigation from '@/hooks/useNavigation';
import { useNavigationStore } from '@/store/navigationStore';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleNavigation } = useNavigation();
  const lastPath = useNavigationStore((state) => state.lastPath);

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      toast.success('Inicio de sesión exitoso');
      handleNavigation(lastPath || '/');
    } else if (error) {
      toast.error('Error al iniciar sesión con Google');
      router.push('/login');
    } else {
      router.push('/login');
    }
  }, [searchParams, router, handleNavigation, lastPath]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <p>Procesando autenticación...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full w-full">
          <p>Cargando...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
