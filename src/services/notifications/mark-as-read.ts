import axiosInstance from '@/config/axiosInstance';

export const markAsReadService = async (
  notificationId: string,
): Promise<any> => {
  const response = await axiosInstance.post(
    `/notifications/read/${notificationId}`,
  );
  return response?.data;
};
