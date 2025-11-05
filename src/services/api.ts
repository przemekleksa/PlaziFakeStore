import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ApiError } from '@/types';
import { getErrorMessage } from '@/utils/errorHandling';

// API base configuration
const API_BASE_URL = 'https://api.escuelajs.co/api/v1';
const API_TIMEOUT = 10000;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getStoredToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

const setStoredToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

const removeStoredToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Request interceptor - Add auth token to requests
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

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      removeStoredToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
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

// API client methods
export const api = {
  // GET request
  get: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then(response => response.data);
  },

  // POST request
  post: <T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => {
    return apiClient.post(url, data, config).then(response => response.data);
  },

  // PUT request
  put: <T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => {
    return apiClient.put(url, data, config).then(response => response.data);
  },

  // PATCH request
  patch: <T>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => {
    return apiClient.patch(url, data, config).then(response => response.data);
  },

  // DELETE request
  delete: <T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then(response => response.data);
  },
};

// Export token management functions
export { getStoredToken, setStoredToken, removeStoredToken };

// Export the axios instance for advanced usage
export { apiClient };

export default api;
