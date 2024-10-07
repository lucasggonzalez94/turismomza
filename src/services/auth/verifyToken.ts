import axiosInstance from '@/config/axiosInstance';

export const verifyToken = async () => {
  try {
    const response = await axiosInstance.get('/auth/verify-token', {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }

    throw new Error('Verify failed');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during verify:', error);
    throw new Error('Verify failed');
  }
};
