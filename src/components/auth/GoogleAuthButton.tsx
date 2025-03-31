'use client';

import React from 'react';
import { Button } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';

const GoogleAuthButton = () => {
  const handleGoogleLogin = () => {
    // Redireccionar al endpoint de autenticación de Google
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Button
      color="primary"
      className="w-full font-bold bg-white border border-gray-400 text-black"
      startContent={<FcGoogle size={30} />}
      onClick={handleGoogleLogin}
    >
      Ingresar con Google
    </Button>
  );
};

export default GoogleAuthButton;
