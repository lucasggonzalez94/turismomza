import DropdownButton from '../DropdownButton/DropdownButton';
import {
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';
import { PiThumbsUp } from 'react-icons/pi';
import { FC } from 'react';
import { Badge } from '@nextui-org/react';

interface IPropsDropdownNotifications {
  notifications: {
    id: number;
    type: string;
    user: string;
    time: string;
  }[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const DropdownNotifications: FC<IPropsDropdownNotifications> = ({
  notifications,
  isOpen,
  onOpen,
  onClose,
}) => {
  return (
    <Badge
      content={notifications?.length}
      color="primary"
      className="border-none"
    >
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
                        <span className="font-bold">{notification.user}</span>{' '}
                        {notification.type === 'like' ? 'liked' : 'reviewed on'}{' '}
                        your post
                      </p>
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications at the moment
              </div>
            )}
          </div>
        </div>
      </DropdownButton>
    </Badge>
  );
};

export default DropdownNotifications;
