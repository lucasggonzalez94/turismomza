'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { LANGUAGES } from '@/utils/constants';
import { useStore } from '@/store/store';
import { updateUserService } from '@/services/auth/update-user';
import InputPassword from '../ui/InputPassword';
import ProfilePicture from '../ui/ProfilePicture';
import { useAuthStore } from '@/store/authStore';

const schema = yup
  .object({
    name: yup.string().trim().required('El campo es obligatorio.'),
    bio: yup
      .string()
      .optional()
      .min(5, 'La descripción debe tener un mínimo de 100 caractéres.')
      .max(200, 'La descripción debe tener un máximo de 500 caractéres.'),
    location: yup.string().optional(),
    website: yup.string().optional(),
    languages: yup.array().of(yup.string().required()).optional(),
    password: yup.string().required('El campo es obligatorio.'),
  })
  .required();

const EditProfileForm = () => {
  const { user, setUser } = useAuthStore((state) => state);
  const { loading, setLoading } = useStore((state) => state);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      bio: '',
      location: '',
      website: '',
      languages: [],
      password: '',
    },
  });

  const [selectedLanguageKeys, setSelectedLanguageKeys] = useState<Set<string>>(
    new Set([]),
  );

  const notifyError = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: 'bottom-right',
      theme: 'dark',
    });

  const handleSave = async (data: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bio', data.bio || '');
      formData.append('location', data.location || '');
      formData.append('website', data.website || '');
      formData.append('currentPassword', data.password);

      if (data.languages && data.languages.length > 0) {
        data.languages.forEach((lang: string) => {
          formData.append('languages[]', lang);
        });
      }

      const updatedUser = await updateUserService(formData);
      if (user) {
        setUser({
          ...user,
          ...updatedUser,
        });
      }

      notifySuccess('Usuario actualizado correctamente');
    } catch {
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('bio', user.bio || '');
      setValue('location', user.location || '');
      setValue('website', user.website || '');

      if (user.language && user.language.length > 0) {
        setValue('languages', user.language);
        setSelectedLanguageKeys(new Set(user.language));
      }
    }
  }, [user, setValue]);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center flex-grow gap-3 px-4 pb-8">
        <h1 className="w-1/2 font-bold text-xl text-center xl:text-left">
          Editar usuario
        </h1>
        <div className="w-full h-40 flex justify-center items-center mb-4">
          <ProfilePicture />
        </div>

        <div className="w-full xl:w-1/2 flex gap-3 justify-center items-center">
          <form
            id="updateUser"
            className="w-full flex flex-col gap-4 justify-center items-end bg-white shadow-lg rounded-lg p-5"
            onSubmit={handleSubmit(handleSave)}
          >
            <Input
              className="w-full"
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingresa tu nombre"
              variant="faded"
              isRequired
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              {...register('name')}
            />
            <Textarea
              className="w-full"
              label="Bio"
              labelPlacement="outside"
              placeholder="Ingresa una descripción sobre tí"
              variant="faded"
              isInvalid={!!errors.bio}
              errorMessage={errors.bio?.message}
              {...register('bio')}
            />
            <Input
              className="w-full"
              label="Ubicación"
              labelPlacement="outside"
              placeholder="Ingresa tu lugar de residencia"
              variant="faded"
              isInvalid={!!errors.location}
              errorMessage={errors.location?.message}
              {...register('location')}
            />
            <Input
              className="w-full"
              label="Website"
              labelPlacement="outside"
              placeholder="Ingresa tu sitio web"
              variant="faded"
              isInvalid={!!errors.website}
              errorMessage={errors.website?.message}
              {...register('website')}
            />
            <Controller
              name="languages"
              control={control}
              render={({ field: { onChange } }) => (
                <Select
                  label="Idiomas"
                  labelPlacement="outside"
                  placeholder="¿Qué idiomas hablas?"
                  selectionMode="multiple"
                  className="w-full"
                  variant="faded"
                  isInvalid={!!errors.languages}
                  errorMessage={errors.languages?.message}
                  selectedKeys={selectedLanguageKeys}
                  onSelectionChange={(keys) => {
                    const keysArray = Array.from(keys) as string[];
                    setSelectedLanguageKeys(new Set(keysArray));
                    onChange(keysArray);
                  }}
                >
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.key} value={lang.key}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <div className="flex flex-col gap-1 w-full">
              <Controller
                name="password"
                control={control}
                render={({ field }) => <InputPassword required {...field} />}
              />
            </div>
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              disabled={loading}
            >
              Guardar
            </Button>
          </form>
        </div>
      </div>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default EditProfileForm;
