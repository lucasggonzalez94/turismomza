import AttractionPageClient from '@/components/attractions/AttractionPageClient';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Turismomza | ...',
  description: '...',
};

export default async function AttractionPage({ params }: Props) {
  const { slug } = params;

  return <AttractionPageClient slug={slug} />;
}
