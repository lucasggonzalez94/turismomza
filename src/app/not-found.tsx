import Image from 'next/image';

export default function () {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen w-screen">
      <Image src="/images/404.svg" alt="404" width={300} height={300} />
      <h2>¡Algo salio mal! Vuelve a intentarlo más tarde</h2>
    </div>
  );
}
