import { getPlaceBySlugService } from '@/services/places/get-place-by-slug';
import PlaceForm from '@/components/places/PlaceForm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Chevron from '@/components/ui/Chevron';

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

  // Generamos un key único basado en los datos para forzar la recreación del componente
  const formKey = `place-form-${place.id}-${Date.now()}`;

  return (
    <>
      <Chevron />
      <div className="flex flex-col items-center md:items-start flex-grow gap-6 pb-4 px-4 lg:px-[20%] xl:px-[30%]">
        <h2 className="font-bold text-xl">Editar publicación</h2>
        <PlaceForm
          key={formKey}
          isEditing={true}
          dataPlace={formData}
          placeId={place.id}
        />
      </div>
    </>
  );
};

export default EditPlacePage;
