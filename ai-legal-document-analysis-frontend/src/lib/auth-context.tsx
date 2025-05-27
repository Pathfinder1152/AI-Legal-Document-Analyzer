'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, getCurrentSession, loginUser, logoutUser, registerUser, getUserDetails } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
  checkSession: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Check session status
  const checkSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const { isAuthenticated, user } = await getCurrentSession();
      setIsAuthenticated(isAuthenticated);
      setUser(user || null);
    } catch (err) {
      console.error("Failed to fetch authentication status:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const userData = await getUserDetails();
      setUser(userData);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginUser(username, password);
      setUser(response.user);
      setIsAuthenticated(true);
      router.push('/'); // Redirect to home page after login
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };
  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Even if the server logout fails, we'll clear the client-side state
      try {
        await logoutUser();
      } catch (apiError: any) {
        console.error("Logout API error:", apiError);
        // Continue with client-side logout even if the API call fails
      }
      
      // Always perform client-side logout
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear any stored session data
      document.cookie = "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      router.push('/auth/signin'); // Redirect to login page
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };  // Register function
  const register = async ({
    username,
    email,
    password,
    passwordConfirm,
    firstName,
    lastName,
  }: {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerUser(
        username,
        email,
        password,
        passwordConfirm,
        firstName,
        lastName
      );
      
      // Don't set the user as authenticated after registration
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to login page with success parameter
      router.push('/auth/signin?registered=true'); 
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        refreshUser,
        checkSession,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
