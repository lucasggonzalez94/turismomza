'use client';

import React, { useEffect, useState } from 'react';
import { Divider } from '@nextui-org/react';
import { getUserByIdService } from '@/services/auth/get-user-by-id';
import { IUser } from '@/interfaces/user';
import { useRouter } from 'next/navigation';
import { formatDate, mapLanguages } from '@/utils/helpers';
import ProfilePicture from '../ui/ProfilePicture';
import Link from 'next/link';
import { useLoadingStore } from '@/store/loadingStore';

interface IPropsProfileView {
  userId: string;
}

const ProfileView = ({ userId }: IPropsProfileView) => {
  const router = useRouter();
  const { setLoading } = useLoadingStore((state) => state);

  const [user, setUser] = useState<IUser | null>(null);

  const getUser = async () => {
    try {
      setLoading(true);
      const user = await getUserByIdService(userId);
      setUser(user);
    } catch {
      router.push('/not-found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
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
      </div>

      <div className="flex gap-3 justify-between items-start">
        <div className="w-full flex flex-col gap-4 justify-start items-center bg-white shadow-lg rounded-lg p-5">
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
          <Divider className="my-2" />
          <div className="w-full flex flex-col gap-2">
            <h4 className="text-sm font-bold">Idiomas</h4>
            <p className="text-sm">
              {mapLanguages(user?.language || [])?.join(', ') ||
                'No existen idiomas para este usuario'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-6 justify-evenly items-center bg-white shadow-lg rounded-lg p-5">
        <div className="flex flex-col gap-1 items-center">
          <span className="text-4xl font-bold">{user?.places_count || 0}</span>
          <span className="text-sm">Publicaciones creadas</span>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-4xl font-bold">{user?.review_count || 0}</span>
          <span className="text-sm">Opiniones</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
