import axiosInstance from '@/config/axiosInstance';
import { Attraction } from '@/interfaces/attraction';

export const editAttractionService = async (
  formData: FormData,
  attractionId: string,
): Promise<Attraction> => {
  const response = await axiosInstance.put(
    `/attractions/${attractionId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
