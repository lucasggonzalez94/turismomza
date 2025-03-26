import axiosInstance from '@/config/axiosInstance';
import { INotification } from '@/interfaces/notification';

export const listNotificationsService = async (): Promise<INotification[]> => {
  const response = await axiosInstance.get(`/notifications`, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
  return response?.data;
};
