import axiosInstance from '@/config/axiosInstance';

export const logout = async () => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data.message || 'Logout failed',
      };
    } else if (error.request) {
      throw {
        status: 500,
        message: 'No response received from server',
      };
    } else {
      throw {
        status: 500,
        message: error.message || 'Logout failed',
      };
    }
  }
};
