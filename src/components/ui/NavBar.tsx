'use client';

import { FC, useEffect, useState } from 'react';

import { GoHomeFill } from 'react-icons/go';
import { FaUser } from 'react-icons/fa6';
import { IoNotifications, IoSettingsSharp } from 'react-icons/io5';
import { MdPlace } from 'react-icons/md';
import useNavigation from '@/hooks/useNavigation';
import useAuth from '@/hooks/useAuth';
import { INotification } from '@/interfaces/notification';
import { useStore } from '@/store/store';
import { listNotificationsService } from '@/services/notifications/list-notifications';
import { Badge } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: number;
  icon: React.ReactNode;
  text: string;
  path: string;
}

const Navigation: FC = () => {
  const verified = useAuth();
  const { handleNavigation } = useNavigation();
  const pathname = usePathname();
  const { user, socket } = useStore((state) => state);

  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: 0, icon: <GoHomeFill size={25} />, text: 'Inicio', path: '/' },
    { id: 1, icon: <FaUser size={20} />, text: 'Perfil', path: '/profile' },
    {
      id: 2,
      icon: <IoNotifications size={25} />,
      text: 'Notificaciones',
      path: '/notifications',
    },
    {
      id: 3,
      icon: <MdPlace size={25} />,
      text: 'Lugares',
      path: '/places',
    },
    {
      id: 4,
      icon: <IoSettingsSharp size={25} />,
      text: 'Configuración',
      path: '/settings',
    },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [count, setCount] = useState<number | null>(null);

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
      setNotifications([]);
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

  useEffect(() => {
    const activeItem = navItems.findIndex((item) => item.path === pathname);
    setActiveIndex(activeItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navItems, pathname]);

  useEffect(() => {
    if (verified) {
      setNavItems([
        { id: 0, icon: <GoHomeFill size={25} />, text: 'Inicio', path: '/' },
        { id: 1, icon: <FaUser size={22} />, text: 'Perfil', path: '/profile' },
        {
          id: 2,
          icon: <IoNotifications size={25} />,
          text: 'Notificaciones',
          path: '/notifications',
        },
        {
          id: 3,
          icon: <MdPlace size={25} />,
          text: 'Lugares',
          path: '/places',
        },
        {
          id: 4,
          icon: <IoSettingsSharp size={25} />,
          text: 'Configuración',
          path: '/settings',
        },
      ]);
    } else {
      setNavItems([
        { id: 0, icon: <GoHomeFill size={25} />, text: 'Inicio', path: '/' },
        { id: 1, icon: <FaUser size={25} />, text: 'Perfil', path: '/profile' },
        {
          id: 3,
          icon: <MdPlace size={25} />,
          text: 'Lugares',
          path: '/places',
        },
        {
          id: 4,
          icon: <IoSettingsSharp size={25} />,
          text: 'Configuración',
          path: '/settings',
        },
      ]);
    }
  }, [verified]);

  return (
    <div className="fixed bottom-0 w-full h-[70px] bg-white flex md:hidden justify-center items-center rounded-tl-xl rounded-tr-xl z-50">
      <ul className="flex w-[350px] relative">
        {navItems.map((item, index) => (
          <li
            key={item.id}
            className="relative list-none w-[70px] h-[70px] z-10"
          >
            <div
              onClick={() => {
                setActiveIndex(index);
                handleNavigation(item.path);
              }}
              className="relative flex justify-center items-center flex-col w-full text-center font-medium"
            >
              {/* Ícono */}
              <span
                className={`relative flex justify-center items-center h-[75px] text-center transition-all duration-500 text-black ${
                  activeIndex === index ? 'translate-y-[-38px] text-white' : ''
                }`}
              >
                {item.text === 'Notificaciones' ? (
                  <Badge
                    content={count}
                    color="primary"
                    className="border-none"
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  <span>{item.icon}</span>
                )}
              </span>
              {/* Texto */}
              <span
                className={`absolute text-black text-sm tracking-[0.05em] transition-all duration-500 ${
                  activeIndex === index
                    ? 'opacity-100 translate-y-[10px]'
                    : 'opacity-0 translate-y-[20px]'
                }`}
              >
                {item.text}
              </span>
            </div>
          </li>
        ))}
        {activeIndex !== -1 && (
          <div
            className="absolute top-[-40%] z-0 w-16 h-16 bg-siren-900 rounded-full transition-all duration-500"
            style={{ transform: `translateX(${activeIndex * 70 + 7}px)` }}
          />
        )}
      </ul>
    </div>
  );
};

export default Navigation;
