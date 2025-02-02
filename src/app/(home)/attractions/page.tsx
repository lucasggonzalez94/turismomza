import AttractionsWithFilters from '@/components/attractions/AttractionsWithFilters';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function AttractionsPage() {
  return (
    <>
      <Chevron />
      <AttractionsWithFilters />
    </>
  );
}
