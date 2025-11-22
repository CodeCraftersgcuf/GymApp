import { useQuery } from '@tanstack/react-query';
import { getCommunities, getCommunity } from '../services/communityService';

/**
 * React Query hooks for Communities
 */

/**
 * Hook to get list of communities
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useCommunities = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['communities', 'list', params],
    queryFn: () => getCommunities(params),
    ...options,
  });
};

/**
 * Hook to get single community by ID
 * @param {number|string} id - Community ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useCommunity = (id, options = {}) => {
  return useQuery({
    queryKey: ['communities', id],
    queryFn: () => getCommunity(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

