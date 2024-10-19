'use server';

import axiosInstance from '@/config/axiosInstance';
import { Attraction } from '@/interfaces/attraction';

export const getAttractionBySlugService = async (
  slug: string,
): Promise<Attraction> => {
  const response = await axiosInstance.get(`/attractions/${slug}`);
  return response?.data;
};
