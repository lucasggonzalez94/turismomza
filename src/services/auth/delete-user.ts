import axiosInstance from '@/config/axiosInstance';

export const deleteUserService = async (): Promise<any> => {
  const response = await axiosInstance.post(`/auth/delete`);
  return response?.data;
};
