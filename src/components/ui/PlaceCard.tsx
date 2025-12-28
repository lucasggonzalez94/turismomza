'use client';

import { FC, useEffect, useState } from 'react';
import { IPlace } from '@/interfaces/place';
import { addFavoriteService } from '@/services/places/add-favorite';
import { calculateAverageRating, formatPrice } from '@/utils/helpers';
import { Button, Tooltip } from '@nextui-org/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import {
  IoHeart,
  IoHeartOutline,
  IoStar,
  IoLocationOutline,
  IoChevronForward,
} from 'react-icons/io5';
import { IUser } from '@/interfaces/user';
import useNavigation from '@/hooks/useNavigation';
import { useNavigationStore } from '@/store/navigationStore';

interface IPropsPlaceCard {
  user: IUser | null;
  place: IPlace;
}

const PlaceCard: FC<IPropsPlaceCard> = ({ user, place }) => {
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
    location,
  } = place;

  const averageRating = calculateAverageRating(reviews);
  const imageCard = images?.length ? images[0]?.url : null;

  const { handleNavigation } = useNavigation();
  const pathname = usePathname();
  const { setLastPath, setBackPath } = useNavigationStore((state) => state);

  const [favorite, setFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    imageCard || '/images/default-image.webp',
  );

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
      toast.success(
        favorite ? 'Eliminado de favoritos' : 'Añadido a favoritos',
      );
    } catch {
      toast.error('¡Algo salió mal! Vuelve a intentarlo más tarde');
    }
  };

  useEffect(() => {
    setFavorite(isFavorite);
    setImgSrc(imageCard || '/images/default-image.webp');
  }, [isFavorite, imageCard]);

  const handleNavigateToDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleNavigation(`/places/${slug}`);
    setBackPath(pathname);
  };

  const borderClass = advertisements?.length
    ? 'border-yellow-500 border-2'
    : 'border-gray-300';

  return (
    <div
      className={`w-full bg-white overflow-hidden border rounded-lg cursor-pointer ${borderClass} md:flex-col md:transition-transform md:duration-300 md:transform md:hover:scale-105 flex h-28 sm:h-auto`}
      onClick={handleNavigateToDetail}
    >
      {/* Sección de imagen */}
      <div className="relative h-full w-24 flex-shrink-0 md:w-full md:h-auto">
        {advertisements?.length ? (
          <div className="absolute left-1 top-1 md:left-2 md:top-2 flex items-center gap-1 bg-yellow-500 rounded-md p-[2px] md:p-1 z-10">
            <IoStar size={8} className="md:mb-[2px] md:text-[12px]" />
            <span className="text-[8px] md:text-tiny">
              {window.innerWidth < 640 ? 'Destacado' : 'Contenido destacado'}
            </span>
          </div>
        ) : null}

        <div className="hidden md:block">
          <Tooltip
            content={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Button
              isIconOnly
              className="absolute right-2 top-2 shadow-md z-10"
              onClick={handleFavorite}
              aria-label={
                favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'
              }
            >
              {favorite ? (
                <IoHeart size={20} className="text-red-600" />
              ) : (
                <IoHeartOutline size={20} />
              )}
            </Button>
          </Tooltip>
        </div>

        <Image
          src={imgSrc}
          alt={
            imageCard
              ? `${title} - ${category} en ${location || 'Mendoza'}`
              : `${title} - Sin imagen disponible`
          }
          width={600}
          height={600}
          className="object-cover w-full h-full sm:max-h-48 md:max-h-56"
          loading="eager"
          onError={() => setImgSrc('/images/default-image.webp')}
        />
      </div>

      <div className="flex flex-col justify-between p-2 flex-grow md:hidden">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex-grow pr-2">
              <h3 className="font-bold line-clamp-1 text-sm">{title}</h3>
              <span className="text-tiny text-gray-600">{category}</span>
              {location && (
                <span className="text-tiny text-gray-600 flex items-center">
                  <IoLocationOutline size={10} className="mr-1" />
                  <span className="line-clamp-1">{location}</span>
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-700 text-xs whitespace-nowrap">
                {price && currencyPrice
                  ? formatPrice(price, currencyPrice)
                  : 'Gratis'}
              </span>
              {reviews?.length ? (
                <span className="font-bold text-trinidad-600 flex items-center gap-1 text-xs">
                  <IoStar className="mb-[1px]" /> {averageRating}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="min-w-0 p-1"
            onClick={handleFavorite}
            aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {favorite ? (
              <IoHeart size={18} className="text-red-600" />
            ) : (
              <IoHeartOutline size={18} />
            )}
          </Button>
          <IoChevronForward size={16} className="text-gray-400" />
        </div>
      </div>

      <div className="hidden md:flex md:flex-col md:gap-2 md:p-3 md:w-full">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center gap-4">
            <h3 className="font-bold line-clamp-1 text-sm lg:text-md">
              {title}
            </h3>
            <span className="font-bold text-gray-700 text-sm">
              {price && currencyPrice
                ? formatPrice(price, currencyPrice)
                : 'Gratis'}
            </span>
          </div>
          <span className="text-tiny text-gray-600">{category}</span>
          {location && (
            <span className="text-tiny text-gray-600 flex items-center mt-1">
              <IoLocationOutline size={12} className="mr-1" />
              {location}
            </span>
          )}
        </div>

        <hr className="w-full my-1" />

        <div className="flex justify-between items-center">
          <Button
            color="primary"
            size="sm"
            className="min-w-20"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation(`/places/${slug}`);
              setBackPath(pathname);
            }}
          >
            Ver detalle
          </Button>
          <div className="flex flex-col justify-between items-end h-full w-full">
            <div className="flex flex-col justify-end h-full text-end">
              {reviews?.length ? (
                <span className="font-bold text-trinidad-600 flex justify-end items-center gap-1">
                  <IoStar className="mb-[2px]" /> {averageRating}
                </span>
              ) : null}
              <span className="text-tiny text-gray-600">
                {reviews?.length
                  ? `(${reviews?.length} ${reviews?.length === 1 ? 'opinión' : 'opiniones'})`
                  : 'Sin opiniones'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
