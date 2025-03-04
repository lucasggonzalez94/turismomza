import axiosInstance from '@/config/axiosInstance';

export const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token');

    return response.data.accessToken;
  } catch {
    throw new Error('Could not refresh token');
  }
};
