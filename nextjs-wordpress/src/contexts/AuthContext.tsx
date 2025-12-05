'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, AuthUser } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const storedUser = AuthService.getUser();
        const token = AuthService.getToken();

        if (storedUser && token) {
          // Validate token
          const validation = await AuthService.validateToken();
          
          if (validation.valid) {
            setUser(storedUser);
          } else {
            // Token expired, try to refresh
            try {
              await AuthService.refreshToken();
              setUser(AuthService.getUser());
            } catch (error) {
              // Refresh failed, logout silently
              AuthService.logout();
              setUser(null);
            }
          }
        }
      } catch (error) {
        // Silently handle any auth errors - don't block the app
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(username, password);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      await AuthService.refreshToken();
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
