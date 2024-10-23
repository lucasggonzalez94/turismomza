'use client';

import { FC, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@nextui-org/react';
import {
  IoAt,
  IoCall,
  IoCloud,
  IoHeart,
  IoHeartOutline,
  IoLogoInstagram,
  IoShareSocialOutline,
} from 'react-icons/io5';
import { AiOutlineFacebook } from 'react-icons/ai';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { addFavoriteService } from '@/services/attractions/add-favorite';
import { User } from '@/interfaces/user';
import CustomModal from '../ui/CustomModal';
import Link from 'next/link';

interface Contact {
  contactNumber?: string | null;
  email?: string | null;
  webSite?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}
interface IPropsButtonsHeaderAttraction {
  user: User | null;
  attractionId: string;
  isFavorite: boolean;
  contact: Contact;
}

const ButtonsHeaderAttraction: FC<IPropsButtonsHeaderAttraction> = ({
  user,
  attractionId,
  isFavorite,
  contact,
}) => {
  const [favorite, setFavorite] = useState(false);
  const [openModalContact, setOpenModalContact] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const setLastPath = useStore((state) => state.setLastPath);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const handleFavorite = async () => {
    if (!user) {
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
        <Button color="primary" onClick={() => setOpenModalContact(true)}>
          Consultar
        </Button>
      </div>
      <ToastContainer autoClose={10000} />
      <CustomModal
        title="Medios de contacto"
        isOpen={openModalContact}
        onOpenChange={setOpenModalContact}
      >
        <div className="flex flex-col gap-7 p-5">
          {contact?.contactNumber && (
            <div className="flex gap-2 items-center">
              <IoCall size={25} className="text-[#E95718]" />
              <span>{contact?.contactNumber}</span>
            </div>
          )}
          {contact?.email && (
            <div className="flex gap-2 items-center">
              <IoAt size={25} className="text-[#E95718]" />
              <span>{contact?.email}</span>
            </div>
          )}
          {contact?.webSite && (
            <div className="flex gap-2 items-center">
              <IoCloud size={25} className="text-[#E95718]" />
              <Link href={contact?.webSite} className="hover:underline">
                {contact?.webSite}
              </Link>
            </div>
          )}
          {contact?.instagram && (
            <div className="flex gap-2 items-center">
              <IoLogoInstagram size={25} className="text-[#E95718]" />
              <Link href={contact?.instagram} className="hover:underline">
                {contact?.instagram}
              </Link>
            </div>
          )}
          {contact?.facebook && (
            <div className="flex gap-2 items-center">
              <AiOutlineFacebook size={25} className="text-[#E95718]" />
              <Link href={contact?.facebook} className="hover:underline">
                {contact?.facebook}
              </Link>
            </div>
          )}
        </div>
      </CustomModal>
    </>
  );
};

export default ButtonsHeaderAttraction;
