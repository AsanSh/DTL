import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { authAPI, userAPI } from '../api/api';
import { AuthContextType } from './types';

// Создаем контекст с начальным значением
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (username: string, password: string) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: async (userData: any) => {},
  logout: () => {},
  loading: false,
  error: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  telegramAuth: async (telegramData: any) => {}
});

// Создаем провайдер контекста
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Try to get current user
          const response = await userAPI.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Auth check failed:', err);
          // If error, clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Login attempt with username:', username);
      const response = await authAPI.login(username, password);
      console.log('Login successful, storing tokens');
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Get user data
      try {
        console.log('Fetching user data');
        const userResponse = await userAPI.getCurrentUser();
        setUser(userResponse.data);
        setIsAuthenticated(true);
        console.log('User data received:', userResponse.data);
      } catch (userError: any) {
        console.error('Failed to get user data:', userError);
        setError('Successfully authenticated but failed to get user data');
        throw userError;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Server not responding. Please try again later.');
      } else {
        console.error('Error message:', err.message);
        setError('An unexpected error occurred.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Registering user with data:', { 
        username: userData.username, 
        email: userData.email,
        role: userData.role
      });
      
      const response = await authAPI.register(userData);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Registration error:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Registration failed. Please check your input and try again.');
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Server not responding. Please try again later.');
      } else {
        console.error('Error message:', err.message);
        setError('An unexpected error occurred.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const telegramAuth = async (telegramData: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Authenticating with Telegram:', telegramData);
      const response = await authAPI.telegramAuth(telegramData);
      
      // Store tokens
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Set user data
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      console.log('Telegram auth successful:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Telegram auth error:', err);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        if (err.response.data && err.response.data.detail) {
          setError(err.response.data.detail);
        } else {
          setError('Telegram authentication failed. Please try again.');
        }
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Server not responding. Please try again later.');
      } else {
        console.error('Error message:', err.message);
        setError('An unexpected error occurred.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      register,
      logout,
      loading,
      error,
      telegramAuth,
    }),
    [isAuthenticated, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Создаем безопасный хук, который не будет вызывать ошибку с null контекстом
export const useAuth = (): AuthContextType => {
  // Используем стандартный useContext из React
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 