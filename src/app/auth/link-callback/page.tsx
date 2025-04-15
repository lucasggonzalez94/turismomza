'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { linkGoogleAccount } from '@/services/auth/link-google';
import { useAuthStore } from '@/store/authStore';

export default function LinkGoogleCallbackPage() {
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const processGoogleLink = async () => {
      try {
        const success = searchParams.get('success');
        const googleId = searchParams.get('googleId');
        const error = searchParams.get('error');

        if (error) {
          toast.error('Error al vincular la cuenta de Google');
          router.push('/profile');
          return;
        }

        if (success === 'true' && googleId) {
          const updatedUser = await linkGoogleAccount(googleId);
          setUser(updatedUser);
          toast.success('Cuenta de Google vinculada correctamente');
        } else {
          toast.error('No se pudo vincular la cuenta de Google');
        }
      } catch (error: any) {
        toast.error(error.message || 'Error al vincular la cuenta de Google');
      } finally {
        setIsProcessing(false);
        router.push('/profile');
      }
    };

    processGoogleLink();
  }, [router, searchParams, setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {isProcessing ? 'Procesando...' : 'Redirigiendo...'}
        </h1>
        <p>
          {isProcessing
            ? 'Estamos vinculando tu cuenta de Google...'
            : 'Serás redirigido a tu perfil en unos segundos...'}
        </p>
      </div>
    </div>
  );
}
