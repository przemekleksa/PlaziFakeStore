import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ApiError } from '@/types';
import { getErrorMessage } from '@/utils/errorHandling';

const API_BASE_URL = 'https://api.escuelajs.co/api/v1';
const API_TIMEOUT = 10000;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

const setStoredToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const setStoredRefreshToken = (refreshToken: string): void => {
  localStorage.setItem('refresh_token', refreshToken);
};

const removeStoredToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getStoredRefreshToken();

      if (refreshToken) {
        try {
          const response = await apiClient.post('/auth/refresh-token', {
            refreshToken,
          });

          const { access_token, refresh_token } = response.data;

          setStoredToken(access_token);
          if (refresh_token) {
            setStoredRefreshToken(refresh_token);
          }

          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          processQueue(null, access_token);

          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          removeStoredToken();
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        removeStoredToken();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    if (!error.response) {
      const networkError: ApiError = {
        message: 'Network error. Please check your internet connection.',
        statusCode: 0,
        error: 'NETWORK_ERROR',
      };
      return Promise.reject(networkError);
    }
    const apiError: ApiError = {
      message: getErrorMessage(error),
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error || error.code || 'Unknown error',
    };

    return Promise.reject(apiError);
  }
);

export const api = {
  get: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then(response => response.data);
  },

  post: <T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => {
    return apiClient.post(url, data, config).then(response => response.data);
  },

  put: <T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => {
    return apiClient.put(url, data, config).then(response => response.data);
  },

  patch: <T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => {
    return apiClient.patch(url, data, config).then(response => response.data);
  },

  delete: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then(response => response.data);
  },
};

export {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
};

export { apiClient };

export default api;
