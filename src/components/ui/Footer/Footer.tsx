import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="p-6 min-h-28 h-auto w-full flex justify-between items-center bg-black">
      <Link href="/" className="col-span-5">
        <Image
          src="/images/logoTurismomza.png"
          alt="Logo turismo mendoza"
          width={250}
          height={100}
          priority
        ></Image>
      </Link>
      <nav className="flex flex-col items-end lg:flex-row gap-4 lg:items-center lg:justify-end text-end text-sm text-gray-300 md:text-md">
        <Link href="/faqs">FAQs</Link>
        <Link href="/">CONTACTO</Link>
        <Link href="/about">SOBRE NOSOTROS</Link>
        <Link href="/tyc">TÉRMINOS Y CONDICIONES</Link>
      </nav>
    </div>
  );
};

export default Footer;
