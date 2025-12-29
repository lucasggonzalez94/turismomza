'use client';

import React, { useState, useCallback } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { unlinkGoogleAccount } from '@/services/auth/unlink-google';
import { Button } from '@/components/ui/Button';

interface GoogleLinkButtonProps {
  hasGoogleAccount: boolean;
  hasPassword?: boolean;
}

const GoogleLinkButton: React.FC<GoogleLinkButtonProps> = ({
  hasGoogleAccount,
  hasPassword = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleGoogleLink = useCallback(() => {
    try {
      setIsLoading(true);
      const isProduction = process.env.NODE_ENV === 'production';
      const baseUrl = isProduction
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:3001/api';
      const googleAuthUrl = `${baseUrl}/auth/google?linking=true`;

      window.location.href = googleAuthUrl;

      setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          setIsLoading(false);
          toast.error('No se pudo conectar con Google. Intente nuevamente.');
        }
      }, 5000);
    } catch {
      setIsLoading(false);
      toast.error('Ocurrió un error al intentar conectar con Google');
    }
  }, []);

  const handleGoogleUnlink = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedUser = await unlinkGoogleAccount();
      setUser(updatedUser);
      toast.success('Cuenta de Google desvinculada correctamente');
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          'Error al desvincular la cuenta de Google',
      );
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  if (hasGoogleAccount && !hasPassword) {
    return null;
  }

  if (hasGoogleAccount) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleGoogleUnlink}
        disabled={isLoading}
      >
        <span className="flex items-center gap-2">
          <FcGoogle size={20} />
          {isLoading ? 'Desvinculando...' : 'Desvincular cuenta de Google'}
        </span>
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleGoogleLink}
      disabled={isLoading}
    >
      <span className="flex items-center gap-2">
        <FcGoogle size={20} />
        {isLoading ? 'Conectando...' : 'Vincular cuenta de Google'}
      </span>
    </Button>
  );
};

export default GoogleLinkButton;
