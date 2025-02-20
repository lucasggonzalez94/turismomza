import ProfileView from '@/components/profile/ProfileView';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

interface IPropsProfileViewPage {
  params: {
    userId: string;
  };
}

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function ProfileViewPage({ params }: IPropsProfileViewPage) {
  const { userId } = params;

  return (
    <div className="flex flex-col flex-grow gap-6 pb-4 px-4">
      <Chevron />
      <ProfileView userId={userId} />
    </div>
  );
}
