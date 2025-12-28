import ProfileView from '@/components/profile/ProfileView';
import Chevron from '@/components/ui/Chevron';
import Container from '@/components/ui/Container';
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
    <Container>
      <div className="flex flex-col flex-grow gap-6">
        <Chevron />
        <ProfileView userId={userId} />
      </div>
    </Container>
  );
}
