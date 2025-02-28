'use client';

import { FC, ReactElement, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { IoLogOutOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import DropdownButton from './DropdownButton';
import { IUser } from '@/interfaces/user';
import { ROLS } from '@/utils/constants';
import { logout } from '@/services/auth/logout';
import useNavigation from '@/hooks/useNavigation';
import { useAuthStore } from '@/store/authStore';
import { useNavigationStore } from '@/store/navigationStore';

interface IPropsDropdownProfile {
  user: IUser | null;
  isOpen: boolean;
  setIsOpen: (isOpen: number | null) => void;
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
  setIsOpen,
  onOpen,
  onClose,
}) => {
  const { handleNavigation } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, setIsAuthenticated } = useAuthStore((state) => state);
  const setBackPath = useNavigationStore((state) => state.setBackPath);

  const [menuOptions, setMenuOptions] = useState<IPropsMenuOption[]>([]);

  const handleLogout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      await logout();

      handleNavigation('/auth/login');
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
    }
  };

  useEffect(() => {
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
        onClick: () => {
          handleNavigation('/faqs');
          setBackPath(pathname);
        },
      },
    ];

    if (user) {
      if (user.role === ROLS.viewer) {
        setMenuOptions([
          {
            id: 'profile',
            text: 'Ver datos del perfil',
            onClick: () => {
              handleNavigation('/profile');
              setBackPath(pathname);
            },
            divider: true,
          },
          {
            id: 'help',
            text: 'Ayuda',
            onClick: () => {
              handleNavigation('/faqs');
              setBackPath(pathname);
            },
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
            onClick: () => {
              handleNavigation('/profile');
              setBackPath(pathname);
            },
          },
          {
            id: 'publications',
            text: 'Mis publicaciones',
            onClick: () => {
              handleNavigation('/profile/publications');
              setBackPath(pathname);
            },
            divider: true,
          },
          {
            id: 'help',
            text: 'Ayuda',
            onClick: () => {
              handleNavigation('/faqs');
              setBackPath(pathname);
            },
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
            onClick: () => {
              handleNavigation('/profile');
              setBackPath(pathname);
            },
            divider: true,
          },
          {
            id: 'publications',
            text: 'Mis publicaciones',
            onClick: () => {
              handleNavigation('/profile/publications');
              setBackPath(pathname);
            },
            divider: true,
          },
          {
            id: 'admin',
            text: 'Administrar',
            onClick: () => {
              handleNavigation('/admin');
              setBackPath(pathname);
            },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, user]);

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
                onClick={() => {
                  setIsOpen(null);
                  setBackPath(pathname);
                }}
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
                    setIsOpen(null);
                    setBackPath(pathname);
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
    </>
  );
};

export default DropdownProfile;
