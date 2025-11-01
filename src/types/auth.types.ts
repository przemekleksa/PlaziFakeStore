// Authentication request
export interface LoginRequest {
  email: string;
  password: string;
}

// Authentication response
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

// User entity
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

// Auth context state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Token storage
export interface TokenStorage {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}