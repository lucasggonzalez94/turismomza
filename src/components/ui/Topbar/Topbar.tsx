'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge, Button } from '@nextui-org/react';
import DropdownSearch from '../DropdownSearch/DropdownSearch';
import DropdownNotifications from '../DropdownNotifications/DropdownNotifications';
import DropdownProfile from '../DropdownProfile/DropdownProfile';
import AnimatedLink from '../AnimatedLink/AnimatedLink';
import Link from 'next/link';

const Topbar = () => {
  const notifications = [
    { id: 1, user: 'John Doe', type: 'like', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', type: 'comment', time: '5 minutes ago' },
    { id: 3, user: 'Mike Johnson', type: 'like', time: '10 minutes ago' },
    { id: 4, user: 'Sarah Brown', type: 'comment', time: '15 minutes ago' },
  ];

  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );

  const handleOpenDropdown = (index: number | null) => {
    setOpenDropdownIndex((prev) => (prev === index ? null : index));
  };

  const handleCloseDropdown = () => {
    setOpenDropdownIndex(null);
  };

  return (
    <div className="grid grid-cols-11 grid-rows-1 gap-1 items-center px-6 h-24 absolute w-full z-10">
      <Link href="/" className="col-span-5">
        <Image
          src="/images/logoTurimomza.png"
          alt="Logo turismo mendoza"
          width={250}
          height={100}
        ></Image>
      </Link>

      <div className="hidden md:block">
        <div className="flex items-center justify-center">
          <DropdownSearch
            isOpen={openDropdownIndex === 0}
            onOpen={() => handleOpenDropdown(0)}
            onClose={handleCloseDropdown}
          />
        </div>
      </div>

      <div className="hidden 2xl:block col-span-5">
        <nav className="flex gap-4 items-center justify-end">
          <AnimatedLink href="attractions">ATRACTIVOS</AnimatedLink>
          <AnimatedLink href="about">SOBRE NOSOTROS</AnimatedLink>
          <AnimatedLink href="contact">CONTACTO</AnimatedLink>
          <Button
            as={Link}
            color="secondary"
            className="text-medium"
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
          <Badge content={4} color="primary" className="border-none">
            <DropdownNotifications
              notifications={notifications}
              isOpen={openDropdownIndex === 1}
              onOpen={() => handleOpenDropdown(1)}
              onClose={handleCloseDropdown}
            />
          </Badge>
          <DropdownProfile
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
