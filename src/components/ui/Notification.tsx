'use client';

import { Notification as INotification } from '@/interfaces/notification';
import { markAsReadedService } from '@/services/notifications/mark-as-readed';
import { ToastContainer, toast } from 'react-toastify';
import { formatDate } from '@/utils/helpers';
import { Tooltip } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import {
  IoChatbubbleEllipsesOutline,
  IoCheckmarkCircleSharp,
  IoEllipseOutline,
} from 'react-icons/io5';
import { PiThumbsUp } from 'react-icons/pi';

interface IPropsNotification {
  notification: INotification;
  notifications: INotification[];
  setNotifications: (notifications: INotification[]) => void;
  onClick: () => void;
}

const Notification: FC<IPropsNotification> = ({
  notification,
  notifications,
  setNotifications,
  onClick,
}) => {
  const [readed, setReaded] = useState(false);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const markAsRead = async (notificationId: string) => {
    try {
      await markAsReadedService(notificationId);
      const newNotifications = notifications.map((not) => {
        if (not.id === notification.id) {
          return {
            ...notification,
            read: !notification.read,
          };
        }
        return not;
      });
      setNotifications(newNotifications);
      setReaded((prev) => !prev);
    } catch {
      notify();
    }
  };

  useEffect(() => {
    setReaded(notification?.read);
  }, [notification]);

  return (
    <>
      <div
        key={notification.id}
        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out"
        onClick={onClick}
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
                {notification?.triggeredBy?.name}
              </span>{' '}
              {notification.type === 'like'
                ? 'le dió me gusta a tu opinión'
                : 'comentó tu publicación'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(notification?.creation_date.toString())}
            </p>
          </div>
          {readed ? (
            <Tooltip content="Marcar como no leída">
              <div className="flex flex-grow justify-end items-center">
                <IoCheckmarkCircleSharp
                  className="text-blue-400 cursor-pointer hover:border-1 hover:border-blue-400 rounded-full"
                  onClick={() => markAsRead(notification.id)}
                />
              </div>
            </Tooltip>
          ) : (
            <Tooltip content="Marcar como leída">
              <div className="flex flex-grow justify-end items-center">
                <IoEllipseOutline
                  className="text-blue-400 cursor-pointer hover:bg-blue-400 rounded-full"
                  onClick={() => markAsRead(notification.id)}
                />
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default Notification;
