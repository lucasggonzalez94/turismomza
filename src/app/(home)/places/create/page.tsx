import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PlaceForm from '@/components/places/PlaceForm';
import Chevron from '@/components/ui/Chevron';
import Container from '@/components/ui/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publicar',
};

export default function CreatePlacePage() {
  return (
    <ProtectedRoute>
      <Container>
        <Chevron />
        <div className="flex flex-col flex-grow gap-6 lg:px-[20%] xl:px-[30%]">
          <h2 className="font-bold text-xl">Publicá tu lugar</h2>
          <PlaceForm />
        </div>
      </Container>
    </ProtectedRoute>
  );
}
