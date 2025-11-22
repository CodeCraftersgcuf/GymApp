import { useQuery } from '@tanstack/react-query';
import { getBanners, getBanner } from '../services/bannerService';

/**
 * React Query hooks for Banners
 */

/**
 * Hook to get list of banners
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useBanners = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['banners', 'list', params],
    queryFn: () => getBanners(params),
    ...options,
  });
};

/**
 * Hook to get single banner by ID
 * @param {number|string} id - Banner ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useBanner = (id, options = {}) => {
  return useQuery({
    queryKey: ['banners', id],
    queryFn: () => getBanner(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

