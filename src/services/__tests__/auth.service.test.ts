import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../auth.service';
import {
  api,
  setStoredToken,
  removeStoredToken,
  setStoredRefreshToken,
} from '../api';

vi.mock('../api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
  setStoredToken: vi.fn(),
  removeStoredToken: vi.fn(),
  setStoredRefreshToken: vi.fn(),
}));

const mockApi = vi.mocked(api);
const mockSetStoredToken = vi.mocked(setStoredToken);
const mockRemoveStoredToken = vi.mocked(removeStoredToken);
const mockSetStoredRefreshToken = vi.mocked(setStoredRefreshToken);

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockCredentials = {
        email: 'john@example.com',
        password: 'password',
      };
      const mockResponse = {
        access_token: 'mock-token',
        refresh_token: 'refresh-token',
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const result = await authService.login(mockCredentials);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(mockSetStoredToken).toHaveBeenCalledWith('mock-token');
      expect(mockSetStoredRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(result).toEqual(mockResponse);
    });

    it('should login without storing token when no access_token', async () => {
      const mockCredentials = {
        email: 'john@example.com',
        password: 'password',
      };
      const mockResponse = { refresh_token: 'refresh-token' };

      mockApi.post.mockResolvedValue(mockResponse);

      const result = await authService.login(mockCredentials);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(mockSetStoredToken).not.toHaveBeenCalled();
      expect(mockSetStoredRefreshToken).toHaveBeenCalledWith('refresh-token');
      expect(result).toEqual(mockResponse);
    });

    it('should handle login failure', async () => {
      const mockCredentials = { email: 'john@example.com', password: 'wrong' };
      const mockError = new Error('Invalid credentials');

      mockApi.post.mockRejectedValue(mockError);

      await expect(authService.login(mockCredentials)).rejects.toThrow(
        'Invalid credentials'
      );
      expect(mockSetStoredToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should remove stored token', () => {
      authService.logout();

      expect(mockRemoveStoredToken).toHaveBeenCalledOnce();
    });
  });

  describe('getProfile', () => {
    it('should fetch user profile', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        avatar: 'https://example.com/avatar.jpg',
        creationAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockApi.get.mockResolvedValue(mockUser);

      const result = await authService.getProfile();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual(mockUser);
    });

    it('should handle profile fetch failure', async () => {
      const mockError = new Error('Unauthorized');

      mockApi.get.mockRejectedValue(mockError);

      await expect(authService.getProfile()).rejects.toThrow('Unauthorized');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockRefreshToken = 'refresh-token';
      const mockResponse = {
        access_token: 'new-token',
        refresh_token: 'new-refresh',
      };

      mockApi.post.mockResolvedValue(mockResponse);

      const result = await authService.refreshToken(mockRefreshToken);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh-token', {
        refreshToken: mockRefreshToken,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle refresh token failure', async () => {
      const mockRefreshToken = 'invalid-refresh-token';
      const mockError = new Error('Invalid refresh token');

      mockApi.post.mockRejectedValue(mockError);

      await expect(authService.refreshToken(mockRefreshToken)).rejects.toThrow(
        'Invalid refresh token'
      );
    });
  });

  describe('verifyToken', () => {
    it('should return true for valid token', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        avatar: 'https://example.com/avatar.jpg',
        creationAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      mockApi.get.mockResolvedValue(mockUser);

      const result = await authService.verifyToken();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      const mockError = new Error('Unauthorized');

      mockApi.get.mockRejectedValue(mockError);

      const result = await authService.verifyToken();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toBe(false);
    });
  });
});
