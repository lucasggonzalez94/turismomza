'use client';

import { FC, useState } from 'react';
import Link from 'next/link';

import { GoHomeFill } from 'react-icons/go';
import { FaUser } from 'react-icons/fa6';
import { IoNotifications, IoSettingsSharp } from 'react-icons/io5';
import { MdPlace } from 'react-icons/md';
import useNavigation from '@/hooks/useNavigation';

interface NavItem {
  id: number;
  icon: React.ReactNode;
  text: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 0, icon: <GoHomeFill size={25} />, text: 'Inicio', path: '/' },
  { id: 1, icon: <FaUser size={22} />, text: 'Perfil', path: '/profile' },
  {
    id: 2,
    icon: <IoNotifications size={25} />,
    text: 'Notificaciones',
    path: '/notifications',
  },
  { id: 3, icon: <MdPlace size={25} />, text: 'Lugares', path: '/places' },
  {
    id: 4,
    icon: <IoSettingsSharp size={25} />,
    text: 'Configuración',
    path: '/settings',
  },
];

const Navigation: FC = () => {
  const { handleNavigation } = useNavigation();

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="fixed bottom-0 w-full h-[70px] bg-white flex md:hidden justify-center items-center rounded-tl-lg rounded-tr-lg z-50">
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
                {item.icon}
              </span>
              {/* Texto */}
              <span
                className={`absolute text-black font-normal text-xs tracking-[0.05em] transition-all duration-500 ${
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
        {/* Indicador */}
        <div
          className="absolute top-[-40%] z-0 w-16 h-16 bg-siren-900 rounded-full transition-all duration-500"
          style={{ transform: `translateX(${activeIndex * 70 + 7}px)` }}
        />
      </ul>
    </div>
  );
};

export default Navigation;
