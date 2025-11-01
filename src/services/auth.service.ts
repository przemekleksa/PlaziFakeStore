import { api, setStoredToken, removeStoredToken } from './api';
import { LoginRequest, LoginResponse, User } from '@/types';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Store token after successful login
    if (response.access_token) {
      setStoredToken(response.access_token);
    }
    
    return response;
  },

  // Logout user
  logout: (): void => {
    removeStoredToken();
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    return api.get<User>('/auth/profile');
  },

  // Refresh token (if supported by API)
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/refresh-token', {
      refreshToken,
    });
  },

  // Verify token validity
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