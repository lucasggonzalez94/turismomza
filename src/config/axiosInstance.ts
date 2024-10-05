import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response): any => {
    return {
      status: response.status,
      data: response.data,
      errors: {},
    };
  },
  (error) => {
    return {
      status: error.response ? error.response.status : 500,
      data: {},
      errors: error.response
        ? error.response.data
        : { message: 'Error desconocido' },
    };
  },
);

export default axiosInstance;
