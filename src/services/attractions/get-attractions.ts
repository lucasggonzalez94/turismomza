'use server';

import axiosInstance from '@/config/axiosInstance';
import { ListAttractionsProps } from '@/interfaces/listAttractionsProps';

export const getAttractionsService = async ({
  filters,
  page = 1,
  pageSize = 10,
}: ListAttractionsProps): Promise<any> => {
  const response = await axiosInstance.get(`/attractions`, {
    params: {
      ...filters,
      page,
      pageSize,
    },
  });
  return response?.data;
};
