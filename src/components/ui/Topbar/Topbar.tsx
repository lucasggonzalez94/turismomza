import Image from 'next/image';
import { IoSearch } from 'react-icons/io5';
import { IoNotificationsOutline } from 'react-icons/io5';
import { Avatar, Button } from '@nextui-org/react';
import Link from 'next/link';

const Topbar = () => {
  return (
    <div className="flex justify-between items-center px-6 h-24 absolute w-screen">
      <Image
        src="/images/logoTurimomza.png"
        alt="Logo turismo mendoza"
        width={250}
        height={100}
      ></Image>
      <Button isIconOnly variant="light">
        <IoSearch size={25} color="#fff" />
      </Button>
      <nav className="flex gap-4 items-center">
        <Link href="#" className="text-white">
          ATRACTIVOS
        </Link>
        <Link href="#" className="text-white">
          SOBRE NOSOTROS
        </Link>
        <Link href="#" className="text-white">
          CONTACTO
        </Link>
        <Button isIconOnly variant="light">
          <IoNotificationsOutline size={25} color="#fff" />
        </Button>
        <Avatar
          className="cursor-pointer"
          showFallback
          src="https://images.unsplash.com/broken"
        />
      </nav>
    </div>
  );
};

export default Topbar;
