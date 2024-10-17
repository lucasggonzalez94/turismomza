import axiosInstance from '@/config/axiosInstance';

export const addFavoriteService = async (
  attractionId: string,
): Promise<any> => {
  const response = await axiosInstance.post(`/favorites`, {
    attractionId,
  });
  return response?.data;
};
