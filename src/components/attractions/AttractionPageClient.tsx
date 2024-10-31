'use client';

import Image from 'next/image';
import {
  calculateAverageRating,
  formatPrice,
  mapServices,
} from '@/utils/helpers';
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
import SliderCarousel from '../ui/SliderCarousel/SliderCarousel';
import { ISchedule } from '@/interfaces/schedule';

interface IPropsAttractionPageClient {
  slug: string;
}

const IMAGES = [
  '/images/portones.jpg',
  '/images/puente-uspallata.jpg',
  '/images/portada_auth.jpeg',
  '/images/portones.jpg',
];

const AttractionPageClient: FC<IPropsAttractionPageClient> = ({ slug }) => {
  const [attraction, setAttraction] = useState<Partial<Attraction>>({});
  const [averageRating, setAverageRating] = useState(0);
  const [servicesAccordion, setServicesAccordion] = useState<
    {
      title: string;
      content: ReactNode;
    }[]
  >([]);
  const [scheduleAccordion, setScheduleAccordion] = useState<
    {
      title: string;
      content: ReactNode;
    }[]
  >([]);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

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
    contactNumber,
    email,
    webSite,
    instagram,
    facebook,
    creatorId,
    location,
    schedule,
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

  const handleImageClick = (index: number) => {
    setInitialIndex(index);
    setIsCarouselOpen(true);
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
    const mappedServices = mapServices(services || []);
    if (mappedServices?.length) {
      setServicesAccordion([
        {
          title: 'Servicios',
          content: (
            <ul className="list-disc list-inside">
              {mappedServices?.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          ),
        },
      ]);
    }
  }, [reviews, services]);

  useEffect(() => {
    if (schedule) {
      const parsedSchedule: ISchedule = JSON.parse(JSON.parse(schedule));
      if (
        Object.entries(parsedSchedule)?.length &&
        typeof parsedSchedule === 'object'
      ) {
        setScheduleAccordion([
          {
            title: 'Horarios',
            content: (
              <ul className="list-disc list-inside">
                {Object.entries(parsedSchedule).map(
                  ([day, { open24hours, times }]) => (
                    <li key={day}>
                      <strong>{day}:</strong>{' '}
                      {open24hours ? (
                        <span>Abierto las 24 horas</span>
                      ) : (
                        <>
                          {times.map((time, index) => (
                            <span key={index}>
                              {time.from} - {time.to}
                            </span>
                          ))}
                        </>
                      )}
                    </li>
                  ),
                )}
              </ul>
            ),
          },
        ]);
      }
    }
  }, [schedule]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col flex-grow gap-4 p-4 md:p-12 relative">
      <div className="flex justify-between items-center border-b border-gray-300 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl">{title}</h1>
          <h2 className="text-sm text-gray-500">{category}</h2>
          {price && currencyPrice ? (
            <span>{formatPrice(price, currencyPrice)}</span>
          ) : null}
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
            contact={{
              contactNumber,
              email,
              webSite,
              instagram,
              facebook,
            }}
            attractionId={id}
            slug={slug}
            creatorId={creatorId}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="hidden md:grid grid-cols-7 grid-rows-2 gap-4 w-full lg:w-2/3 max-h-[700px]">
          {images
            ?.slice(0, 4)
            ?.map((img, index) => (
              <Image
                key={img?.public_id}
                src={img?.url}
                alt={`Imágen ${index}`}
                width={300}
                height={200}
                defaultValue="/images/default-image.jpg"
                className={`w-full h-full object-cover object-center cursor-pointer hover:brightness-75 ${index === 0 || index === 3 ? 'col-span-4' : 'col-span-3'}`}
                onClick={() => handleImageClick(index)}
              />
            ))}
        </div>
        <div className="w-full md:hidden h-[450px]">
          <SliderCarousel images={IMAGES} showPrevNextButtons />
        </div>
        <div className="w-full lg:w-1/3 min-h-[350px] rounded-lg overflow-hidden md:rounded-none">
          <MapRoute location={location || ''} />
        </div>
      </div>
      <p className="border-b border-gray-300 pb-4">{description}</p>
      {services?.length ? (
        <div className="border-b border-gray-300 pb-4">
          <AccordionCustom items={servicesAccordion} bold />
        </div>
      ) : null}
      {scheduleAccordion?.length ? (
        <div className="border-b border-gray-300 pb-4">
          <AccordionCustom items={scheduleAccordion} bold />
        </div>
      ) : null}
      <Reviews
        reviews={reviews || []}
        attractionId={id || ''}
        creatorId={creatorId}
      />
      {isCarouselOpen && images?.length && (
        <SliderCarousel
          images={images?.map((img) => img.url)}
          initialIndex={initialIndex}
          fullscreen
          showPrevNextButtons
          showDots
          onClose={() => setIsCarouselOpen(false)}
        />
      )}
    </div>
  );
};

export default AttractionPageClient;
