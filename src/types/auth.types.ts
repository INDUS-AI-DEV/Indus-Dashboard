// Auth-related types and interfaces

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    _id: string;
    email: string;
    name?: string;
    role: UserRole;
  };
}
