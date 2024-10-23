'use client';

import { FC, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@nextui-org/react';
import { IoHeart, IoHeartOutline, IoShareSocialOutline } from 'react-icons/io5';
import useAuth from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { addFavoriteService } from '@/services/attractions/add-favorite';

interface IPropsButtonsHeaderAttraction {
  attractionId: string;
  isFavorite: boolean;
}

const ButtonsHeaderAttraction: FC<IPropsButtonsHeaderAttraction> = ({
  attractionId,
  isFavorite,
}) => {
  const [favorite, setFavorite] = useState(false);

  const verified = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const setLastPath = useStore((state) => state.setLastPath);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const handleFavorite = async () => {
    if (!verified) {
      setLastPath(pathname);
      router.push('/auth/login');
      return;
    }
    try {
      await addFavoriteService(attractionId);
      setFavorite((prev) => !prev);
    } catch {
      notify();
    }
  };

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          color="default"
          variant="ghost"
          isIconOnly
          onClick={handleFavorite}
        >
          {favorite ? (
            <IoHeart className="text-red-600" size={25} />
          ) : (
            <IoHeartOutline size={25} />
          )}
        </Button>
        <Button color="default" variant="ghost" isIconOnly onClick={() => {}}>
          <IoShareSocialOutline size={25} />
        </Button>
        <Button color="primary" onClick={() => {}}>
          Consultar
        </Button>
      </div>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default ButtonsHeaderAttraction;
