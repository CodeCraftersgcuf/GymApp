import { useQuery } from '@tanstack/react-query';
import { getPackages, getPackage } from '../services/packageService';

/**
 * React Query hooks for Packages
 */

/**
 * Hook to get list of packages
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const usePackages = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['packages', 'list', params],
    queryFn: () => getPackages(params),
    ...options,
  });
};

/**
 * Hook to get single package by ID
 * @param {number|string} id - Package ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const usePackage = (id, options = {}) => {
  return useQuery({
    queryKey: ['packages', id],
    queryFn: () => getPackage(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

