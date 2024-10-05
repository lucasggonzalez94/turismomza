import { Attraction } from '@/interfaces/attraction';
import { calculateAverageRating } from '@/utils/helpers';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { FC } from 'react';

import { IoStar } from 'react-icons/io5';

interface IPropsAttractionCard {
  attraction: Attraction;
}

const AttractionCard: FC<IPropsAttractionCard> = ({ attraction }) => {
  const { title, category, images, comments } = attraction;
  const averageRating = calculateAverageRating(comments);
  const imageCard = images?.length ? images[0]?.url : null;

  return (
    <div className="flex flex-col rounded-md w-80 bg-white overflow-hidden border border-gray-300">
      {imageCard ? (
        <Image
          src={imageCard}
          alt={`Foto ${title}`}
          width={300}
          height={200}
          className="object-cover w-full h-44"
        />
      ) : (
        <Image
          src="/images/default-image.jpg"
          alt="No image"
          width={300}
          height={200}
          className="object-cover w-full h-44"
        />
      )}
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-col">
          <h3 className="font-bold line-clamp-1">{title}</h3>
          <span className="text-tiny text-gray-400">{category}</span>
        </div>
        <hr />
        <div className="flex justify-between items-center">
          <Button color="primary">Ver más</Button>
          <div className="flex flex-col text-end">
            <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
              <IoStar className="mb-[2px]" /> {averageRating}
            </span>
            <span className="text-tiny text-gray-400">
              {`(${comments?.length} comentarios)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
