import { api, setStoredToken, removeStoredToken } from './api';
import { LoginRequest, LoginResponse, User } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    if (response.access_token) {
      setStoredToken(response.access_token);
    }
    
    return response;
  },

  logout: (): void => {
    removeStoredToken();
  },

  getProfile: async (): Promise<User> => {
    return api.get<User>('/auth/profile');
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/refresh-token', {
      refreshToken,
    });
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await api.get('/auth/profile');
      return true;
    } catch {
      return false;
    }
  },
};

export default authService;