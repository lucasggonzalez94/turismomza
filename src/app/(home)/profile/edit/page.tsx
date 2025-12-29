import { Metadata } from 'next';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Container from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <Container buttonBack pathButtonBack="/profile">
        <EditProfileForm />
      </Container>
    </ProtectedRoute>
  );
}
