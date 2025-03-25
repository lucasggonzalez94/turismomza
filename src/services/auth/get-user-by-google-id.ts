import axiosInstance from '@/config/axiosInstance';
import { IUser } from '@/interfaces/user';

export const getUserByGoogleIdService = async (
  googleId?: string,
): Promise<IUser | null> => {
  const response = await axiosInstance.get(`/auth/user/google/${googleId}`);
  return response?.data;
};
