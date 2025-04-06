'use client';

import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

const GoogleAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    try {
      setIsLoading(true);
      const isProduction = process.env.NODE_ENV === 'production';
      const baseUrl = isProduction
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:3001/api';
      const googleAuthUrl = `${baseUrl}/auth/google`;
      setTimeout(() => {
        window.location.href = googleAuthUrl;
      }, 100);
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
  };

  return (
    <Button
      color="primary"
      className="w-full font-bold bg-white border border-gray-400 text-black"
      startContent={<FcGoogle size={30} />}
      onPress={handleGoogleLogin}
      isLoading={isLoading}
      type="button"
    >
      Ingresar con Google
    </Button>
  );
};

export default GoogleAuthButton;
