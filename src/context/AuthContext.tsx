'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  isLoading: boolean; // Add loading state
};

type AuthProviderProps = {
  children: ReactNode;
};

// Create an authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize loading state

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Retrieve authentication status and timestamp from local storage
      const authStatus = localStorage.getItem('isAuthenticated');
      const authTimestamp = localStorage.getItem('authTimestamp');

      if (authStatus === 'true' && authTimestamp) {
        const currentTime = new Date().getTime();
        // Check if the session is still valid
        if (currentTime - parseInt(authTimestamp) < EXPIRATION_TIME) {
          setIsAuthenticated(true); // Keep the user authenticated
        } else {
          logout(); // Expire the session
        }
      }
      setIsLoading(false); // Set loading to false after checking
    }
  }, []);

  const login = () => {
    // Set authentication status and timestamp in local storage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authTimestamp', new Date().getTime().toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove authentication status and timestamp from local storage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTimestamp');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};