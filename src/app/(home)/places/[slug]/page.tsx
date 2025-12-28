import { Metadata } from 'next';
import PlaceDetails from '@/components/places/PlaceDetails';
import Chevron from '@/components/ui/Chevron';
import Container from '@/components/ui/Container';
import { getPlaceBySlugService } from '@/services/places/get-place-by-slug';

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
      images:
        place?.images && place.images[0]?.url ? [place.images[0].url] : [],
    },
  };
}

export default async function PlacePage({ params }: Props) {
  const { slug } = params;

  return (
    <Container>
      <Chevron />
      <PlaceDetails slug={slug} />
    </Container>
  );
}
