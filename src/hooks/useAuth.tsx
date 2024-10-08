'use client';

import { verifyToken } from '@/services/auth/verifyToken';
import { useStore } from '@/store/store';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const setUser = useStore((state) => state.setUser);

  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await verifyToken();
        setUser(user);
        setVerified(true);
      } catch {
        setVerified(false);
      }
    };

    fetchUser();
  }, [setUser]);

  return verified;
};

export default useAuth;
