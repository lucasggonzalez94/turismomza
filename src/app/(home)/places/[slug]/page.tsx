import PlacePageClient from '@/components/places/PlacePageClient';
import Chevron from '@/components/ui/Chevron';
import { getPlaceBySlugService } from '@/services/places/get-place-by-slug';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const place = await getPlaceBySlugService(slug);

  return {
    title: `${place?.title}`,
    description: place?.description,
    openGraph: {
      title: `${place?.title} | Turismomza`,
      description: place?.description,
      images: [place?.images[0]?.url],
    },
  };
}

export default async function PlacePage({ params }: Props) {
  const { slug } = params;

  return (
    <>
      <Chevron />
      <PlacePageClient slug={slug} />
    </>
  );
}
