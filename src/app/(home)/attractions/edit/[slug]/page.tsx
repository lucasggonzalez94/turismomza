import { getAttractionBySlugService } from '@/services/attractions/get-attraction-by-slug';
import AttractionForm from '@/components/attractions/AttractionForm';
import { notFound } from 'next/navigation';

interface IPropsEditAttractionPage {
  params: {
    slug: string;
  };
}

const EditAttractionPage = async ({ params }: IPropsEditAttractionPage) => {
  const { slug } = params;

  const attraction = await getAttractionBySlugService(slug);

  if (!attraction) {
    notFound();
  }

  const formData = {
    name: attraction.title,
    description: attraction.description,
    category: attraction.category,
    services: attraction.services,
    price: attraction.price || undefined,
    currency: attraction.currencyPrice || 'ars',
    address: JSON.parse(attraction.location),
    website: attraction.webSite,
    instagram: attraction.instagram,
    facebook: attraction.facebook,
    phonenumber: attraction.contactNumber,
    email: attraction.email,
    schedule: JSON.parse(attraction.schedule || ''),
    images: attraction.images,
  };

  return (
    <div className="flex flex-col flex-grow gap-6 py-8 px-[20%]">
      <h2 className="font-bold text-3xl">Editar publicación</h2>
      <AttractionForm
        isEditing={true}
        dataAttraction={formData}
        attractionId={attraction.id}
      />
    </div>
  );
};

export default EditAttractionPage;
