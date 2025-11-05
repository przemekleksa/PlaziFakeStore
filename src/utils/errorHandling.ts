import { toast } from 'react-toastify';

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.message === 'string';
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  // Handle Axios errors
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.statusText) {
      return axiosError.response.statusText;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown, context?: string) => {
  const message = getErrorMessage(error);
  const contextMessage = context ? `${context}: ${message}` : message;

  console.error('API Error:', error);
  toast.error(contextMessage);

  return message;
};

export const getErrorStatusCode = (error: unknown): number | undefined => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    return axiosError.response?.status;
  }

  if (isApiError(error)) {
    return error.statusCode;
  }

  return undefined;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'code' in error) {
    const axiosError = error as any;
    return (
      axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ECONNABORTED'
    );
  }
  return false;
};

export const isTimeoutError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'code' in error) {
    const axiosError = error as any;
    return axiosError.code === 'ECONNABORTED';
  }
  return false;
};
