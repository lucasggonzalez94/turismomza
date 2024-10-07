'use client';

import { verifyToken } from '@/services/auth/verifyToken';
import { useEffect, useState } from 'react';

const useAuth = () => {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await verifyToken();
        setVerified(true);
      } catch {
        setVerified(false);
      }
    };

    fetchUser();
  }, []);

  return verified;
};

export default useAuth;
