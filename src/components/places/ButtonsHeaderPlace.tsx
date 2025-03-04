'use client';

import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@nextui-org/react';
import {
  IoAt,
  IoCall,
  IoCloud,
  IoHeart,
  IoHeartOutline,
  IoLogoInstagram,
  IoShareSocialOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { AiOutlineFacebook } from 'react-icons/ai';
import { usePathname, useRouter } from 'next/navigation';
import { addFavoriteService } from '@/services/places/add-favorite';
import { IUser } from '@/interfaces/user';
import CustomModal from '../ui/CustomModal';
import Link from 'next/link';
import { deletePlaceService } from '@/services/places/delete-place';
import { useNavigationStore } from '@/store/navigationStore';

interface Contact {
  contactNumber?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}
interface IPropsButtonsHeaderPlace {
  user: IUser | null;
  slug: string;
  placeId?: string;
  creatorId?: string;
  isFavorite: boolean;
  contact: Contact;
}

const ButtonsHeaderPlace: FC<IPropsButtonsHeaderPlace> = ({
  user,
  slug,
  placeId,
  creatorId,
  isFavorite,
  contact,
}) => {
  const [favorite, setFavorite] = useState(false);
  const [openModalContact, setOpenModalContact] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const setLastPath = useNavigationStore((state) => state.setLastPath);

  const handleFavorite = async () => {
    if (!user) {
      setLastPath(pathname);
      router.push('/auth/login');
      return;
    }
    try {
      if (placeId) {
        await addFavoriteService(placeId);
        setFavorite((prev) => !prev);
      }
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
    }
  };

  const handleDelete = async () => {
    try {
      if (placeId) {
        setLoadingDelete(true);
        await deletePlaceService(placeId);
        router.push('/places');
      }
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEdit = () => {
    router.push(`/places/edit/${slug}`);
  };

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  return (
    <>
      <div className="flex items-center gap-2 w-full justify-end">
        <Button
          color="default"
          variant="ghost"
          isIconOnly
          onPress={handleFavorite}
        >
          {favorite ? (
            <IoHeart className="text-red-600" size={25} />
          ) : (
            <IoHeartOutline size={25} />
          )}
        </Button>
        <Button color="default" variant="ghost" isIconOnly onPress={() => {}}>
          <IoShareSocialOutline size={25} />
        </Button>
        {(contact?.contactNumber ||
          contact?.email ||
          contact?.website ||
          contact?.instagram ||
          contact?.facebook) && (
          <Button color="primary" onPress={() => setOpenModalContact(true)}>
            Contacto
          </Button>
        )}
        {user?.id === creatorId && (
          <Button color="primary" variant="ghost" onPress={handleEdit}>
            Editar publicación
          </Button>
        )}
        {user?.id === creatorId && (
          <Button
            color="danger"
            variant="ghost"
            isIconOnly
            onPress={() => setOpenModalDelete(true)}
          >
            <IoTrashOutline size={20} />
          </Button>
        )}
      </div>
      {/* Contacto */}
      <CustomModal
        title="Medios de contacto"
        isOpen={openModalContact}
        onOpenChange={setOpenModalContact}
        textButton="Aceptar"
      >
        <div className="flex flex-col gap-7 p-5">
          {contact?.contactNumber && (
            <div className="flex gap-2 items-center">
              <IoCall size={25} className="text-trinidad-600" />
              <Link
                href={`tel:${contact?.contactNumber}`}
                className="hover:underline"
              >
                {contact?.contactNumber}
              </Link>
            </div>
          )}
          {contact?.email && (
            <div className="flex gap-2 items-center">
              <IoAt size={25} className="text-trinidad-600" />
              <Link
                href={`mailto:${contact?.email}`}
                className="hover:underline"
              >
                {contact?.email}
              </Link>
            </div>
          )}
          {contact?.website && (
            <div className="flex gap-2 items-center">
              <IoCloud size={25} className="text-trinidad-600" />
              <Link
                href={contact?.website}
                className="hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact?.website}
              </Link>
            </div>
          )}
          {contact?.instagram && (
            <div className="flex gap-2 items-center">
              <IoLogoInstagram size={25} className="text-trinidad-600" />
              <Link
                href={contact?.instagram}
                className="hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact?.instagram}
              </Link>
            </div>
          )}
          {contact?.facebook && (
            <div className="flex gap-2 items-center">
              <AiOutlineFacebook size={25} className="text-trinidad-600" />
              <Link
                href={contact?.facebook}
                className="hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact?.facebook}
              </Link>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Eliminacion */}
      <CustomModal
        title="¿Estás seguro que deseas eliminar esta publicación?"
        isOpen={openModalDelete}
        onOpenChange={setOpenModalDelete}
        textButton="Estoy seguro"
        onAction={handleDelete}
        loadingAction={loadingDelete}
      />
    </>
  );
};

export default ButtonsHeaderPlace;
