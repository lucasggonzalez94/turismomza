import NotificationsList from '@/components/ui/NotificationsList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: '...',
};

export default function NotificationsPage() {
  return (
    <div>
      <NotificationsList />
    </div>
  );
}
