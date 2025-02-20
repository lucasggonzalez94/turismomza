import EditProfileForm from '@/components/profile/EditProfileForm';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

interface IPropsEditProfilePage {
  params: {
    userId: string;
  };
}

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function EditProfilePage({ params }: IPropsEditProfilePage) {
  const { userId } = params;

  return (
    <div className="flex flex-col flex-grow gap-6 pb-4 px-4">
      <Chevron />
      <EditProfileForm userId={userId} />
    </div>
  );
}
