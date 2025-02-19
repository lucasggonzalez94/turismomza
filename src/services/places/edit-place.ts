import axiosInstance from '@/config/axiosInstance';
import { IPlace } from '@/interfaces/place';

export const editPlaceService = async (
  formData: FormData,
  placeId: string,
): Promise<IPlace> => {
  const response = await axiosInstance.put(`/places/${placeId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
