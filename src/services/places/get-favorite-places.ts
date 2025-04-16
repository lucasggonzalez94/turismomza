import axiosInstance from '@/config/axiosInstance';
import { ListPlacesProps } from '@/interfaces/listPlacesProps';

export const getFavoritePlacesService = async ({
  filters,
  page = 1,
  pageSize = 10,
}: ListPlacesProps): Promise<any> => {
  const response = await axiosInstance.get(`/places/favorites`, {
    params: {
      ...filters,
      page,
      pageSize,
    },
  });
  return response?.data;
};
