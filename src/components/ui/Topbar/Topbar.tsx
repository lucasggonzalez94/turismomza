import Image from 'next/image';
import { IoNotificationsOutline } from 'react-icons/io5';
import { Avatar, Badge, Button } from '@nextui-org/react';
import Link from 'next/link';
import DropdownSearch from '../DropdownSearch/DropdownSearch';

const Topbar = () => {
  return (
    <div className="grid grid-cols-11 grid-rows-1 gap-1 items-center px-6 h-24 absolute w-screen">
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
          <DropdownSearch />
        </div>
      </div>

      <div className="hidden 2xl:block col-span-5">
        <nav className="flex gap-4 items-center justify-end">
          <Link href="#" className="text-white">
            ATRACTIVOS
          </Link>
          <Link href="#" className="text-white">
            SOBRE NOSOTROS
          </Link>
          <Link href="#" className="text-white">
            CONTACTO
          </Link>
          <Button color="secondary" className="text-medium">
            Publicar
          </Button>
          <Button
            color="secondary"
            className="text-medium font-bold w-10 h-10 min-w-10"
          >
            ES
          </Button>
          <Badge content="5" color="primary">
            <Button isIconOnly variant="light">
              <IoNotificationsOutline size={25} color="#fff" />
            </Button>
          </Badge>
          <Avatar
            className="cursor-pointer"
            showFallback
            src="https://images.unsplash.com/broken"
          />
        </nav>
      </div>
    </div>
  );
};

export default Topbar;
