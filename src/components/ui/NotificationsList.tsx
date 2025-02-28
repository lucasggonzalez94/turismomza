'use client';

import React, { useEffect, useState } from 'react';

import NotificationItem from './NotificationItem';
import { useStore } from '@/store/store';
import { INotification } from '@/interfaces/notification';
import { listNotificationsService } from '@/services/notifications/list-notifications';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@nextui-org/react';

const NotificationsList = () => {
  const user = useAuthStore((state) => state.user);
  const socket = useStore((state) => state.socket);

  const [errorService, setErrorService] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(false);

  const getNotifications = async () => {
    try {
      const response = await listNotificationsService();
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

  return (
    <div>
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Notificaciones</h3>
      </div>
      <div className="overflow-y-auto bg-gray-200">
        {loading ? (
          <div className="p-4 text-center">
            <Spinner color="default" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              notifications={notifications}
              setNotifications={setNotifications}
              onClick={() => {}}
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
    </div>
  );
};

export default NotificationsList;
