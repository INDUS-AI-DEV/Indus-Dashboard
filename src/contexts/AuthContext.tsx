import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

// Define the API response types
interface LoginResponse {
  access_token: string;
  user: Omit<User, 'id'> & { _id: string };
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (idToken: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Consolidated error response type
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
  message?: string;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await axios.get<Omit<User, 'id'> & { _id: string }>('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Transform the response to match the User interface
          const userData = response.data;
          setUser({
            id: userData._id,
            email: userData.email,
            name: userData.name || userData.email.split('@')[0],
            role: userData.role,
          });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await axios.post<ApiResponse<LoginResponse>>('/api/auth/login', { email, password });
      
      if (data.data?.access_token) {
        localStorage.setItem('token', data.data.access_token);
        setUser({
          id: data.data.user._id,
          email: data.data.user.email,
          name: data.data.user.name || data.data.user.email.split('@')[0],
          role: data.data.user.role,
        });
        navigate('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to log in';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } }, message?: string };
        errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to log in';
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await axios.post<ApiResponse<LoginResponse>>('/auth/google', {
        id_token: idToken
      });
      
      if (data.data?.access_token) {
        localStorage.setItem('token', data.data.access_token);
        setUser({
          id: data.data.user._id,
          email: data.data.user.email,
          name: data.data.user.name || data.data.user.email.split('@')[0],
          role: data.data.user.role,
        });
        navigate('/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      let errorMessage = 'Failed to log in with Google';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } }, message?: string };
        errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to log in with Google';
      }
      
      toast({
        title: 'Google Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: 'There was an error logging out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export both AuthContext and AuthProvider
export { AuthContext, AuthProvider };