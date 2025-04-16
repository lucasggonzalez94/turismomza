import { Suspense } from 'react';
import { Metadata } from 'next';
import Chevron from '@/components/ui/Chevron';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PlacesByUser from '@/components/places/PlacesByUser';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function PlacesPage() {
  return (
    <ProtectedRoute>
      <Chevron />
      <Suspense fallback={<div>Cargando...</div>}>
        <PlacesByUser />
      </Suspense>
    </ProtectedRoute>
  );
}
