'use client';

import { FC, ReactElement, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { IoLogOutOutline } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import DropdownButton from '../DropdownButton/DropdownButton';
import { User as IUser } from '@/interfaces/user';
import { ROLS } from '@/utils/constants';
import { logout } from '@/services/auth/logout';
import { useStore } from '@/store/store';

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
  onClick?: () => void;
  divider?: boolean;
}

const DropdownProfile: FC<IPropsDropdownProfile> = ({
  user,
  isOpen,
  onOpen,
  onClose,
}) => {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const notify = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const [menuOptions, setMenuOptions] = useState<IPropsMenuOption[]>([]);

  useEffect(() => {
    const handleNavigation = (path: string) => {
      router.push(path);
    };

    const DEFAULT_OPTIONS: IPropsMenuOption[] = [
      {
        id: 'login',
        text: 'Iniciar sesión',
        onClick: () => handleNavigation('/auth/login'),
      },
      {
        id: 'register',
        text: 'Registrarse',
        onClick: () => handleNavigation('/auth/register'),
        divider: true,
      },
      {
        id: 'help',
        text: 'Ayuda',
        onClick: () => handleNavigation('/help'),
      },
    ];

    const handleLogout = async () => {
      try {
        await logout();
        setUser(null);

        handleNavigation('/auth/login');
      } catch {
        notify();
      }
    };

    if (user) {
      if (user.role === ROLS.viewer) {
        setMenuOptions([
          {
            id: 'profile',
            text: 'Ver datos del perfil',
            onClick: () => handleNavigation('/profile'),
            divider: true,
          },
          {
            id: 'preferences',
            text: 'Preferencias',
            onClick: () => handleNavigation('/profile/preferences'),
          },
          {
            id: 'help',
            text: 'Ayuda',
            onClick: () => handleNavigation('/help'),
            divider: true,
          },
          {
            id: 'logout',
            text: 'Cerrar sesión',
            onClick: handleLogout,
            icon: <IoLogOutOutline size={15} />,
          },
        ]);
      } else if (user.role === ROLS.publisher) {
        setMenuOptions([
          {
            id: 'profile',
            text: 'Ver datos del perfil',
            onClick: () => handleNavigation('/profile'),
          },
          {
            id: 'publications',
            text: 'Mis publicaciones',
            onClick: () => handleNavigation('/profile/publications'),
            divider: true,
          },
          {
            id: 'preferences',
            text: 'Preferencias',
            onClick: () => handleNavigation('/profile/preferences'),
          },
          {
            id: 'help',
            text: 'Ayuda',
            onClick: () => handleNavigation('/help'),
            divider: true,
          },
          {
            id: 'logout',
            text: 'Cerrar sesión',
            onClick: handleLogout,
            icon: <IoLogOutOutline size={15} />,
          },
        ]);
      } else {
        setMenuOptions([
          {
            id: 'profile',
            text: 'Ver datos del perfil',
            onClick: () => handleNavigation('/profile'),
          },
          {
            id: 'admin',
            text: 'Administrar',
            onClick: () => handleNavigation('/admin'),
            divider: true,
          },
          {
            id: 'preferences',
            text: 'Preferencias',
            onClick: () => handleNavigation('/profile/preferences'),
            divider: true,
          },
          {
            id: 'logout',
            text: 'Cerrar sesión',
            onClick: handleLogout,
            icon: <IoLogOutOutline size={15} />,
          },
        ]);
      }
    } else {
      setMenuOptions(DEFAULT_OPTIONS);
    }
  }, [router, setUser, user]);

  return (
    <>
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
                className={`cursor-pointer p-4 hover:bg-gray-200 transition duration-150 ease-in-out ${option.divider ? 'border-b border-gray-200' : ''}`}
                onClick={() => {
                  if (option?.onClick) {
                    option.onClick();
                  }
                }}
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
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default DropdownProfile;
