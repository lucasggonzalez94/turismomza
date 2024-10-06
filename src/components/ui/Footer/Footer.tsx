import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="p-6 min-h-28 h-auto w-full flex justify-between items-center bg-black">
      <Link href="/" className="col-span-5">
        <Image
          src="/images/logoTurimomza.png"
          alt="Logo turismo mendoza"
          width={250}
          height={100}
          priority
        ></Image>
      </Link>
      <nav className="flex flex-col items-end lg:flex-row gap-4 lg:items-center lg:justify-end text-gray-300">
        <Link href="about">FAQs</Link>
        <Link href="contact">CONTACTO</Link>
        <Link href="contact">SOBRE NOSOTROS</Link>
        <Link href="attractions">TÉRMINOS Y CONDICIONES</Link>
      </nav>
    </div>
  );
};

export default Footer;
