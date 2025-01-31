'use client';

import { FC, useEffect, useState } from 'react';
import DropdownButton from './DropdownButton';
import { IoNotificationsOutline } from 'react-icons/io5';
import { Badge } from '@nextui-org/react';
import { Notification as INotification } from '@/interfaces/notification';
import { listNotificationsService } from '@/services/notifications/list-notifications';
import { useStore } from '@/store/store';
import Notification from './Notification';

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

  const { user, socket } = useStore((state) => state);

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
      const response = await listNotificationsService();
      setCount(countUnreadNotifications(response));
      setNotifications(response);
    } catch {
      setErrorService(true);
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
    <Badge content={count} color="primary" className="border-none">
      <DropdownButton
        icon={<IoNotificationsOutline size={25} color="#fff" />}
        position="left"
        square
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <div className="p-4 bg-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Notificationes
          </h3>
        </div>
        <div className="overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Notification
                key={notification.id}
                notification={notification}
                notifications={notifications}
                setNotifications={setNotifications}
                onClick={() => setIsOpen(null)}
              />
            ))
          ) : errorService ? (
            <div className="p-4 text-center text-gray-500">
              ¡Algo salio mal! Vuelve a intentarlo más tarde
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No tienes notificaciones en este momento.
            </div>
          )}
        </div>
      </DropdownButton>
    </Badge>
  );
};

export default DropdownNotifications;
