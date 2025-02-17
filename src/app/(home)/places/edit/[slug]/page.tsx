import { getPlaceBySlugService } from '@/services/places/get-place-by-slug';
import PlaceForm from '@/components/places/PlaceForm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface IPropsEditPlacePage {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Editar',
  description: '...',
};

const EditPlacePage = async ({ params }: IPropsEditPlacePage) => {
  const { slug } = params;

  const place = await getPlaceBySlugService(slug);

  if (!place) {
    notFound();
  }

  const formData = {
    name: place.title,
    description: place.description,
    category: place.category,
    services: place.services,
    price: place.price || undefined,
    currency: place.currencyPrice || 'ars',
    address: place.location,
    website: place.website,
    instagram: place.instagram,
    facebook: place.facebook,
    phonenumber: place?.contactNumber
      ? place?.contactNumber.slice(3)
      : place?.contactNumber,
    email: place.email,
    schedule: JSON.parse(place.schedule || ''),
    images: place.images,
  };

  return (
    <div className="flex flex-col items-center md:items-start flex-grow gap-6 py-8 px-4 xl:px-[20%]">
      <h2 className="font-bold text-xl">Editar publicación</h2>
      <PlaceForm isEditing={true} dataPlace={formData} placeId={place.id} />
    </div>
  );
};

export default EditPlacePage;
