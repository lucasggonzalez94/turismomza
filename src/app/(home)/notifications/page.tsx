import NotificationsPageClient from '@/components/notifications/NotificationsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: '...',
};

export default function NotificationsPage() {
  return (
    <div>
      <NotificationsPageClient />
    </div>
  );
}
