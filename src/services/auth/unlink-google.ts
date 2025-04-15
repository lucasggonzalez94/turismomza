'use client';

import { IUser } from '@/interfaces/user';
import axiosInstance from '@/config/axiosInstance';

export const unlinkGoogleAccount = async (): Promise<IUser> => {
  try {
    const response = await axiosInstance.post('/auth/unlink-google');

    if (response.status === 200) {
      return response.data.user;
    }

    throw new Error('Error al desvincular la cuenta de Google');
  } catch (error: any) {
    throw (
      error.response?.data?.error || 'Error al desvincular la cuenta de Google'
    );
  }
};
