import axiosInstance from '@/config/axiosInstance';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post(
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

    if (res.status !== 200) {
      throw new Error('Credenciales inválidas');
    } else {
      return res.data;
    }
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data.message || 'Login failed',
      };
    } else if (error.request) {
      throw {
        status: 500,
        message: 'No response received from server',
      };
    } else {
      throw {
        status: 500,
        message: error.message || 'Login failed',
      };
    }
  }
};
