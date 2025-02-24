import axiosInstance from '@/config/axiosInstance';
import { IUser } from '@/interfaces/user';

export const updateUserService = async (formData: FormData): Promise<IUser> => {
  const response = await axiosInstance.put(`/auth/update`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
