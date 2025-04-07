import { Metadata } from 'next';
import EditProfileForm from '@/components/profile/EditProfileForm';
import Chevron from '@/components/ui/Chevron';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col flex-grow gap-6 pb-4 px-4">
        <Chevron path="/profile" />
        <EditProfileForm />
      </div>
    </ProtectedRoute>
  );
}
