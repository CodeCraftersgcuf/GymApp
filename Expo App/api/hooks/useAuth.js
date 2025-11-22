import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { register, login, getCurrentUser, updateProfile, updatePassword, logout } from '../services/authService';
import { clearAuthData } from '../../utils/tokenStorage';
import { useAuth } from '../../contexts/AuthContext';

/**
 * React Query hooks for Authentication
 */

/**
 * Hook for user registration
 * @returns {object} - Mutation object with mutate function
 */
export const useRegister = () => {
  const { login: authLogin } = useAuth();
  
  return useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      // Store token and user data in auth context
      if (data?.token && data?.data) {
        await authLogin(data.token, data.data);
      }
    },
  });
};

/**
 * Hook for user login
 * @returns {object} - Mutation object with mutate function
 */
export const useLogin = () => {
  const { login: authLogin } = useAuth();
  
  return useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      // Store token and user data in auth context
      if (data?.token && data?.data) {
        await authLogin(data.token, data.data);
      }
    },
  });
};

/**
 * Hook to get current authenticated user
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: getCurrentUser,
    ...options,
  });
};

/**
 * Hook to update user profile
 * @returns {object} - Mutation object with mutate function
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
      return data;
    },
  });
};

/**
 * Hook to update user password
 * @returns {object} - Mutation object with mutate function
 */
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: updatePassword,
  });
};

/**
 * Hook for user logout
 * @returns {object} - Mutation object with mutate function
 */
export const useLogout = () => {
  const { logout: authLogout } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      // Clear all queries and auth data
      await clearAuthData();
      queryClient.clear();
      authLogout();
    },
    onError: async () => {
      // Even if API call fails, clear local data
      await clearAuthData();
      queryClient.clear();
      authLogout();
    },
  });
};

