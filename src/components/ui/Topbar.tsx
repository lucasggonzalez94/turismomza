'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
import { IoMenuOutline, IoNotificationsOutline } from 'react-icons/io5';
import Sidedrawer from './Sidedrawer';

const Topbar = () => {
  const { user, isAuthenticated } = useAuthStore((state) => state);
  const { setBackPath } = useNavigationStore((state) => state);
  const pathname = usePathname();

  const [black, setBlack] = useState(false);
  const [hideSearchInput, setHideSearchInput] = useState(false);
  const [hideSearchDropdown, setHideSearchDropdown] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const [openSidedrawer, setOpenSidedrawer] = useState(false);

  const handleOpenDropdown = (index: number | null) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  };

  const handleCloseDropdown = () => {
    setOpenDropdownIndex(null);
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
              className="h-14 object-contain object-left"
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
              onClick={() => setOpenSidedrawer(true)}
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
          title="Filtros"
        >
          Menu
        </Sidedrawer>
      </div>
    </div>
  );
};

export default Topbar;
