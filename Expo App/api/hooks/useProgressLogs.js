import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProgressLogs, createProgressLog } from '../services/progressLogService';

/**
 * React Query hooks for Progress Logs
 */

/**
 * Hook to get list of progress logs
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useProgressLogs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['progressLogs', 'list', params],
    queryFn: () => getProgressLogs(params),
    ...options,
  });
};

/**
 * Hook to create a new progress log
 * @returns {object} - Mutation object with mutate function
 */
export const useCreateProgressLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProgressLog,
    onSuccess: () => {
      // Invalidate progress logs list
      queryClient.invalidateQueries({ queryKey: ['progressLogs'] });
    },
  });
};

