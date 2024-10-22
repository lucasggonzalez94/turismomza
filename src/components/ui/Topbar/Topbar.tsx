'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import DropdownSearch from '../DropdownSearch/DropdownSearch';
import DropdownNotifications from '../DropdownNotifications/DropdownNotifications';
import DropdownProfile from '../DropdownProfile/DropdownProfile';
import AnimatedLink from '../AnimatedLink/AnimatedLink';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { useStore } from '@/store/store';
import LinkToSection from '../LinkToSection/LinkToSection';
import { usePathname } from 'next/navigation';

const Topbar = () => {
  const notifications = [
    { id: 1, user: 'John Doe', type: 'like', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', type: 'review', time: '5 minutes ago' },
    { id: 3, user: 'Mike Johnson', type: 'like', time: '10 minutes ago' },
    { id: 4, user: 'Sarah Brown', type: 'review', time: '15 minutes ago' },
  ];

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
          <AnimatedLink href="attractions">ATRACTIVOS</AnimatedLink>
          <AnimatedLink href="about">SOBRE NOSOTROS</AnimatedLink>
          <LinkToSection
            idToScroll="contact"
            className="text-white relative group transition-all duration-300 hover:font-bold"
          >
            CONTACTO
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
          </LinkToSection>
          <Button
            as={Link}
            color="secondary"
            className={`text-medium ${black ? 'bg-gray-500 hover:bg-gray-300 hover:text-black' : ''}`}
            href="/create"
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
              notifications={notifications}
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
