import { useQuery } from '@tanstack/react-query';
import { getPlans, getPlan } from '../services/planService';

/**
 * React Query hooks for Plans
 */

/**
 * Hook to get list of plans
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const usePlans = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['plans', 'list', params],
    queryFn: () => getPlans(params),
    ...options,
  });
};

/**
 * Hook to get single plan by ID
 * @param {number|string} id - Plan ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const usePlan = (id, options = {}) => {
  return useQuery({
    queryKey: ['plans', id],
    queryFn: () => getPlan(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

