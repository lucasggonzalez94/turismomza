'use client';

import React from 'react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { IoCamera } from 'react-icons/io5';
import { yupResolver } from '@hookform/resolvers/yup';
import { LANGUAGES } from '@/utils/constants';

interface IPropsEditProfileForm {
  userId: string;
}

const schema = yup
  .object({
    name: yup.string().required('El campo es obligatorio.'),
    bio: yup
      .string()
      .min(100, 'La descripción debe tener un mínimo de 100 caractéres.')
      .max(500, 'La descripción debe tener un máximo de 500 caractéres.'),
    location: yup.string(),
    website: yup.string(),
    languages: yup.array().of(yup.string().required()),
  })
  .required();

const EditProfileForm = ({ userId }: IPropsEditProfileForm) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      bio: '',
      location: '',
      website: '',
      languages: [],
    },
  });

  const handleSave = (data: any) => {};

  return (
    <div className="w-full flex flex-col justify-center items-center flex-grow gap-3 px-4 pb-8">
      <h1 className="w-1/2 font-bold text-xl">Editar usuario</h1>
      <div className="w-full flex gap-6 justify-center items-center mb-4">
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
      </div>

      <div className="w-1/2 flex gap-3 justify-center items-center">
        <form
          className="w-full flex flex-col gap-4 justify-center items-center bg-white shadow-lg rounded-lg p-5"
          onSubmit={handleSubmit(handleSave)}
        >
          <Input
            className="w-full"
            label="Nombre"
            labelPlacement="outside"
            placeholder="Ingresa tu nombre"
            variant="faded"
            isRequired
            isInvalid={!!errors.name?.message}
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <Textarea
            className="w-full"
            label="Bio"
            labelPlacement="outside"
            placeholder="Ingresa una descripción sobre tí"
            variant="faded"
            {...register('bio')}
          />
          <Input
            className="w-full"
            label="Ubicación"
            labelPlacement="outside"
            placeholder="Ingresa tu lugar de residencia"
            variant="faded"
            {...register('location')}
          />
          <Input
            className="w-full"
            label="Website"
            labelPlacement="outside"
            placeholder="Ingresa tu sitio web"
            variant="faded"
            {...register('website')}
          />
          <Controller
            name="languages"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Idiomas"
                labelPlacement="outside"
                placeholder="¿Qué idiomas hablas?"
                selectionMode="multiple"
                className="w-full"
                value={
                  (value?.filter((val) => val !== undefined) as string[]) || []
                }
                defaultSelectedKeys={[]}
                onChange={(e) => {
                  onChange(e.target.value.split(','));
                }}
                variant="faded"
              >
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.key} value={lang.key}>
                    {lang.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </form>
      </div>

      <div className="w-1/2 flex gap-3 justify-end items-center">
        <Button color="primary">Guardar</Button>
      </div>
    </div>
  );
};

export default EditProfileForm;
