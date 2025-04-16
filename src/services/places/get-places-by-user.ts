import axiosInstance from '@/config/axiosInstance';
import { ListPlacesProps } from '@/interfaces/listPlacesProps';

export const getPlacesByUserService = async ({
  filters,
  page = 1,
  pageSize = 10,
}: ListPlacesProps): Promise<any> => {
  const response = await axiosInstance.get(`/places/user`, {
    params: {
      ...filters,
      page,
      pageSize,
    },
  });
  return response?.data;
};
