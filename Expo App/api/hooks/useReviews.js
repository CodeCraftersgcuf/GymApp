import { useQuery } from '@tanstack/react-query';
import { getReviews, getReview } from '../services/reviewService';

/**
 * React Query hooks for Reviews
 */

/**
 * Hook to get list of reviews
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useReviews = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['reviews', 'list', params],
    queryFn: () => getReviews(params),
    ...options,
  });
};

/**
 * Hook to get single review by ID
 * @param {number|string} id - Review ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useReview = (id, options = {}) => {
  return useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getReview(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

