'use client';

import { FC, useEffect, useState } from 'react';
import DropdownButton from './DropdownButton';
import { IoNotificationsOutline } from 'react-icons/io5';
import { INotification as INotification } from '@/interfaces/notification';
import { listNotificationsService } from '@/services/notifications/list-notifications';
import NotificationItem from './NotificationItem';
import { useAuthStore } from '@/store/authStore';
import { useSocketStore } from '@/store/socketStore';

interface IPropsDropdownNotifications {
  isOpen: boolean;
  setIsOpen: (isOpen: number | null) => void;
  onOpen: () => void;
  onClose: () => void;
}

const DropdownNotifications: FC<IPropsDropdownNotifications> = ({
  isOpen,
  setIsOpen,
  onOpen,
  onClose,
}) => {
  const [errorService, setErrorService] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const socket = useSocketStore((state) => state.socket);

  const countUnreadNotifications = (
    notifications: INotification[],
  ): number | null => {
    const countNotifications = notifications.filter(
      (notification) => !notification.read,
    ).length;
    return countNotifications ? countNotifications : null;
  };

  const getNotifications = async () => {
    try {
      setLoading(true);
      const response = await listNotificationsService();
      setCount(countUnreadNotifications(response));
      setNotifications(response);
    } catch {
      setErrorService(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && socket) {
      socket.on('notification', (data: INotification) => {
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [user, socket]);

  useEffect(() => {
    setCount(countUnreadNotifications(notifications));
  }, [notifications]);

  return (
    <div className="relative inline-flex">
      {count ? (
        <span className="absolute -top-1 -right-1 z-10 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-trinidad-500 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      ) : null}
      <DropdownButton
        icon={<IoNotificationsOutline size={25} />}
        position="left"
        square
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h3 className="text-md font-semibold text-gray-800">
            Notificaciones
          </h3>
        </div>
        <div className="overflow-y-auto bg-gray-200 max-h-80">
          {loading ? (
            <div className="p-4 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                notifications={notifications}
                setNotifications={setNotifications}
                onClick={() => setIsOpen(null)}
              />
            ))
          ) : errorService ? (
            <div className="p-4 text-center text-gray-500 text-xs">
              ¡Algo salio mal! Vuelve a intentarlo más tarde
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-xs">
              No tienes notificaciones en este momento.
            </div>
          )}
        </div>
      </DropdownButton>
    </div>
  );
};

export default DropdownNotifications;
