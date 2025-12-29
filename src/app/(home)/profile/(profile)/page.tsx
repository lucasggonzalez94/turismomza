import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileData from '@/components/profile/ProfileData';
import Container from '@/components/ui/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function ProfileDataPage() {
  return (
    <ProtectedRoute>
      <Container buttonBack>
        <ProfileData />
      </Container>
    </ProtectedRoute>
  );
}
