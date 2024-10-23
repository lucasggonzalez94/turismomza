'use client';

import Image from 'next/image';
import { calculateAverageRating, formatPrice } from '@/utils/helpers';
import { IoStar } from 'react-icons/io5';
import ButtonsHeaderAttraction from './ButtonsHeaderAttraction';
import MapRoute from './MapRoute';
import AccordionCustom from '../ui/AccordionCustom';
import Reviews from './Reviews';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Attraction } from '@/interfaces/attraction';
import { getAttractionBySlugService } from '@/services/attractions/get-attraction-by-slug';
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import Spinner from '../ui/Spinner/Spinner';

interface IPropsAttractionPageClient {
  slug: string;
}

const AttractionPageClient: FC<IPropsAttractionPageClient> = ({ slug }) => {
  const [attraction, setAttraction] = useState<Partial<Attraction>>({});
  const [averageRating, setAverageRating] = useState(0);
  const [servicesAccordion, setServicesAccordion] = useState<
    {
      title: string;
      content: ReactNode;
    }[]
  >([]);

  const { user, loading, setLoading } = useStore((state) => state);
  const router = useRouter();

  const {
    id,
    title,
    category,
    price,
    currencyPrice,
    reviews,
    images,
    description,
    services,
    isFavorite,
  } = attraction;

  const getAttraction = async () => {
    try {
      const response = await getAttractionBySlugService(slug, user?.id);
      setAttraction(response);
    } catch {
      router.push('/not-found');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (slug) {
      getAttraction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    if (user) {
      getAttraction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (reviews?.length) {
      setAverageRating(calculateAverageRating(reviews));
    }
    if (services?.length) {
      setServicesAccordion([
        {
          title: 'Servicios',
          content: (
            <ul className="list-disc list-inside">
              {services?.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          ),
        },
      ]);
    }
  }, [reviews, services]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col flex-grow gap-4 p-8 md:p-12">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl">{title}</h1>
          <h2 className="text-sm text-gray-500">{category}</h2>
          {price && currencyPrice && (
            <span>{formatPrice(price, currencyPrice)}</span>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          {!reviews?.length ? (
            <div className="text-sm text-gray-500">Sin opiniones</div>
          ) : (
            <div className="flex gap-1 items-center">
              <div className="text-sm text-gray-500">{`(${reviews.length} opiniones)`}</div>
              <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
                <IoStar className="mb-[2px]" /> {averageRating}
              </span>
            </div>
          )}
          <ButtonsHeaderAttraction
            user={user}
            isFavorite={isFavorite || false}
            attractionId={id || ''}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="grid grid-cols-7 grid-rows-2 gap-4 w-2/3 max-h-[700px]">
          {/* TODO: Quitar despues de las pruebas */}
          {!images?.length ? (
            <>
              <Image
                src="/images/default-image.jpg"
                alt={`Imágen`}
                width={300}
                height={200}
                className="w-full h-full object-cover object-center col-span-4 cursor-pointer hover:brightness-75"
              />
              <Image
                src="/images/default-image.jpg"
                alt={`Imágen`}
                width={300}
                height={200}
                className="w-full h-full object-cover object-center col-span-3 cursor-pointer hover:brightness-75"
              />
              <Image
                src="/images/default-image.jpg"
                alt={`Imágen`}
                width={300}
                height={200}
                className="w-full h-full object-cover object-center col-span-3 cursor-pointer hover:brightness-75"
              />
              <Image
                src="/images/default-image.jpg"
                alt={`Imágen`}
                width={300}
                height={200}
                className="w-full h-full object-cover object-center col-span-4 cursor-pointer hover:brightness-75"
              />
            </>
          ) : null}
          {images
            ?.slice(0, 3)
            ?.map((img, index) => (
              <Image
                key={img?.public_id}
                src={img?.url}
                alt={`Imágen ${index}`}
                width={300}
                height={200}
                defaultValue="/images/default-image.jpg"
                className={`w-full h-full object-cover object-center cursor-pointer hover:brightness-75 ${index === 1 || index === 4 ? 'col-span-4' : 'col-span-3'}`}
              />
            ))}
        </div>
        <div className="w-1/3">
          <MapRoute />
        </div>
      </div>
      <p className="border-b border-gray-300 pb-4">{description}</p>
      {services?.length ? (
        <div className="border-b border-gray-300 pb-4">
          <AccordionCustom items={servicesAccordion} bold />
        </div>
      ) : null}
      <Reviews
        reviews={reviews || []}
        attractionId={id || ''}
        creatorId={user?.id}
      />
    </div>
  );
};

export default AttractionPageClient;
