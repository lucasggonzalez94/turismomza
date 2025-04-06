'use client';

import { FC, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { IoLogOutOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import DropdownButton from './DropdownButton';
import { IUser } from '@/interfaces/user';
import { ROLS } from '@/utils/constants';
import { logout } from '@/services/auth/logout';
import useNavigation from '@/hooks/useNavigation';
import { useAuthStore } from '@/store/authStore';
import { useNavigationStore } from '@/store/navigationStore';
import { IPropsMenuOption } from '@/interfaces/menu';

interface IPropsDropdownProfile {
  user: IUser | null;
  isOpen: boolean;
  setIsOpen: (isOpen: number | null) => void;
  onOpen: () => void;
  onClose: () => void;
}

const DropdownProfile: FC<IPropsDropdownProfile> = ({
  user,
  isOpen,
  setIsOpen,
  onOpen,
  onClose,
}) => {
  const { handleNavigation } = useNavigation();
  const pathname = usePathname();
  const { setUser, setIsAuthenticated } = useAuthStore((state) => state);
  const setBackPath = useNavigationStore((state) => state.setBackPath);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      handleNavigation('/auth/login');
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      toast.error(
        'Hubo un problema al cerrar sesión, pero has sido desconectado localmente.',
      );
      handleNavigation('/auth/login');
    }
  }, [handleNavigation, setIsAuthenticated, setUser]);

  const createNavigationOption = useCallback(
    (
      id: string,
      text: string,
      path: string,
      hasDivider = false,
      icon = null,
    ) => ({
      id,
      text,
      onClick: () => {
        handleNavigation(path);
        setBackPath(pathname);
      },
      divider: hasDivider,
      icon,
    }),
    [handleNavigation, pathname, setBackPath],
  );

  const DEFAULT_OPTIONS = useMemo(
    () => [
      createNavigationOption('login', 'Iniciar sesión', '/auth/login'),
      {
        ...createNavigationOption(
          'register',
          'Registrarse',
          '/auth/register',
          true,
        ),
      },
      createNavigationOption('help', 'Ayuda', '/faqs'),
    ],
    [createNavigationOption],
  );

  const commonAuthenticatedOptions = useMemo(
    () => [
      createNavigationOption(
        'profile',
        'Ver datos del perfil',
        '/profile',
        true,
      ),
      createNavigationOption('help', 'Ayuda', '/faqs', true),
      {
        id: 'logout',
        text: 'Cerrar sesión',
        onClick: handleLogout,
        icon: <IoLogOutOutline size={15} />,
        divider: false,
      },
    ],
    [createNavigationOption, handleLogout],
  );

  const publisherOptions = useMemo(
    () => [
      createNavigationOption('profile', 'Ver datos del perfil', '/profile'),
      createNavigationOption(
        'publications',
        'Mis publicaciones',
        '/profile/publications',
        true,
      ),
      createNavigationOption('help', 'Ayuda', '/faqs', true),
      {
        id: 'logout',
        text: 'Cerrar sesión',
        onClick: handleLogout,
        icon: <IoLogOutOutline size={15} />,
        divider: false,
      },
    ],
    [createNavigationOption, handleLogout],
  );

  const adminOptions = useMemo(
    () => [
      createNavigationOption(
        'profile',
        'Ver datos del perfil',
        '/profile',
        true,
      ),
      createNavigationOption(
        'publications',
        'Mis publicaciones',
        '/profile/publications',
        true,
      ),
      createNavigationOption('admin', 'Administrar', '/admin', true),
      createNavigationOption('help', 'Ayuda', '/faqs', true),
      {
        id: 'logout',
        text: 'Cerrar sesión',
        onClick: handleLogout,
        icon: <IoLogOutOutline size={15} />,
        divider: false,
      },
    ],
    [createNavigationOption, handleLogout],
  );

  const menuOptions = useMemo(() => {
    if (!user) return DEFAULT_OPTIONS;

    switch (user.role) {
      case ROLS.viewer:
        return commonAuthenticatedOptions;
      case ROLS.publisher:
        return publisherOptions;
      default:
        return adminOptions;
    }
  }, [
    user,
    DEFAULT_OPTIONS,
    commonAuthenticatedOptions,
    publisherOptions,
    adminOptions,
  ]);

  const handleOptionClick = useCallback(
    (option: IPropsMenuOption) => {
      if (option?.onClick) {
        option.onClick();
        setIsOpen(null);
        setBackPath(pathname);
      }
    },
    [setIsOpen, setBackPath, pathname],
  );

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
                onClick={() => handleOptionClick(option)}
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
