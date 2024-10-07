import Image from 'next/image';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen w-screen flex">
      <div className="w-1/2 overflow-hidden relative">
        <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>
        <Image
          src="/images/logoTurismomza.png"
          alt="Logo turismo mendoza"
          width={500}
          height={400}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
        <Image
          src="/images/portada_auth.jpeg"
          alt="Uvas"
          width={500}
          height={400}
          className="object-cover object-center w-full"
        />
      </div>
      <div className="w-1/2 flex justify-center items-center">{children}</div>
    </main>
  );
}
