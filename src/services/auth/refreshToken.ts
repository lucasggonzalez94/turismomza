import axiosInstance from '@/config/axiosInstance';

export const refreshAccessToken = async () => {
  try {
    const res = await axiosInstance.post('/auth/refresh-token');

    if (res.status !== 200) {
      return null;
    } else {
      return res.data.accessToken;
    }
  } catch {
    throw new Error('Could not refresh token');
  }
};
