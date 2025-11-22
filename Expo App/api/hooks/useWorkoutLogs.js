import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkoutLogs, createWorkoutLog, getWorkoutLog } from '../services/workoutLogService';

/**
 * React Query hooks for Workout Logs
 */

/**
 * Hook to get list of workout logs
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useWorkoutLogs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['workoutLogs', 'list', params],
    queryFn: () => getWorkoutLogs(params),
    ...options,
  });
};

/**
 * Hook to create a new workout log
 * @returns {object} - Mutation object with mutate function
 */
export const useCreateWorkoutLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createWorkoutLog,
    onSuccess: () => {
      // Invalidate workout logs list
      queryClient.invalidateQueries({ queryKey: ['workoutLogs'] });
    },
  });
};

/**
 * Hook to get single workout log by ID
 * @param {number|string} id - Workout log ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useWorkoutLog = (id, options = {}) => {
  return useQuery({
    queryKey: ['workoutLogs', id],
    queryFn: () => getWorkoutLog(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

