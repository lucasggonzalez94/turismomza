'use client';

import React, { useEffect, useState } from 'react';

import Notification from '../ui/Notification';
import { useStore } from '@/store/store';
import { INotification } from '@/interfaces/notification';
import { listNotificationsService } from '@/services/notifications/list-notifications';

const NotificationsPageClient = () => {
  const { user, socket } = useStore((state) => state);

  const [errorService, setErrorService] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

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
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Notification
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

export default NotificationsPageClient;
