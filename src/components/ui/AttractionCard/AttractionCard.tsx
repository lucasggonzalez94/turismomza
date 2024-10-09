'use client';

import { Attraction } from '@/interfaces/attraction';
import { calculateAverageRating } from '@/utils/helpers';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { IoHeart, IoHeartOutline, IoStar } from 'react-icons/io5';

interface IPropsAttractionCard {
  attraction: Attraction;
}

const AttractionCard: FC<IPropsAttractionCard> = ({ attraction }) => {
  const {
    title,
    slug,
    category,
    images,
    comments,
    isFavorite,
    advertisements,
  } = attraction;

  const averageRating = calculateAverageRating(comments);
  const imageCard = images?.length ? images[0]?.url : null;

  const router = useRouter();

  const [favorite, setFavorite] = useState(isFavorite);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite((prev) => !prev);
    console.log('Favorito clicado');
  };

  return (
    <div
      className={`flex h-32 sm:h-auto sm:flex-col rounded-md w-[100%] bg-white overflow-hidden border cursor-pointer transition-transform duration-300 transform hover:scale-105 ${advertisements?.length ? 'border-yellow-500 border-2' : 'border-gray-300'}`}
      onClick={() => handleNavigation(`/${slug}`)}
    >
      <div className="relative flex justify-center items-center min-w-40">
        {advertisements?.length ? (
          <div className="absolute left-2 top-2 flex items-center gap-1 bg-yellow-500 rounded-sm p-1">
            <IoStar size={12} className="mb-[2px]" />
            <span className="text-tiny">Contenido destacado</span>
          </div>
        ) : null}
        <Button
          isIconOnly
          className="absolute right-2 top-2"
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
            className="object-cover w-full h-full"
            // TODO: Modificar si se carga
            priority
          />
        ) : (
          <Image
            src="/images/default-image.jpg"
            alt="No image"
            width={300}
            height={200}
            className="object-cover w-full h-full"
            priority
          />
        )}
      </div>

      <div className="flex items-center sm:items-start justify-between sm:flex-col sm:gap-2 p-3 w-full">
        <div className="flex flex-col w-full grow">
          <div className="flex justify-between items-center gap-4">
            <h3 className="font-bold line-clamp-1 text-lg md:text-sm lg:text-md xl:text-lg">
              {title}
            </h3>
            <span className="font-bold hidden sm:inline-block text-gray-500">
              1.3Km
            </span>
          </div>
          <span className="text-tiny text-gray-400">{category}</span>
        </div>

        <hr className="hidden w-full sm:inline-block" />

        <div className="flex justify-between items-center h-full min-w-28 sm:w-full">
          <Button
            color="primary"
            onClick={() => handleNavigation(`/${slug}`)}
            className="hidden sm:block"
          >
            Ver más
          </Button>
          <div className="flex flex-col justify-between items-end h-full w-full">
            <span className="font-bold sm:hidden text-gray-500">1.3Km</span>
            <div className="flex flex-col text-end">
              <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
                <IoStar className="mb-[2px]" /> {averageRating}
              </span>
              <span className="text-tiny text-gray-400">
                {`(${comments?.length} opiniones)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
