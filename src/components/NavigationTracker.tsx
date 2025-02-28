'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationStore } from '@/store/navigationStore';

const NavigationTracker = () => {
  const pathname = usePathname();
  const setLastPath = useNavigationStore((state) => state.setLastPath);

  useEffect(() => {
    if (!pathname.startsWith('/auth')) {
      setLastPath(pathname);
    }
  }, [pathname, setLastPath]);

  return null;
};

export default NavigationTracker;
