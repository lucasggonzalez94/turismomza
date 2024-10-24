import axiosInstance from '@/config/axiosInstance';
import { Notification } from '@/interfaces/notification';

export const listNotificationsService = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get(`/notifications`);
  return response?.data;
};
