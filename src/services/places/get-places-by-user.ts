import axiosInstance from '@/config/axiosInstance';
import { ListPlacesByUserProps } from '@/interfaces/listPlacesProps';

export const getPlacesByUserService = async ({
  userId,
  filters,
  page = 1,
  pageSize = 10,
}: ListPlacesByUserProps): Promise<any> => {
  const response = await axiosInstance.get(`/places/user/${userId}`, {
    params: {
      ...filters,
      page,
      pageSize,
    },
  });
  return response?.data;
};
