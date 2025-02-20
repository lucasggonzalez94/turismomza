import { Divider } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';

const ProfileView = () => {
  return (
    <div className="flex flex-col flex-grow gap-3 px-4 pb-8">
      <div className="flex gap-6 justify-start items-center mb-4">
        <div className="relative group w-[8%] aspect-square object-center rounded-full overflow-hidden cursor-pointer">
          <Image
            src="/images/default-image.webp"
            alt="Foto de perfil"
            width={200}
            height={200}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
          <div className="absolute inset-0 flex items-end justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold">Lucas Gonzalez</h3>
          <span className="text-tiny text-gray-600">
            Fecha de registro: 20/02/2025
          </span>
          <span className="text-tiny underline">lucasgggonzalez@gmail.com</span>
        </div>
      </div>

      <div className="flex gap-3 justify-between items-start">
        <div className="w-full flex flex-col gap-4 justify-start items-center bg-white shadow-lg rounded-lg p-5">
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-sm font-bold">Bio</h4>
            <p className="text-sm">Desarrollador Full stack.</p>
          </div>
          <Divider className="my-2" />
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-sm font-bold">Ubicación</h4>
            <p className="text-sm">Mendoza, Argentina</p>
          </div>
          <Divider className="my-2" />
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-sm font-bold">Website</h4>
            <p className="text-sm">www.lucasgonzalez.com</p>
          </div>
          <Divider className="my-2" />
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-sm font-bold">Idiomas</h4>
            <p className="text-sm">Español</p>
          </div>
        </div>
      </div>
      <div className="flex gap-6 justify-evenly items-center bg-white shadow-lg rounded-lg p-5">
        <div className="flex flex-col gap-1 items-center">
          <span className="text-4xl font-bold">2</span>
          <span className="text-sm">Publicaciones creadas</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-4xl font-bold">5</span>
          <span className="text-sm">Opiniones</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
