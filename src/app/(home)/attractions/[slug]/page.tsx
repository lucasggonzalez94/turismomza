import AttractionPageClient from '@/components/attractions/AttractionPageClient';
import Chevron from '@/components/ui/Chevron';
import { getAttractionBySlugService } from '@/services/attractions/get-attraction-by-slug';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;

  const attraction = await getAttractionBySlugService(slug);

  return {
    title: `${attraction?.title}`,
    description: attraction?.description,
    openGraph: {
      title: `${attraction?.title} | Turismomza`,
      description: attraction?.description,
      images: [attraction?.images[0]?.url],
    },
  };
}

export default async function AttractionPage({ params }: Props) {
  const { slug } = params;

  return (
    <>
      <Chevron />
      <AttractionPageClient slug={slug} />
    </>
  );
}
