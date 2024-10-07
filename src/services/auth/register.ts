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
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data.message || 'Register failed',
      };
    } else if (error.request) {
      throw {
        status: 500,
        message: 'No response received from server',
      };
    } else {
      throw {
        status: 500,
        message: error.message || 'Register failed',
      };
    }
  }
};
