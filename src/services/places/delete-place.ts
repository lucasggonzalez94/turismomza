import axiosInstance from '@/config/axiosInstance';

export const deletePlaceService = async (placeId: string): Promise<any> => {
  const response = await axiosInstance.delete(`/places/${placeId}`);
  return response?.data;
};
