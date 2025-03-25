'use client';

import { Button } from '@nextui-org/react';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useNavigationStore } from '@/store/navigationStore';
import { useAuthStore } from '@/store/authStore';

const GoogleButton = () => {
  const [loading, setLoading] = useState(false);
  const lastPath = useNavigationStore((state) => state.lastPath);
  const { setAuthProvider } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signIn('google', {
        callbackUrl: lastPath,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Error al iniciar sesión con Google');
      } else {
        setAuthProvider('google');
      }
    } catch {
      toast.error('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      color="primary"
      startContent={<FcGoogle size={30} />}
      className="w-full font-bold bg-white border border-gray-400 text-black"
      onPress={handleGoogleLogin}
      isLoading={loading}
    >
      Google
    </Button>
  );
};

export default GoogleButton;
