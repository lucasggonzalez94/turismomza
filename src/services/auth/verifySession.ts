import axiosInstance from '@/config/axiosInstance';

export const verifySession = async () => {
  try {
    const response = await axiosInstance.get('/auth/verify-session', {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }

    throw new Error('Verify failed');
  } catch {
    throw new Error('Verify failed');
  }
};
