import axiosInstance from '@/config/axiosInstance';
import { IPlace } from '@/interfaces/place';

export const createPlaceService = async (
  formData: FormData,
): Promise<IPlace> => {
  const response = await axiosInstance.post(`/places`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
