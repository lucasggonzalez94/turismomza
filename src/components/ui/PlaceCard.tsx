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
import useWindowSize from '@/hooks/useWindowSize';

interface IPropsPlaceCard {
  user: IUser | null;
  place: IPlace;
  forceListView?: boolean;
  forceCardView?: boolean;
}

const PlaceCard: FC<IPropsPlaceCard> = ({
  user,
  place,
  forceListView,
  forceCardView,
}) => {
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
  const { width } = useWindowSize();

  const [favorite, setFavorite] = useState(false);
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    // Determinar si debemos usar vista de lista basado en props o tamaño de pantalla
    if (forceListView) {
      setIsListView(true);
    } else if (forceCardView) {
      setIsListView(false);
    } else {
      setIsListView(width < 640); // Usar vista de lista en móviles por defecto
    }
  }, [width, forceListView, forceCardView]);

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
  }, [isFavorite]);

  const handleNavigateToDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleNavigation(`/places/${slug}`);
    setBackPath(pathname);
  };

  // Vista de lista para móviles
  if (isListView) {
    return (
      <div
        className={`flex h-28 w-full bg-white overflow-hidden border rounded-lg cursor-pointer ${advertisements?.length ? 'border-yellow-500 border-2' : 'border-gray-300'}`}
        onClick={handleNavigateToDetail}
      >
        <div className="relative h-full w-24 flex-shrink-0">
          {advertisements?.length ? (
            <div className="absolute left-1 top-1 flex items-center gap-1 bg-yellow-500 rounded-sm p-[2px] z-10">
              <IoStar size={8} />
              <span className="text-[8px]">Destacado</span>
            </div>
          ) : null}
          {imageCard ? (
            <Image
              src={imageCard}
              alt={`${title} - ${category} en ${location || 'Mendoza'}`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              loading="eager"
            />
          ) : (
            <Image
              src="/images/default-image.webp"
              alt={`${title} - Sin imagen disponible`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
              loading="eager"
            />
          )}
        </div>

        <div className="flex flex-col justify-between p-2 flex-grow">
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex-grow pr-2">
                <h3 className="font-bold line-clamp-1 text-sm">{title}</h3>
                <span className="text-tiny text-gray-600">{category}</span>
                {location && (
                  <span className="text-tiny text-gray-600 flex items-center">
                    <IoLocationOutline
                      size={10}
                      className="mr-1 flex-shrink-0"
                    />
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
              aria-label={
                favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'
              }
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
      </div>
    );
  }

  // Vista de tarjeta para tablets y desktop (diseño original)
  return (
    <div
      className={`flex flex-col justify-between rounded-lg w-full bg-white overflow-hidden border cursor-pointer transition-transform duration-300 transform hover:scale-105 ${advertisements?.length ? 'border-yellow-500 border-2' : 'border-gray-300'}`}
      onClick={handleNavigateToDetail}
    >
      <div className="relative object-cover w-full h-full">
        {advertisements?.length ? (
          <div className="absolute left-2 top-2 flex items-center gap-1 bg-yellow-500 rounded-sm p-1 z-10">
            <IoStar size={12} className="mb-[2px]" />
            <span className="text-tiny">Contenido destacado</span>
          </div>
        ) : null}
        <Tooltip
          content={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Button
            isIconOnly
            className="absolute right-2 top-2 shadow-md z-10"
            onClick={handleFavorite}
            aria-label={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {favorite ? (
              <IoHeart size={20} className="text-red-600" />
            ) : (
              <IoHeartOutline size={20} />
            )}
          </Button>
        </Tooltip>
        {imageCard ? (
          <Image
            src={imageCard}
            alt={`${title} - ${category} en ${location || 'Mendoza'}`}
            width={300}
            height={200}
            className="object-cover w-full h-full max-h-48 sm:max-h-56"
            loading="eager"
          />
        ) : (
          <Image
            src="/images/default-image.webp"
            alt={`${title} - Sin imagen disponible`}
            width={300}
            height={200}
            className="object-cover w-full h-full max-h-48 sm:max-h-56"
            loading="eager"
          />
        )}
      </div>

      <div className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 w-full">
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
              <IoLocationOutline size={12} className="mr-1 flex-shrink-0" />
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
