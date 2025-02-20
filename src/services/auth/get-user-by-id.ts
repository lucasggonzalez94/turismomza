import axiosInstance from '@/config/axiosInstance';
import { IUser } from '@/interfaces/user';

export const getUserByIdService = async (
  userId?: string,
): Promise<IUser | null> => {
  const response = await axiosInstance.get(`/auth/user/${userId}`);
  return response?.data;
};
