'use client';

import React from 'react';
import useNavigation from '@/hooks/useNavigation';
import { useStore } from '@/store/store';
import { Button, Divider } from '@nextui-org/react';
import { IoTrashOutline } from 'react-icons/io5';
import { RiEditLine } from 'react-icons/ri';
import { formatDate, mapLanguages } from '@/utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteUserService } from '@/services/auth/delete';
import Link from 'next/link';
import ProfilePicture from '../ui/ProfilePicture';
import { useAuthStore } from '@/store/authStore';

const ProfileData = () => {
  const { handleNavigation } = useNavigation();
  const user = useAuthStore((state) => state.user);
  const { loading, setLoading } = useStore((state) => state);

  const notifyError = (message?: string) =>
    toast.error(message ?? '¡Algo salio mal! Vuelve a intentarlo más tarde', {
      position: 'bottom-right',
      theme: 'dark',
    });

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUserService();
      handleNavigation('/');
    } catch {
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-grow gap-3 px-4 pb-8">
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
            onPress={() => handleNavigation('/profile/edit')}
          >
            <RiEditLine size={20} />
          </Button>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-3 justify-between items-stretch">
          <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-start items-center bg-white shadow-lg rounded-lg p-5">
            <div className="w-full flex flex-col gap-2">
              <h4 className="text-sm font-bold">Bio</h4>
              <p className="text-sm">
                {user?.bio || 'No existe una bio para este usuario.'}
              </p>
            </div>
            <Divider className="my-2" />
            <div className="w-full flex flex-col gap-2">
              <h4 className="text-sm font-bold">Ubicación</h4>
              <p className="text-sm">
                {user?.location || 'No existe una ubicación para este usuario'}
              </p>
            </div>
            <Divider className="my-2" />
            <div className="w-full flex flex-col gap-2">
              <h4 className="text-sm font-bold">Sitio web</h4>
              {user?.website ? (
                <Link
                  href={user?.website}
                  className="text-sm text-trinidad-600 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {user?.website}
                </Link>
              ) : (
                <p className="text-sm">
                  No existe un sitio web para este usuario
                </p>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-start items-start bg-white shadow-lg rounded-lg p-5">
            <div className="w-full flex flex-col gap-2">
              <h4 className="text-sm font-bold">Idiomas</h4>
              <p className="text-sm">
                {mapLanguages(user?.language || [])?.join(', ') ||
                  'No existen idiomas para este usuario'}
              </p>
            </div>
            <Divider className="my-2" />
            {/* TODO: Integrar cambio de password */}
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

        <div className="flex gap-6 justify-evenly items-center bg-white shadow-lg rounded-lg p-5">
          <div className="flex flex-col gap-1 items-center">
            <span className="text-4xl font-bold">
              {user?.places_count || 0}
            </span>
            <span className="text-sm">Publicaciones creadas</span>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-4xl font-bold">
              {user?.review_count || 0}
            </span>
            <span className="text-sm">Opiniones</span>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* <Button color="primary">Guardar</Button> */}
          <Button
            className="bg-red-800 text-white"
            endContent={<IoTrashOutline />}
            isLoading={loading}
            onPress={handleDelete}
          >
            Eliminar perfil
          </Button>
        </div>
      </div>
      <ToastContainer autoClose={10000} />
    </>
  );
};

export default ProfileData;
