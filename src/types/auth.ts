export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'client';
  photoURL?: string;
  company?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}