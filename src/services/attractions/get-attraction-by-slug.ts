import axiosInstance from '@/config/axiosInstance';
import { Attraction } from '@/interfaces/attraction';

export const getAttractionBySlugService = async (
  slug: string,
  userId?: string,
): Promise<Attraction> => {
  const response = await axiosInstance.get(`/attractions/${slug}`, {
    params: {
      userId,
    },
  });
  return response?.data;
};
