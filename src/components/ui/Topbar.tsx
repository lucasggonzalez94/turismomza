'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DropdownSearch from './DropdownSearch';
import AnimatedLink from './AnimatedLink';
import DropdownNotifications from './DropdownNotifications';
import DropdownProfile from './DropdownProfile';
import InputSearch from './InputSearch';
import { useAuthStore } from '@/store/authStore';
import { useNavigationStore } from '@/store/navigationStore';
import {
  IoAddOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoNotificationsOutline,
} from 'react-icons/io5';
import Sidedrawer from './Sidedrawer';
import { IPropsMenuOption } from '@/interfaces/menu';
import useNavigation from '@/hooks/useNavigation';
import { ROLS } from '@/utils/constants';
import { logout } from '@/services/auth/logout';

const Topbar = () => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useAuthStore(
    (state) => state,
  );
  const setBackPath = useNavigationStore((state) => state.setBackPath);
  const pathname = usePathname();
  const { handleNavigation } = useNavigation();

  const [black, setBlack] = useState(false);
  const [hideSearchInput, setHideSearchInput] = useState(false);
  const [hideSearchDropdown, setHideSearchDropdown] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const [openSidedrawer, setOpenSidedrawer] = useState(false);
  const [menuOptions, setMenuOptions] = useState<IPropsMenuOption[]>([]);

  const handleOpenDropdown = (index: number | null) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  };

  const handleCloseDropdown = () => {
    setOpenDropdownIndex(null);
  };

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
    if (pathname === '/') {
      setBlack(false);
    } else {
      setBlack(true);
    }

    if (pathname !== '/') {
      setHideSearchInput(true);
    } else {
      setHideSearchInput(false);
    }

    if (pathname === '/places') {
      setHideSearchDropdown(true);
    } else {
      setHideSearchDropdown(false);
    }
  }, [pathname]);

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
      }
    } else {
      setMenuOptions(DEFAULT_OPTIONS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="z-20">
      <div
        className={`flex justify-between md:grid grid-cols-11 grid-rows-1 gap-1 items-center px-6 h-24 w-full ${black ? 'relative bg-black' : 'absolute'}`}
      >
        <div className="col-span-5 flex">
          <Link href="/">
            <Image
              src="/images/logoTurismomza.webp"
              alt="Logo turismo mendoza"
              width={250}
              height={100}
              priority
              className="h-14 object-contain object-left drop-shadow-lg"
            ></Image>
          </Link>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center justify-center">
            {!hideSearchDropdown && (
              <DropdownSearch
                isOpen={openDropdownIndex === 0}
                onOpen={() => handleOpenDropdown(0)}
                onClose={handleCloseDropdown}
              />
            )}
          </div>
        </div>

        <div className="hidden xl:block col-span-5">
          <nav className="flex gap-4 items-center justify-end">
            <AnimatedLink href="/places" onClick={() => setBackPath(pathname)}>
              LUGARES
            </AnimatedLink>
            <AnimatedLink
              href="/favorites"
              onClick={() => setBackPath(pathname)}
            >
              FAVORITOS
            </AnimatedLink>
            <Button
              as={Link}
              color="secondary"
              className={`text-medium ${black ? 'bg-gray-500 hover:bg-gray-300 hover:text-black' : ''}`}
              href={isAuthenticated ? '/places/create' : '/auth/login'}
            >
              Publicar
            </Button>
            {/* <Button
            color="secondary"
            className="text-medium font-bold w-10 h-10 min-w-10"
          >
            ES
          </Button> */}
            {isAuthenticated && (
              <DropdownNotifications
                isOpen={openDropdownIndex === 1}
                setIsOpen={setOpenDropdownIndex}
                onOpen={() => handleOpenDropdown(1)}
                onClose={handleCloseDropdown}
              />
            )}
            <DropdownProfile
              user={user}
              isOpen={openDropdownIndex === 2}
              setIsOpen={setOpenDropdownIndex}
              onOpen={() => handleOpenDropdown(2)}
              onClose={handleCloseDropdown}
            />
          </nav>
        </div>

        <div className="block xl:hidden col-span-5">
          <div className="flex justify-end items-center gap-4">
            {isAuthenticated && (
              <Button
                as={Link}
                isIconOnly
                variant="light"
                href="/notifications"
              >
                <IoNotificationsOutline size={25} color="#fff" />
              </Button>
            )}
            <Button
              color="secondary"
              isIconOnly
              className={`text-medium ${black ? 'bg-gray-500 hover:bg-gray-300 hover:text-black' : ''}`}
              onPress={() => setOpenSidedrawer(true)}
            >
              <IoMenuOutline size={20} />
            </Button>
          </div>
        </div>
      </div>
      {!hideSearchInput && (
        <div className="sm:flex justify-center align-center absolute w-full top-24 p-4 md:hidden">
          <InputSearch />
        </div>
      )}
      <div>
        <Sidedrawer
          isOpen={openSidedrawer}
          setIsOpen={setOpenSidedrawer}
          fullContent
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              {menuOptions.map((option) => (
                <div
                  key={option.id}
                  className={`cursor-pointer p-4 hover:bg-gray-200 transition duration-150 ease-in-out ${option.divider ? 'border-b border-gray-200' : ''}`}
                  onClick={() => {
                    if (option?.onClick) {
                      option.onClick();
                      setOpenSidedrawer(false);
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
            <div className="flex justify-end items-center px-4">
              <Button
                as={Link}
                color="secondary"
                className={`text-medium ${black ? 'bg-gray-500 hover:bg-gray-300 hover:text-black' : ''}`}
                href={isAuthenticated ? '/places/create' : '/auth/login'}
                size="md"
                endContent={<IoAddOutline />}
              >
                Publicar
              </Button>
            </div>
          </div>
        </Sidedrawer>
      </div>
    </div>
  );
};

export default Topbar;
