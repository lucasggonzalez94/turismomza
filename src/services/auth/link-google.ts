'use client';

import { IUser } from '@/interfaces/user';
import axiosInstance from '@/config/axiosInstance';

export const linkGoogleAccount = async (googleId: string): Promise<IUser> => {
  try {
    const response = await axiosInstance.post('/auth/link-google', {
      googleId,
    });

    if (response.status === 200) {
      return response.data.user;
    }

    throw new Error('Error al vincular la cuenta de Google');
  } catch (error: any) {
    throw (
      error.response?.data?.error || 'Error al vincular la cuenta de Google'
    );
  }
};
