import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { refreshAccessToken } from '@/services/auth/refreshToken';

const isProduction = process.env.NODE_ENV === 'production';

const getAccessToken = () => useAuthStore.getState().accessToken;

const axiosInstance = axios.create({
  baseURL: isProduction
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.url.includes('/auth/refresh-token')) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    return new Promise((resolve, reject) => {
      refreshAccessToken()
        .then(({ accessToken, user }) => {
          if (accessToken) {
            useAuthStore.getState().setAccessToken(accessToken);
          }
          if (user) {
            useAuthStore.getState().setUser(user);
            useAuthStore.getState().setIsAuthenticated(true);
          }
          processQueue(null, accessToken);
          resolve(axiosInstance(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  },
);

export default axiosInstance;
