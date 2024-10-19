import ButtonsHeaderAttraction from '@/components/attractions/ButtonsHeaderAttraction';
import Maps from '@/components/attractions/Maps';
import AccordionCustom from '@/components/ui/AccordionCustom/AccordionCustom';
import { getAttractionBySlugService } from '@/services/attractions/get-attraction-by-slug';
import { calculateAverageRating, formatPrice } from '@/utils/helpers';
import { Accordion, AccordionItem } from '@nextui-org/react';
import Image from 'next/image';
import { IoStar } from 'react-icons/io5';

interface Props {
  params: {
    slug: string;
  };
}

export default async function AttractionPage({ params }: Props) {
  const { slug } = params;

  const attraction = await getAttractionBySlugService(slug);

  const {
    title,
    category,
    price,
    currencyPrice,
    comments,
    images,
    description,
    services,
  } = attraction;
  const averageRating = calculateAverageRating(comments);

  const servicesAccordion = [
    {
      title: 'Servicios',
      content: (
        <ul className="list-disc list-inside">
          {services?.map((service, index) => <li key={index}>{service}</li>)}
        </ul>
      ),
    },
  ];

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
          {!comments.length ? (
            <div className="text-sm text-gray-500">Sin opiniones</div>
          ) : (
            <div className="flex gap-1 items-center">
              <div className="text-sm text-gray-500">{`(${comments.length} opiniones)`}</div>
              <span className="font-bold text-[#E95718] flex justify-end items-center gap-1">
                <IoStar className="mb-[2px]" /> {averageRating}
              </span>
            </div>
          )}
          <ButtonsHeaderAttraction />
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
          <Maps />
        </div>
      </div>
      <p className="border-b border-gray-300 pb-4">{description}</p>
      {services?.length ? (
        <div className="border-b border-gray-300 pb-4">
          <AccordionCustom items={servicesAccordion} />
        </div>
      ) : null}
    </div>
  );
}
