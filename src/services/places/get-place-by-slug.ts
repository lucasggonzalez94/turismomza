import axiosInstance from '@/config/axiosInstance';
import { Place } from '@/interfaces/place';

export const getPlaceBySlugService = async (
  slug: string,
  userId?: string,
): Promise<Place> => {
  const response = await axiosInstance.get(`/places/${slug}`, {
    params: {
      userId,
    },
  });
  return response?.data;
};
