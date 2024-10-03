import Image from 'next/image';
import { Avatar, Badge, Button } from '@nextui-org/react';
import Link from 'next/link';
import DropdownSearch from '../DropdownSearch/DropdownSearch';
import DropdownNotifications from '../DropdownNotifications/DropdownNotifications';

const Topbar = () => {
  const notifications = [
    { id: 1, user: 'John Doe', type: 'like', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', type: 'comment', time: '5 minutes ago' },
    { id: 3, user: 'Mike Johnson', type: 'like', time: '10 minutes ago' },
    { id: 4, user: 'Sarah Brown', type: 'comment', time: '15 minutes ago' },
  ];

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
          <Link href="attractions" className="text-white">
            ATRACTIVOS
          </Link>
          <Link href="about" className="text-white">
            SOBRE NOSOTROS
          </Link>
          <Link href="contact" className="text-white">
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
          <Badge content="5" color="primary" className="border-none">
            <DropdownNotifications notifications={notifications} />
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
