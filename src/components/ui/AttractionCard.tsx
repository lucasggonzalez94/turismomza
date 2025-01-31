'use client';

import { FC, useEffect, useState } from 'react';
import { Attraction } from '@/interfaces/attraction';
import { addFavoriteService } from '@/services/attractions/add-favorite';
import { useStore } from '@/store/store';
import { calculateAverageRating, formatPrice } from '@/utils/helpers';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { IoHeart, IoHeartOutline, IoStar } from 'react-icons/io5';
import { User } from '@/interfaces/user';

interface IPropsAttractionCard {
  user: User | null;
  attraction: Attraction;
}

const AttractionCard: FC<IPropsAttractionCard> = ({ user, attraction }) => {
  const {
    id,
    title,
    slug,
    category,
    images,
    reviews,
    isFavorite,
    advertisements,
    price,
    currencyPrice,
  } = attraction;

  const averageRating = calculateAverageRating(reviews);
  const imageCard = images?.length ? images[0]?.url : null;

  const pathname = usePathname();
  const router = useRouter();
  const setLastPath = useStore((state) => state.setLastPath);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const [favorite, setFavorite] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setLastPath(pathname);
      handleNavigation('/auth/login');
      return;
    }
    try {
      await addFavoriteService(id);
      setFavorite((prev) => !prev);
    } catch {
      notify();
    }
  };

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  return (
    <div
      className={`flex flex-col rounded-lg w-full bg-white overflow-hidden border cursor-pointer transition-transform duration-300 transform hover:scale-105 ${advertisements?.length ? 'border-yellow-500 border-2' : 'border-gray-300'}`}
      onClick={() => handleNavigation(`/attractions/${slug}`)}
    >
      <div className="relative">
        {advertisements?.length ? (
          <div className="absolute left-2 top-2 flex items-center gap-1 bg-yellow-500 rounded-sm p-1">
            <IoStar size={12} className="mb-[2px]" />
            <span className="text-tiny">Contenido destacado</span>
          </div>
        ) : null}
        <Button
          isIconOnly
          className="absolute right-2 top-2 shadow-md"
          onClick={handleFavorite}
        >
          {favorite ? (
            <IoHeart size={20} className="text-red-600" />
          ) : (
            <IoHeartOutline size={20} />
          )}
        </Button>
        {imageCard ? (
          <Image
            src={imageCard}
            alt={`Foto ${title}`}
            width={300}
            height={200}
            className="object-cover w-full h-full max-h-64"
            // TODO: Modificar si se carga
            priority
          />
        ) : (
          <Image
            src="/images/default-image.jpg"
            alt="No image"
            width={300}
            height={200}
            className="object-cover w-full h-full max-h-64"
            priority
          />
        )}
      </div>

      <div className="flex flex-col gap-2 p-3 w-full">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center gap-4">
            <h3 className="font-bold line-clamp-1 text-sm lg:text-md">
              {title}
            </h3>
            <span className="font-bold text-gray-500 text-sm">
              {price && currencyPrice
                ? formatPrice(price, currencyPrice)
                : 'Gratis'}
            </span>
          </div>
          <span className="text-tiny text-gray-400">{category}</span>
        </div>

        <hr className="w-full" />

        <div className="flex justify-between items-center">
          <Button
            color="primary"
            size="sm"
            onPress={() => handleNavigation(`/attractions/${slug}`)}
          >
            Detalle
          </Button>
          <div className="flex flex-col justify-between items-end h-full w-full">
            <div className="flex flex-col justify-end h-full text-end">
              {reviews?.length ? (
                <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
                  <IoStar className="mb-[2px]" /> {averageRating}
                </span>
              ) : null}
              <span className="text-tiny text-gray-400">
                {reviews?.length
                  ? `(${reviews?.length} opiniones)`
                  : 'Sin opiniones'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={10000} />
    </div>
  );
};

export default AttractionCard;
