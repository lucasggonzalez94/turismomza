'use server';

import axiosInstance from '@/config/axiosInstance';
import { ListPlacesProps } from '@/interfaces/listPlacesProps';

export const getPlacesService = async ({
  filters,
  page = 1,
  pageSize = 10,
}: ListPlacesProps): Promise<any> => {
  const response = await axiosInstance.get(`/places`, {
    params: {
      ...filters,
      page,
      pageSize,
    },
  });
  return response?.data;
};
