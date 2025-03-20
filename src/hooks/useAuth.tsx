import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { refreshAccessToken } from '@/services/auth/refreshToken';

export function useAuth() {
  const { accessToken, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      refreshAccessToken().then((newToken) => {
        if (newToken) setAccessToken(newToken);
      });
    }
  }, [accessToken, setAccessToken]);

  return { accessToken, logout };
}
