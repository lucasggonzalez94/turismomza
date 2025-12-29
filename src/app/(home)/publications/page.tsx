import { Suspense } from 'react';
import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PlacesByUser from '@/components/places/PlacesByUser';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Lugares',
  description: '...',
};

export default function PlacesByUserPage() {
  return (
    <ProtectedRoute>
      <Container buttonBack>
        <Suspense fallback={<div>Cargando...</div>}>
          <PlacesByUser />
        </Suspense>
      </Container>
    </ProtectedRoute>
  );
}
