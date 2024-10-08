'use client';

import { FC, ReactElement, useEffect, useState } from 'react';
import Link from 'next/link';

import { IoLogOutOutline } from 'react-icons/io5';
import DropdownButton from '../DropdownButton/DropdownButton';
import { User as IUser } from '@/interfaces/user';
import { ROLS } from '@/utils/constants';

interface IPropsDropdownProfile {
  user: IUser | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface IPropsMenuOption {
  id: string;
  text: string;
  icon?: ReactElement;
  path?: string;
  onClick?: () => void;
  divider?: boolean;
}

const DEFAULT_OPTIONS = [
  {
    id: 'login',
    text: 'Iniciar sesión',
    path: '/auth/login',
  },
  {
    id: 'register',
    text: 'Registrarse',
    path: '/auth/register',
    divider: true,
  },
  {
    id: 'help',
    text: 'Ayuda',
    path: '/help',
  },
];

const DropdownProfile: FC<IPropsDropdownProfile> = ({
  user,
  isOpen,
  onOpen,
  onClose,
}) => {
  const [menuOptions, setMenuOptions] =
    useState<IPropsMenuOption[]>(DEFAULT_OPTIONS);

  useEffect(() => {
    if (user) {
      if (user.role === ROLS.viewer) {
        setMenuOptions([
          {
            id: 'profile',
            text: 'Ver datos del perfil',
            path: '/profile',
            divider: true,
          },
          {
            id: 'preferences',
            text: 'Preferencias',
            path: '/preferences',
          },
          {
            id: 'help',
            text: 'Ayuda',
            path: '/help',
            divider: true,
          },
          {
            id: 'logout',
            text: 'Cerrar sesión',
            path: '/logout',
            icon: <IoLogOutOutline size={15} />,
          },
        ]);
      } else if (user.role === ROLS.publisher) {
        setMenuOptions([
          {
            id: 'profile',
            text: 'Ver datos del perfil',
            path: '/profile',
          },
          {
            id: 'publications',
            text: 'Mis publicaciones',
            path: '/publications',
            divider: true,
          },
          {
            id: 'preferences',
            text: 'Preferencias',
            path: '/preferences',
          },
          {
            id: 'help',
            text: 'Ayuda',
            path: '/help',
            divider: true,
          },
          {
            id: 'logout',
            text: 'Cerrar sesión',
            path: '/logout',
            icon: <IoLogOutOutline size={15} />,
          },
        ]);
      } else {
        setMenuOptions([
          {
            id: 'profile',
            text: 'Ver datos del perfil',
            path: '/profile',
          },
          {
            id: 'admin',
            text: 'Administrar',
            path: '/admin',
            divider: true,
          },
          {
            id: 'preferences',
            text: 'Preferencias',
            path: '/preferences',
            divider: true,
          },
          {
            id: 'logout',
            text: 'Cerrar sesión',
            path: '/logout',
            icon: <IoLogOutOutline size={15} />,
          },
        ]);
      }
    } else {
      setMenuOptions(DEFAULT_OPTIONS);
    }
  }, [user]);

  return (
    <DropdownButton
      position="left"
      profile
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    >
      <div className="mt-2 bg-gray-100 rounded-md shadow-ms overflow-hidden">
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center">
          {user ? (
            <Link
              href="/profile"
              className="text-lg font-semibold text-gray-800"
            >
              {user?.name}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">Perfil</h3>
          )}
        </div>
        <div>
          {menuOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 hover:bg-gray-200 transition duration-150 ease-in-out ${option.divider ? 'border-b border-gray-200' : ''}`}
            >
              <div className="flex items-center cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900 flex gap-3 items-center">
                    <span>{option.text}</span>
                    {option?.icon && option?.icon}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DropdownButton>
  );
};

export default DropdownProfile;
