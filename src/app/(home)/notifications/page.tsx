import NotificationsList from '@/components/ui/NotificationsList';
import { getUserSession } from '@/utils/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: '...',
};

export default async function NotificationsPage() {
  const response = await getUserSession();

  if (!response) {
    redirect('/auth/login');
  }

  return (
    <div>
      <NotificationsList />
    </div>
  );
}
