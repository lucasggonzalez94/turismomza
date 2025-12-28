'use client';

import React, { useState, useCallback, useMemo } from 'react';
import useNavigation from '@/hooks/useNavigation';
import { Button, Divider } from '@nextui-org/react';
import { IoTrashOutline } from 'react-icons/io5';
import { RiEditLine } from 'react-icons/ri';
import { formatDate, mapLanguages } from '@/utils/helpers';
import { toast } from 'sonner';
import { deleteUserService } from '@/services/auth/delete-user';
import Link from 'next/link';
import ProfilePicture from '../ui/ProfilePicture';
import { useAuthStore } from '@/store/authStore';
import CustomModal from '../ui/CustomModal';
import { Controller, useForm } from 'react-hook-form';
import InputPassword from '../ui/InputPassword';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUserService } from '@/services/auth/update-user';
import { IUser } from '@/interfaces/user';
import GoogleLinkButton from './GoogleLinkButton';

interface PasswordFormData {
  password: string;
  currentPassword: string;
}

const passwordSchema = yup
  .object({
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
      )
      .required('El campo es obligatorio.'),
    currentPassword: yup.string().required('El campo es obligatorio.'),
  })
  .required();

// Componente para mostrar estadísticas del usuario
const UserStats = ({
  places_count = 0,
  review_count = 0,
}: {
  places_count?: number;
  review_count?: number;
}) => (
  <div className="flex gap-6 justify-evenly items-center bg-white shadow-lg rounded-lg p-5">
    <div className="flex flex-col gap-1 items-center">
      <span className="text-4xl font-bold">{places_count}</span>
      <span className="text-sm">Publicaciones creadas</span>
    </div>
    <div className="flex flex-col gap-1 items-center">
      <span className="text-4xl font-bold">{review_count}</span>
      <span className="text-sm">Opiniones</span>
    </div>
  </div>
);

// Componente para mostrar información del usuario
const UserInfoCard = ({
  bio,
  location,
  website,
}: {
  bio?: string;
  location?: string;
  website?: string;
}) => (
  <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-start items-center bg-white shadow-lg rounded-lg p-5">
    <div className="w-full flex flex-col gap-2">
      <h4 className="text-sm font-bold">Bio</h4>
      <p className="text-sm">{bio || 'No existe una bio para este usuario.'}</p>
    </div>
    <Divider className="my-2" />
    <div className="w-full flex flex-col gap-2">
      <h4 className="text-sm font-bold">Ubicación</h4>
      <p className="text-sm">
        {location || 'No existe una ubicación para este usuario'}
      </p>
    </div>
    <Divider className="my-2" />
    <div className="w-full flex flex-col gap-2">
      <h4 className="text-sm font-bold">Sitio web</h4>
      {website ? (
        <Link
          href={website}
          className="text-sm text-trinidad-600 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          {website}
        </Link>
      ) : (
        <p className="text-sm">No existe un sitio web para este usuario</p>
      )}
    </div>
  </div>
);

const ProfileData = () => {
  const { handleSubmit, control } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      currentPassword: '',
    },
  });

  const { handleNavigation } = useNavigation();
  const { user, setUser } = useAuthStore();

  const [openPasswordChange, setOpenPasswordChange] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPasswordChange, setLoadingPasswordChange] = useState(false);

  const mappedLanguages = useMemo(
    () =>
      mapLanguages(user?.language || [])?.join(', ') ||
      'No existen idiomas para este usuario',
    [user?.language],
  );

  const handleDelete = useCallback(async () => {
    try {
      setLoadingDelete(true);
      await deleteUserService();
      handleNavigation('/');
    } catch {
      toast.error('¡Algo salio mal! Vuelve a intentarlo más tarde');
    } finally {
      setLoadingDelete(false);
    }
  }, [handleNavigation]);

  const handlePasswordChange = useCallback(
    async (data: PasswordFormData) => {
      try {
        setLoadingPasswordChange(true);

        const formData = new FormData();
        formData.append('password', data.password);
        formData.append('currentPassword', data.currentPassword);

        await updateUserService(formData);

        setUser({
          ...(user as IUser),
          hasPassword: true,
        });
        setOpenPasswordChange(false);
        toast.success('Contraseña actualizada correctamente.');
      } catch {
        toast.error('Error al actualizar la contraseña.');
      } finally {
        setLoadingPasswordChange(false);
      }
    },
    [user, setUser],
  );

  const openPasswordModal = useCallback(() => setOpenPasswordChange(true), []);

  const navigateToEditProfile = useCallback(
    () => handleNavigation('/profile/edit'),
    [handleNavigation],
  );

  const passwordModalTitle = useMemo(
    () => (user?.hasPassword ? 'Cambiar contraseña' : 'Establecer contraseña'),
    [user?.hasPassword],
  );

  return (
    <>
      <div className="flex flex-col flex-grow gap-3">
        <div className="flex gap-6 justify-start items-center mb-4">
          <ProfilePicture />
          <div className="flex flex-col">
            <h3 className="font-bold">{user?.name}</h3>
            <span className="text-tiny text-gray-600">
              Fecha de registro: {formatDate(user?.createdAt)}
            </span>
            <Link
              href={`mailto:${user?.email}`}
              className="text-tiny text-trinidad-600 hover:underline"
            >
              {user?.email}
            </Link>
          </div>
          <Button
            color="default"
            variant="flat"
            isIconOnly
            size="sm"
            onPress={navigateToEditProfile}
          >
            <RiEditLine size={20} />
          </Button>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-3 justify-between items-stretch">
          <UserInfoCard
            bio={user?.bio}
            location={user?.location}
            website={user?.website}
          />

          <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-start items-start bg-white shadow-lg rounded-lg p-5">
            <div className="w-full flex flex-col gap-2">
              <h4 className="text-sm font-bold">Idiomas</h4>
              <p className="text-sm">{mappedLanguages}</p>
            </div>
            <Divider className="my-2" />
            <div className="w-full h-full flex gap-3 items-end justify-end">
              {user?.hasPassword ? (
                <Button
                  size="sm"
                  color="primary"
                  variant="light"
                  onPress={openPasswordModal}
                >
                  Cambiar contraseña
                </Button>
              ) : (
                <Button
                  size="sm"
                  color="primary"
                  variant="light"
                  onPress={openPasswordModal}
                >
                  Establecer contraseña
                </Button>
              )}
              <GoogleLinkButton
                hasGoogleAccount={!!user?.googleId}
                hasPassword={!!user?.hasPassword}
              />
            </div>
            {/* TODO: Integrar 2FA */}
            {/* <div className="w-full h-full flex gap-3 items-end justify-end">
              <span className="text-sm">
                {'Autenticación en dos pasos (2FA)'}
              </span>
              <Switch
                defaultSelected={user?.two_factor_enabled}
                aria-label="2FA"
              />
            </div> */}
          </div>
        </div>

        <UserStats
          places_count={user?.places_count}
          review_count={user?.review_count}
        />

        <div className="flex gap-3 items-center">
          <Button
            className="bg-red-800 text-white"
            endContent={<IoTrashOutline />}
            isLoading={loadingDelete}
            onPress={handleDelete}
          >
            Eliminar perfil
          </Button>
        </div>
      </div>
      <CustomModal
        title={passwordModalTitle}
        isOpen={openPasswordChange}
        onOpenChange={setOpenPasswordChange}
        textButton="Guardar"
        onAction={handleSubmit(handlePasswordChange)}
        idForm="updatePassword"
        loadingAction={loadingPasswordChange}
      >
        <form
          id="updatePassword"
          onSubmit={handleSubmit(handlePasswordChange)}
          className="flex flex-col gap-8"
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputPassword
                label="Nueva contraseña"
                placeholder="Ingresa la nueva contraseña"
                required
                {...field}
              />
            )}
          />
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <InputPassword
                label={
                  user?.hasPassword
                    ? 'Contraseña actual'
                    : 'Confirmar contraseña'
                }
                placeholder={
                  user?.hasPassword
                    ? 'Ingresa tu contraseña actual'
                    : 'Ingresa la nueva contraseña'
                }
                required
                {...field}
              />
            )}
          />
        </form>
      </CustomModal>
    </>
  );
};

export default ProfileData;
