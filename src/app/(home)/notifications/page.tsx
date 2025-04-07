import NotificationsList from '@/components/ui/NotificationsList';
import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: '...',
};

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsList />
    </ProtectedRoute>
  );
}
