'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import useNavigation from '@/hooks/useNavigation';
import { useNavigationStore } from '@/store/navigationStore';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuthStore();
  const { handleNavigation } = useNavigation();
  const lastPath = useNavigationStore((state) => state.lastPath);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    if (accessToken) {
      setAccessToken(accessToken);
      handleNavigation(lastPath);
    } else {
      handleNavigation('/auth/login');
    }
  }, [searchParams, setAccessToken, handleNavigation, lastPath]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Authenticating...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
