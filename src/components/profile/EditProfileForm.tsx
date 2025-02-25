'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoCamera } from 'react-icons/io5';
import { yupResolver } from '@hookform/resolvers/yup';
import { LANGUAGES } from '@/utils/constants';
import { useStore } from '@/store/store';
import { updateUserService } from '@/services/auth/update-user';
import SliderCarousel from '../ui/SliderCarousel/SliderCarousel';
import CustomModal from '../ui/CustomModal';
import ImageUploader from '../ui/ImageUploader';
import InputPassword from '../ui/InputPassword';

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
  const { user, setUser, loading, setLoading } = useStore((state) => state);

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

  const [openProfilePicture, setOpenProfilePicture] = useState(false);
  const [openUploadProfilePicture, setOpenUploadProfilePicture] =
    useState(false);
  const [profilePicture, setProfilePicture] = useState<File[]>([]);
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

  const handleUpdateProfilePicture = async (profilePicture: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('profilePicture', profilePicture);

      const updatedUser = await updateUserService(formData);
      if (user) {
        setUser({
          ...user,
          profilePicture: updatedUser?.profilePicture,
        });
      }
      setProfilePicture([]);
      setOpenUploadProfilePicture(false);
      notifySuccess('Foto de perfil actualizada correctamente');
    } catch {
      notifyError();
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="w-1/2 font-bold text-xl">Editar usuario</h1>
        <div className="w-full flex gap-6 justify-center items-center mb-4">
          <div className="relative group w-[8%] aspect-square object-center rounded-full overflow-hidden cursor-pointer">
            <Image
              src={user?.profilePicture?.url || '/images/default-image.webp'}
              alt="Foto de perfil"
              width={200}
              height={200}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
            />
            <div
              className="absolute inset-0 flex items-end justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={() => setOpenProfilePicture(true)}
            >
              <div
                className="bg-black bg-opacity-60 p-2 rounded-md flex justify-center items-center gap-2 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenUploadProfilePicture(true);
                }}
              >
                <IoCamera size={25} color="white" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex gap-3 justify-center items-center">
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
      {user?.profilePicture && openProfilePicture && (
        <SliderCarousel
          images={[user?.profilePicture?.url]}
          profilePicture
          onClose={() => setOpenProfilePicture(false)}
        />
      )}
      <CustomModal
        title="Cargar foto de perfil"
        isOpen={openUploadProfilePicture}
        onOpenChange={() => setOpenUploadProfilePicture(false)}
        textButton="Guardar"
        onAction={() => handleUpdateProfilePicture(profilePicture[0])}
        disableAction={!profilePicture.length || loading}
        loadingAction={loading}
      >
        <ImageUploader
          onImagesChange={setProfilePicture}
          maxImages={1}
          minImages={1}
        />
      </CustomModal>
    </>
  );
};

export default EditProfileForm;
