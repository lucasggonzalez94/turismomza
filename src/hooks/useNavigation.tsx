'use client';

import { useRouter } from 'next/navigation';

const useNavigation = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return { handleNavigation };
};

export default useNavigation;
