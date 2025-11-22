import { useQuery } from '@tanstack/react-query';
import { getAchievements, getAchievement } from '../services/achievementService';

/**
 * React Query hooks for Achievements
 */

/**
 * Hook to get list of achievements
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useAchievements = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['achievements', 'list', params],
    queryFn: () => getAchievements(params),
    ...options,
  });
};

/**
 * Hook to get single achievement by ID
 * @param {number|string} id - Achievement ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useAchievement = (id, options = {}) => {
  return useQuery({
    queryKey: ['achievements', id],
    queryFn: () => getAchievement(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

