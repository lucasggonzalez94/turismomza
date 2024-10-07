import axiosInstance from '@/config/axiosInstance';

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(
      '/auth/login',
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during login:', error);
    throw new Error('Login failed');
  }
};
