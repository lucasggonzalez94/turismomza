import { Suspense } from 'react';
import { Metadata } from 'next';
import PlacesWithFilters from '@/components/places/PlacesWithFilters';
import Chevron from '@/components/ui/Chevron';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function PlacesPage() {
  return (
    <>
      <Chevron />
      <Suspense fallback={<div>Cargando...</div>}>
        <PlacesWithFilters />
      </Suspense>
    </>
  );
}
