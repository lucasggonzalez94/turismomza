import axiosInstance from '@/config/axiosInstance';
import { IPlace } from '@/interfaces/place';

export const getPlaceBySlugService = async (
  slug: string,
  userId?: string,
): Promise<IPlace> => {
  const response = await axiosInstance.get(`/places/${slug}`, {
    params: {
      userId,
    },
  });
  return response?.data;
};
