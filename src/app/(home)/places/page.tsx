import PlacesWithFilters from '@/components/places/PlacesWithFilters';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function PlacesPage() {
  return (
    <>
      <Chevron />
      <PlacesWithFilters />
    </>
  );
}
