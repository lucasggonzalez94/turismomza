import { Suspense } from 'react';
import { Metadata } from 'next';
import Chevron from '@/components/ui/Chevron';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import FavoritePlaces from '@/components/places/FavoritePlaces';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function FavoritePlacesPage() {
  return (
    <ProtectedRoute>
      <Chevron />
      <Suspense fallback={<div>Cargando...</div>}>
        <FavoritePlaces />
      </Suspense>
    </ProtectedRoute>
  );
}
