'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useNavigationStore } from '@/store/navigationStore';

const Footer = () => {
  const { setBackPath } = useNavigationStore((state) => state);
  const pathname = usePathname();

  const links = [
    { text: 'FAQs', href: '/faqs', onClick: () => setBackPath(pathname) },
    { text: 'CONTACTO', href: '/', onClick: () => setBackPath(pathname) },
    {
      text: 'TÉRMINOS Y CONDICIONES',
      href: '/tyc',
      onClick: () => setBackPath(pathname),
    },
  ];

  return (
    <div className="p-6 min-h-28 h-auto w-full hidden md:flex justify-between items-center bg-black">
      <Link href="/" className="col-span-5">
        <Image
          src="/images/logoTurismomza.webp"
          alt="Logo turismo mendoza"
          width={250}
          height={100}
          priority
        ></Image>
      </Link>
      <nav className="flex flex-col items-end lg:flex-row gap-4 lg:items-center lg:justify-end text-end text-sm text-gray-300 md:text-md">
        {links.map((link) => (
          <Link key={link.text} href={link.href} onClick={link.onClick}>
            {link.text}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Footer;
