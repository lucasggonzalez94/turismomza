import ProfileData from '@/components/profile/ProfileData';
import Chevron from '@/components/ui/Chevron';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfil',
  description: '...',
};

export default function ProfileDataPage() {
  return (
    <div className="flex flex-col flex-grow gap-6 pb-4 px-4">
      <Chevron />
      <ProfileData />
    </div>
  );
}
