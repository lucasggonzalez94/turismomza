import AttractionPageClient from '@/components/attractions/AttractionPageClient';

interface Props {
  params: {
    slug: string;
  };
}

export default async function AttractionPage({ params }: Props) {
  const { slug } = params;

  return <AttractionPageClient slug={slug} />;
}
