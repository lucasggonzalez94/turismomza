import axiosInstance from '@/config/axiosInstance';

export const loginGoogle = async ({
  name,
  email,
  image,
  googleId,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  googleId?: string | null;
}) => {
  try {
    const response = await axiosInstance.post(
      '/auth/google',
      {
        name,
        email,
        image,
        googleId,
      },
      {
        withCredentials: true,
      },
    );
    if (response.status === 200) {
      return response.data;
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
