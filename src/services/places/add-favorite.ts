import axiosInstance from '@/config/axiosInstance';

export const addFavoriteService = async (placeId: string): Promise<any> => {
  const response = await axiosInstance.post(`/favorites`, {
    placeId,
  });
  return response?.data;
};
