import { Metadata } from 'next';
import EditProfileForm from '@/components/profile/EditProfileForm';
import Chevron from '@/components/ui/Chevron';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <Container>
        <div className="flex flex-col flex-grow gap-6">
          <Chevron path="/profile" />
          <EditProfileForm />
        </div>
      </Container>
    </ProtectedRoute>
  );
}
