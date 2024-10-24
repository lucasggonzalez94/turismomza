import axiosInstance from '@/config/axiosInstance';

export const markAsReadedService = async (
  notificationId: string,
): Promise<any> => {
  const response = await axiosInstance.post(`/notifications/mark-as-read`, {
    notificationId,
  });
  return response?.data;
};
