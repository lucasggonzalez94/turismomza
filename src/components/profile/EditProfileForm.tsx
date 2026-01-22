'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'sonner';
import { yupResolver } from '@hookform/resolvers/yup';
import { LANGUAGES } from '@/utils/constants';
import { updateUserService } from '@/services/auth/update-user';
import InputPassword from '../ui/InputPassword';
import ProfilePicture from '../ui/ProfilePicture';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { MultiSelect } from '@/components/places/MultiSelect';

const schema = yup
  .object({
    name: yup.string().trim().required('El campo es obligatorio.'),
    bio: yup
      .string()
      .optional()
      .min(50, 'La descripción debe tener un mínimo de 50 caractéres.')
      .max(160, 'La descripción debe tener un máximo de 160 caractéres.'),
    location: yup.string().optional(),
    website: yup
      .string()
      .optional()
      .test(
        'is-valid-url',
        'Debes ingresar una URL válida con https.',
        (value) => {
          if (!value) return true;
          return /^https:\/\/([\w-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/.test(
            value.trim(),
          );
        },
      ),
    languages: yup.array().of(yup.string().required()).optional(),
    password: yup.string().required('El campo es obligatorio.'),
  })
  .required();

const EditProfileForm = () => {
  const { user, setUser } = useAuthStore((state) => state);

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

  const [loading, setLoading] = useState(false);

  const handleSave = async (data: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('bio', data.bio || '');
      formData.append('location', data.location || '');
      formData.append('website', data.website || '');
      if (user?.hasPassword) {
        formData.append('currentPassword', data.password);
      }

      if (data.languages && data.languages.length > 0) {
        data.languages.forEach((lang: string) => {
          formData.append('language[]', lang);
        });
      }

      const updatedUser = await updateUserService(formData);
      if (user) {
        setUser({
          ...user,
          ...updatedUser,
        });
      }

      toast.success('Usuario actualizado correctamente');
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
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
      }
    }
  }, [user, setValue]);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center flex-grow gap-3">
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
              containerClassName="w-full"
              label="Nombre"
              placeholder="Ingresa tu nombre"
              requiredMark
              errorMessage={errors.name?.message}
              {...register('name')}
            />
            <Textarea
              containerClassName="w-full"
              label="Bio"
              placeholder="Contá brevemente quién sos o qué tipo de viajero sos (máx. 160 caracteres)"
              errorMessage={errors.bio?.message}
              minCharacters={50}
              maxCharacters={160}
              {...register('bio')}
            />
            <Input
              containerClassName="w-full"
              label="Ubicación"
              placeholder="Ej: Mendoza, Argentina"
              errorMessage={errors.location?.message}
              {...register('location')}
            />
            <Input
              containerClassName="w-full"
              label="Website"
              placeholder="https://"
              errorMessage={errors.website?.message}
              {...register('website')}
            />
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Idiomas"
                  placeholder="¿Qué idiomas hablas?"
                  selected={field.value || []}
                  onChange={(values) => field.onChange(values)}
                  categories={LANGUAGES}
                  className="w-full"
                />
              )}
            />
            {user?.hasPassword && (
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <InputPassword
                    required
                    error={errors.password?.message}
                    {...field}
                  />
                )}
              />
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfileForm;
