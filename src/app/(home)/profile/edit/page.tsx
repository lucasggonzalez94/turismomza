import EditProfileForm from '@/components/profile/EditProfileForm';
import Chevron from '@/components/ui/Chevron';
import { getUserSession } from '@/utils/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default async function EditProfilePage() {
  const response = await getUserSession();

  if (!response) {
    redirect('/auth/login');
  }

  return (
    <div className="flex flex-col flex-grow gap-6 pb-4 px-4">
      <Chevron path="/profile" />
      <EditProfileForm />
    </div>
  );
}
