import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, getUserData, storeAuthData, clearAuthData, isAuthenticated } from '../utils/tokenStorage';
import { useCurrentUser } from '../api/hooks';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  role: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldFetchUser, setShouldFetchUser] = useState(false);

  // Initialize auth state on app start
  useEffect(() => {
    // Add a fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Auth initialization timeout - forcing completion');
        setIsLoading(false);
      }
    }, 5000);

    initializeAuth();

    return () => clearTimeout(fallbackTimeout);
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('Initializing auth...');
      
      // Use a shorter timeout and simpler approach
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth initialization timeout')), 3000)
      );
      
      const authPromise = Promise.all([
        getToken(),
        getUserData()
      ]);
      
      const [storedToken, storedUser] = await Promise.race([authPromise, timeout]);

      console.log('Auth data retrieved:', { hasToken: !!storedToken, hasUser: !!storedUser });

      // Ignore "dummy-token" - it's just for testing, not real authentication
      if (storedToken && storedToken === "dummy-token") {
        console.log('Found dummy-token, clearing auth data');
        await clearAuthData();
        return;
      }

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setShouldFetchUser(true); // Enable user data fetching from API
        console.log('User authenticated successfully');
      } else {
        console.log('No stored auth data found');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear any potentially corrupted data
      try {
        await clearAuthData();
      } catch (clearError) {
        console.error('Error clearing auth data:', clearError);
      }
    } finally {
      console.log('Auth initialization complete');
      setIsLoading(false);
    }
  };

  // Fetch current user from API if authenticated
  // Note: This hook will only run when shouldFetchUser is true and token exists
  const { data: currentUserData } = useCurrentUser({
    enabled: shouldFetchUser && !!token,
    onSuccess: (data) => {
      if (data?.data) {
        setUser(data.data);
        // Update stored user data
        storeAuthData(token, data.data).catch(console.error);
      }
    },
    onError: (error) => {
      console.error('Error fetching current user:', error);
      // If 401, user token is invalid, clear auth
      if (error?.statusCode === 401) {
        clearAuthData();
        setToken(null);
        setUser(null);
        setShouldFetchUser(false);
      }
    },
  });

  const login = async (token, userData) => {
    try {
      await storeAuthData(token, userData);
      setToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData) => {
    try {
      await storeAuthData(token, userData);
      setUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Extract role from user data
  const role = user?.role || user?.user_type || null;

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    role,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
