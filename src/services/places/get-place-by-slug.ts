import axiosInstance from '@/config/axiosInstance';
import { IPlace } from '@/interfaces/place';

export const getPlaceBySlugService = async (
  slug: string,
  userId?: string,
): Promise<IPlace | null> => {
  try {
    const response = await axiosInstance.get(`/places/${slug}`, {
      params: {
        userId,
      },
    });
    return response?.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};
