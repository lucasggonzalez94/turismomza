import axiosInstance from '@/config/axiosInstance';

export const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post('/auth/refresh-token', {
      withCredentials: true,
    });

    return response.data.accessToken;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error refreshing token:', error);
    throw new Error('Could not refresh token');
  }
};
