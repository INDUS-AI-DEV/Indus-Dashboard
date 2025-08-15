import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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

// Hardcoded users - In a real app, NEVER store passwords in frontend code!
const HARDCODED_USERS = {
  'tummapudianurag@gmail.com': {
    id: '1',
    email: 'tummapudianurag@gmail.com',
    name: 'Admin User',
    password: 'Indus123',
    role: 'admin' as const,
  },
  'contact@massistcrm.com': {
    id: '2',
    email: 'contact@massistcrm.com',
    name: 'Client User',
    password: 'IndusMassist',
    role: 'client' as const,
  },
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = HARDCODED_USERS[email as keyof typeof HARDCODED_USERS];
      
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = user;
      
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      navigate('/dashboard');
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Failed to log in',
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
      
      // In a real app, you would verify the ID token with Google
      // For demo, we'll just create a mock user
      const mockUser = {
        id: 'google-user-123',
        email: 'google@example.com',
        name: 'Google User',
        role: 'client' as const,
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      navigate('/dashboard');
      
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Google Login Failed',
        description: 'Failed to log in with Google',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
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

export { AuthContext, AuthProvider };