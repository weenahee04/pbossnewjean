import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'jespark_auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setUser(parsedAuth.user);
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    const authData = { 
      user: userData, 
      token: token || '', 
      timestamp: Date.now() 
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      const storedAuth = localStorage.getItem(STORAGE_KEY);
      const token = storedAuth ? JSON.parse(storedAuth).token : '';
      const authData = { 
        user: updatedUser, 
        token, 
        timestamp: Date.now() 
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
