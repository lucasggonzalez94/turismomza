import axiosInstance from '@/config/axiosInstance';
import { INotification } from '@/interfaces/notification';

export const listNotificationsService = async (): Promise<INotification[]> => {
  const response = await axiosInstance.get(`/notifications`);
  return response?.data;
};
