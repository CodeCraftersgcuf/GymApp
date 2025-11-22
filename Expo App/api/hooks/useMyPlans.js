import { useQuery } from '@tanstack/react-query';
import { getMyPlans, getMyPlan } from '../services/myPlanService';

/**
 * React Query hooks for My Plans (Premium)
 */

/**
 * Hook to get list of user's plans (premium feature)
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useMyPlans = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['myPlans', 'list', params],
    queryFn: () => getMyPlans(params),
    ...options,
  });
};

/**
 * Hook to get single user plan by ID (premium feature)
 * @param {number|string} id - My Plan ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useMyPlan = (id, options = {}) => {
  return useQuery({
    queryKey: ['myPlans', id],
    queryFn: () => getMyPlan(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

