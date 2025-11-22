import { useQuery } from '@tanstack/react-query';
import { checkHealth, getConfig } from '../services/healthService';

/**
 * React Query hooks for Health and Config
 */

/**
 * Hook to check API health status
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useHealthCheck = (options = {}) => {
  return useQuery({
    queryKey: ['health', 'check'],
    queryFn: checkHealth,
    ...options,
  });
};

/**
 * Hook to get app configuration
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useConfig = (options = {}) => {
  return useQuery({
    queryKey: ['config'],
    queryFn: getConfig,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    ...options,
  });
};

