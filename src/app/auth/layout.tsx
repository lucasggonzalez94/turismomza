import Image from 'next/image';
import Link from 'next/link';
import { IoCloseCircleOutline } from 'react-icons/io5';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen w-screen flex relative">
      <Link href="/">
        <IoCloseCircleOutline size={40} className="absolute right-2 top-2" />
      </Link>
      <div className="hidden lg:block w-1/2 overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>
        <Image
          src="/images/logoTurismomza.webp"
          alt="Logo turismo mendoza"
          width={500}
          height={400}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
        />
        <Image
          src="/images/portada_auth.webp"
          alt="Uvas"
          width={500}
          height={400}
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        {children}
      </div>
    </main>
  );
}
