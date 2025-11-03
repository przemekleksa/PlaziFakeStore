import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import LoginPage from '../LoginPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { authService } from '@/services';

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

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete full login flow successfully', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      avatar: 'avatar.jpg',
      creationAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    const mockLoginResponse = {
      access_token: 'test-token',
      refresh_token: 'refresh-token',
    };

    mockAuthService.login.mockResolvedValue(mockLoginResponse);
    mockAuthService.getProfile.mockResolvedValue(mockUser);

    const TestWrapper = createTestWrapper();
    render(<LoginPage />, { wrapper: TestWrapper });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'password123',
    });

    await waitFor(() => {
      expect(mockAuthService.getProfile).toHaveBeenCalled();
    });
  });

  it('should handle API login errors', async () => {
    const loginError = new Error('Invalid credentials');
    mockAuthService.login.mockRejectedValue(loginError);

    const TestWrapper = createTestWrapper();
    render(<LoginPage />, { wrapper: TestWrapper });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });
  });

  it('should show loading state during login', async () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise<any>(resolve => {
      resolveLogin = resolve;
    });

    mockAuthService.login.mockReturnValue(loginPromise);

    const TestWrapper = createTestWrapper();
    render(<LoginPage />, { wrapper: TestWrapper });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    resolveLogin!({
      access_token: 'test-token',
      refresh_token: 'refresh-token',
    });

    await waitFor(() => {
      expect(screen.queryByText(/signing in/i)).not.toBeInTheDocument();
    });
  });
});
