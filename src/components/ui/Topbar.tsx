'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { useStore } from '@/store/store';
import { usePathname } from 'next/navigation';
import DropdownSearch from './DropdownSearch';
import AnimatedLink from './AnimatedLink';
import LinkToSection from './LinkToSection';
import DropdownNotifications from './DropdownNotifications';
import DropdownProfile from './DropdownProfile';

const Topbar = () => {
  const verified = useAuth();
  const user = useStore((state) => state.user);
  const pathname = usePathname();

  const [black, setBlack] = useState(false);
  const [hideSearch, setHideSearch] = useState(false);

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );

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
    if (pathname === '/attractions') {
      setHideSearch(true);
    } else {
      setHideSearch(false);
    }
  }, [pathname]);

  return (
    <div
      className={`grid grid-cols-11 grid-rows-1 gap-1 items-center px-6 h-24 w-full z-20 ${black ? 'relative bg-black' : 'absolute'}`}
    >
      <div className="col-span-5 flex">
        <Link href="/">
          <Image
            src="/images/logoTurismomza.png"
            alt="Logo turismo mendoza"
            width={250}
            height={100}
            priority
          ></Image>
        </Link>
      </div>

      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          {!hideSearch && (
            <DropdownSearch
              isOpen={openDropdownIndex === 0}
              onOpen={() => handleOpenDropdown(0)}
              onClose={handleCloseDropdown}
            />
          )}
        </div>
      </div>

      <div className="hidden 2xl:block col-span-5">
        <nav className="flex gap-4 items-center justify-end">
          <AnimatedLink href="/attractions">LUGARES</AnimatedLink>
          <AnimatedLink href="/about">SOBRE NOSOTROS</AnimatedLink>
          <Button
            as={Link}
            color="secondary"
            className={`text-medium ${black ? 'bg-gray-500 hover:bg-gray-300 hover:text-black' : ''}`}
            href={verified ? '/attractions/create' : '/auth/login'}
          >
            Publicar
          </Button>
          {/* <Button
            color="secondary"
            className="text-medium font-bold w-10 h-10 min-w-10"
          >
            ES
          </Button> */}
          {verified && (
            <DropdownNotifications
              isOpen={openDropdownIndex === 1}
              onOpen={() => handleOpenDropdown(1)}
              onClose={handleCloseDropdown}
            />
          )}
          <DropdownProfile
            user={user}
            isOpen={openDropdownIndex === 2}
            onOpen={() => handleOpenDropdown(2)}
            onClose={handleCloseDropdown}
          />
        </nav>
      </div>
    </div>
  );
};

export default Topbar;
