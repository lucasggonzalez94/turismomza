'use server';

import axiosInstance from '@/config/axiosInstance';
import { Pagination } from '@/interfaces/pagination';

export const getAttractionsService = async ({
  page = 1,
  pageSize = 10,
}: Pagination): Promise<any> => {
  const response = await axiosInstance.get(
    `/attractions?page=${page}&pageSize=${pageSize}`,
  );
  return response?.data;
};
