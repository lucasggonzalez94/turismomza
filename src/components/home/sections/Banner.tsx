import React from 'react';
import Link from 'next/link';

import { IoArrowForwardCircleOutline } from 'react-icons/io5';

const Banner = () => {
  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center p-24"
      style={{
        backgroundImage: 'url(/images/background.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col gap-5">
        <h1 className="text-white text-5xl text-left font-magiesta select-none">
          Descubre lo mejor de<br></br>
          <span className="text-9xl">Mendoza</span>
        </h1>
        <Link
          href="#"
          className="text-lg text-white flex items-center justify-between w-[240px] transition-transform duration-300 transform hover:scale-110"
        >
          Comienza tu aventura
          <IoArrowForwardCircleOutline size={25} />
        </Link>
      </div>
    </div>
  );
};

export default Banner;
