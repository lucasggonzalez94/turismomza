'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/store';

const NavigationTracker = () => {
  const pathname = usePathname();
  const setLastPath = useStore((state) => state.setLastPath);

  useEffect(() => {
    if (!pathname.startsWith('/auth')) {
      setLastPath(pathname);
    }
  }, [pathname, setLastPath]);

  return null;
};

export default NavigationTracker;
