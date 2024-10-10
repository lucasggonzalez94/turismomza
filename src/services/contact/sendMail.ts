import axiosInstance from '@/config/axiosInstance';

export const sendMail = async (request: {
  name: string;
  subject: string;
  email: string;
  message: string;
}) => {
  try {
    const response = await axiosInstance.post('/contact', request, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (error.response) {
      throw {
        status: error.response.status,
        data: error.response.data,
        message: error.response.data.message || 'Error sending email',
      };
    } else if (error.request) {
      throw {
        status: 500,
        message: 'No response received from server',
      };
    } else {
      throw {
        status: 500,
        message: error.message || 'Error sending email',
      };
    }
  }
};
