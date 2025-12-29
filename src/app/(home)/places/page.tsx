import { Suspense } from 'react';
import { Metadata } from 'next';
import AllPlaces from '@/components/places/AllPlaces';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function PlacesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Container buttonBack>
        <AllPlaces />
      </Container>
    </Suspense>
  );
}
