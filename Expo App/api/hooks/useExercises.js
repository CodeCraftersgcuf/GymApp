import { useQuery } from '@tanstack/react-query';
import { getExercises, getExercise } from '../services/exerciseService';

/**
 * React Query hooks for Exercises
 */

/**
 * Hook to get list of exercises
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useExercises = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['exercises', 'list', params],
    queryFn: () => getExercises(params),
    ...options,
  });
};

/**
 * Hook to get single exercise by ID
 * @param {number|string} id - Exercise ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useExercise = (id, options = {}) => {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: () => getExercise(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

