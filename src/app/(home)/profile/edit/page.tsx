import EditProfileForm from '@/components/profile/EditProfileForm';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function EditProfilePage() {
  return (
    <div className="flex flex-col flex-grow gap-6 pb-4 px-4">
      <Chevron path="/profile" />
      <EditProfileForm />
    </div>
  );
}
