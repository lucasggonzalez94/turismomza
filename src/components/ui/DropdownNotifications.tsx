'use client';

import { FC, useEffect, useState } from 'react';
import DropdownButton from './DropdownButton';
import {
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';
import { PiThumbsUp } from 'react-icons/pi';
import { Badge } from '@nextui-org/react';
import { Notification } from '@/interfaces/notification';
import { formatDate } from '@/utils/helpers';
import { listNotificationsService } from '@/services/notifications/list-notifications';
import { useStore } from '@/store/store';

interface IPropsDropdownNotifications {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const DropdownNotifications: FC<IPropsDropdownNotifications> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  const [errorService, setErrorService] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const { user, socket } = useStore((state) => state);

  const countUnreadNotifications = (
    notifications: Notification[],
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
      socket.on('notification', (data: Notification) => {
        console.log(data);
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
        <div className="mt-2 bg-gray-200 rounded-md shadow-ms overflow-hidden">
          <div className="p-4 bg-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Notificationes
            </h3>
          </div>
          <div className="overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <div className="flex items-center cursor-pointer">
                    <div className="flex-shrink-0">
                      {notification.type === 'like' ? (
                        <PiThumbsUp className="w-5 h-5 text-red-400" />
                      ) : (
                        <IoChatbubbleEllipsesOutline className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-bold">
                          {notification?.user?.name}
                        </span>{' '}
                        {notification.type === 'like' ? 'liked' : 'reviewed on'}{' '}
                        your post
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(notification?.creation_date.toString())}
                      </p>
                    </div>
                  </div>
                </div>
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
        </div>
      </DropdownButton>
    </Badge>
  );
};

export default DropdownNotifications;
