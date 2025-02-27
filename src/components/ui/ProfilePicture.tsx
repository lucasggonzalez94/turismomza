'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoCamera } from 'react-icons/io5';
import { useStore } from '@/store/store';
import { updateUserService } from '@/services/auth/update-user';
import SliderCarousel from './SliderCarousel/SliderCarousel';
import CustomModal from './CustomModal';
import ImageUploader from './ImageUploader';
import { useAuthStore } from '@/store/authStore';

interface IPropsProfilePicture {
  changePicture?: boolean;
  openPicture?: boolean;
}

const ProfilePicture: FC<IPropsProfilePicture> = ({
  changePicture = true,
  openPicture = true,
}) => {
  const { user, setUser } = useAuthStore((state) => state);
  const { loading, setLoading } = useStore((state) => state);

  const [openProfilePicture, setOpenProfilePicture] = useState(false);
  const [openUploadProfilePicture, setOpenUploadProfilePicture] =
    useState(false);
  const [profilePicture, setProfilePicture] = useState<File[]>([]);

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

  return (
    <>
      <div className="relative group h-full max-h-44 aspect-square object-center rounded-full overflow-hidden cursor-pointer">
        <Image
          src={user?.profilePicture?.url || '/images/default-image.webp'}
          alt="Foto de perfil"
          width={200}
          height={200}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
        />
        <div
          className="absolute inset-0 flex items-end justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => openPicture && setOpenProfilePicture(true)}
        >
          {changePicture && (
            <div
              className="bg-black bg-opacity-60 p-2 rounded-md flex justify-center items-center gap-2 w-full"
              onClick={(e) => {
                e.stopPropagation();
                setOpenUploadProfilePicture(true);
              }}
            >
              <IoCamera size={25} color="white" />
            </div>
          )}
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

export default ProfilePicture;
