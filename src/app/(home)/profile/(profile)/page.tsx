import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileData from '@/components/profile/ProfileData';
import Chevron from '@/components/ui/Chevron';
import Container from '@/components/ui/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function ProfileDataPage() {
  return (
    <ProtectedRoute>
      <Container>
        <div className="flex flex-col flex-grow gap-6">
          <Chevron />
          <ProfileData />
        </div>
      </Container>
    </ProtectedRoute>
  );
}
