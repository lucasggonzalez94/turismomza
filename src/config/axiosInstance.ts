import axios from 'axios';

import { refreshAccessToken } from '@/services/auth/refreshToken';

const isProduction = process.env.NODE_ENV === 'production';

const axiosInstance = axios.create({
  baseURL: isProduction
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response): any => {
    return {
      status: response.status,
      data: response.data,
      errors: {},
    };
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        axios.defaults.headers.common['Authorization'] =
          `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error refreshing token:', err);
      }
    }

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
