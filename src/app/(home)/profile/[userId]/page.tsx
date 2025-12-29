import ProfileView from '@/components/profile/ProfileView';
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
    <Container buttonBack>
      <ProfileView userId={userId} />
    </Container>
  );
}
