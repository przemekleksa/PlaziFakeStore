import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService, getStoredToken, removeStoredToken } from '@/services';

vi.mock('@/services', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
  },
  getStoredToken: vi.fn(),
  removeStoredToken: vi.fn(),
}));

const mockAuthService = vi.mocked(authService);
const mockGetStoredToken = vi.mocked(getStoredToken);
const mockRemoveStoredToken = vi.mocked(removeStoredToken);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetStoredToken.mockReturnValue(null);
  });

  describe('Initial state', () => {
    it('should initialize with default state when no token stored', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should restore user session when valid token exists', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        avatar: 'https://example.com/avatar.jpg',
        creationAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      const mockToken = 'valid-token';

      mockGetStoredToken.mockReturnValue(mockToken);
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.token).toBe(mockToken);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockAuthService.getProfile).toHaveBeenCalledOnce();
    });

    it('should clear invalid token on startup', async () => {
      const mockToken = 'invalid-token';

      mockGetStoredToken.mockReturnValue(mockToken);
      mockAuthService.getProfile.mockRejectedValue(new Error('Token expired'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockRemoveStoredToken).toHaveBeenCalledOnce();
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        avatar: 'https://example.com/avatar.jpg',
        creationAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      const mockLoginResponse = {
        access_token: 'new-token',
        refresh_token: 'refresh-token',
      };

      mockAuthService.login.mockResolvedValue(mockLoginResponse);
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login('john@example.com', 'password');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('new-token');
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);

      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password',
      });
      expect(mockAuthService.getProfile).toHaveBeenCalledOnce();
    });

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials');

      mockAuthService.login.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login('john@example.com', 'wrong-password');
        })
      ).rejects.toThrow('Invalid credentials');

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        avatar: 'https://example.com/avatar.jpg',
        creationAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      const mockLoginResponse = {
        access_token: 'new-token',
        refresh_token: 'refresh-token',
      };

      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise<typeof mockLoginResponse>(resolve => {
        resolveLogin = resolve;
      });

      mockAuthService.login.mockReturnValue(loginPromise);
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login('john@example.com', 'password');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveLogin!(mockLoginResponse);
        await loginPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
        avatar: 'https://example.com/avatar.jpg',
        creationAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };
      const mockToken = 'valid-token';

      mockGetStoredToken.mockReturnValue(mockToken);
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);

      expect(mockAuthService.logout).toHaveBeenCalledOnce();
    });
  });

  describe('Hook usage', () => {
    it('should throw error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });
});
