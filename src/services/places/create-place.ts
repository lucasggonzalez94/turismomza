import axiosInstance from '@/config/axiosInstance';
import { Place } from '@/interfaces/place';

export const createPlaceService = async (
  formData: FormData,
): Promise<Place> => {
  const response = await axiosInstance.post(`/places`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
