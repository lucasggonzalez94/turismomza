'use client';

import useNavigation from '@/hooks/useNavigation';
import { Button, Divider, Switch } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';
import { IoCamera, IoTrashOutline } from 'react-icons/io5';
import { RiEditLine } from 'react-icons/ri';

const ProfileData = () => {
  const { handleNavigation } = useNavigation();

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
          <div className="absolute inset-0 flex items-end justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black bg-opacity-60 p-2 rounded-md flex justify-center items-center gap-2 w-full">
              <IoCamera size={25} color="white" />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold">Lucas Gonzalez</h3>
          <span className="text-tiny text-gray-600">
            Fecha de registro: 20/02/2025
          </span>
          <span className="text-tiny underline">lucasgggonzalez@gmail.com</span>
        </div>
        <Button
          color="default"
          variant="flat"
          isIconOnly
          size="sm"
          onPress={() => handleNavigation('/profile/edit/12345345')}
        >
          <RiEditLine size={20} />
        </Button>
      </div>

      <div className="flex gap-3 justify-between items-start">
        <div className="w-1/2 flex flex-col gap-4 justify-start items-center bg-white shadow-lg rounded-lg p-5">
          {/* <Textarea
            isReadOnly
            className="w-full"
            defaultValue="HeroUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
            label="Bio"
            labelPlacement="outside"
            placeholder="Enter your description"
            variant="faded"
          />
          <Input
            isReadOnly
            className="w-full"
            defaultValue="Mendoza, Argentina"
            label="Ubicación"
            labelPlacement="outside"
            variant="faded"
          />
          <Input
            isReadOnly
            className="w-full"
            defaultValue="www.lucasgonzalez.com"
            label="Website"
            labelPlacement="outside"
            variant="faded"
          /> */}
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
        </div>
        <div className="w-1/2 flex flex-col gap-4 justify-start items-start bg-white shadow-lg rounded-lg p-5">
          {/* <Input
            isReadOnly
            className="w-full"
            defaultValue="Español"
            label="Idiomas"
            labelPlacement="outside"
            variant="faded"
          /> */}
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-sm font-bold">Idiomas</h4>
            <p className="text-sm">Español</p>
          </div>
          <Divider className="my-2" />
          <div className="flex gap-3 items-center">
            <span className="text-sm">
              {'Autenticación en dos pasos (2FA)'}
            </span>
            <Switch defaultSelected aria-label="2FA" />
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
      <div className="flex gap-3 justify-end items-center">
        {/* <Button color="primary">Guardar</Button> */}
        <Button
          className="bg-red-800 text-white"
          endContent={<IoTrashOutline />}
        >
          Eliminar perfil
        </Button>
      </div>
    </div>
  );
};

export default ProfileData;
