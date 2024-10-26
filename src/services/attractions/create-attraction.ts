import axiosInstance from '@/config/axiosInstance';
import { Attraction } from '@/interfaces/attraction';

export const createAttractionService = async (
  formData: FormData,
): Promise<Attraction> => {
  const response = await axiosInstance.post(`/attractions`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
