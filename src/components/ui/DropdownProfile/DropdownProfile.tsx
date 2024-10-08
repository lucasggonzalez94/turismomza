'use client';

import { FC, useEffect, useState } from 'react';
import DropdownButton from '../DropdownButton/DropdownButton';
import { User as IUser } from '@/interfaces/user';
import { User } from '@nextui-org/react';
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
  path: string;
}

const DropdownProfile: FC<IPropsDropdownProfile> = ({
  user,
  isOpen,
  onOpen,
  onClose,
}) => {
  const [menuOptions, setMenuOptions] = useState<IPropsMenuOption[]>([]);

  useEffect(() => {
    if (user) {
      if (user.role === ROLS.viewer) {
        setMenuOptions([]);
      } else if (user.role === ROLS.publisher) {
        setMenuOptions([]);
      } else {
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
          },
          {
            id: 'logout',
            text: 'Cerrar sesión',
            path: '/logout',
          },
        ]);
      }
    } else {
      setMenuOptions([]);
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
      <div className="mt-2 bg-gray-200 rounded-md shadow-ms overflow-hidden">
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center">
          {user ? (
            <User
              name={user?.name}
              avatarProps={{
                // TODO: Tomar foto de perfil y cambiar icono sin foto
                src: user?.profilePicture
                  ? 'https://i.pravatar.cc/150?u=a04258114e29026702d'
                  : '/images/profile-empty.png',
              }}
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">Perfil</h3>
          )}
        </div>
        <div>
          {menuOptions.map((option) => (
            <div
              key={option.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <div className="flex items-center cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {option.text}
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
