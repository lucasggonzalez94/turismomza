import axiosInstance from '@/config/axiosInstance';

export const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      '/auth/register',
      {
        name,
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

    if (response.status === 201) {
      return response.data;
    }

    throw new Error('Register failed');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during register:', error);
    throw new Error('Register failed');
  }
};
