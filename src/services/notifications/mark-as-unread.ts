import axiosInstance from '@/config/axiosInstance';

export const markAsUnreadService = async (
  notificationId: string,
): Promise<any> => {
  const response = await axiosInstance.post(
    `/notifications/unread/${notificationId}`,
  );
  return response?.data;
};
