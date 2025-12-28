import { Suspense } from 'react';
import { Metadata } from 'next';
import Chevron from '@/components/ui/Chevron';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FavoritePlaces from '@/components/places/FavoritePlaces';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function FavoritePlacesPage() {
  return (
    <ProtectedRoute>
      <Container>
        <Chevron />
        <Suspense fallback={<div>Cargando...</div>}>
          <FavoritePlaces />
        </Suspense>
      </Container>
    </ProtectedRoute>
  );
}
