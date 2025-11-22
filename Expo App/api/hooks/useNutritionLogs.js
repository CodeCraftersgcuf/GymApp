import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNutritionLogs, createNutritionLog } from '../services/nutritionLogService';

/**
 * React Query hooks for Nutrition Logs
 */

/**
 * Hook to get list of nutrition logs
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useNutritionLogs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['nutritionLogs', 'list', params],
    queryFn: () => getNutritionLogs(params),
    ...options,
  });
};

/**
 * Hook to create a new nutrition log
 * @returns {object} - Mutation object with mutate function
 */
export const useCreateNutritionLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createNutritionLog,
    onSuccess: () => {
      // Invalidate nutrition logs list
      queryClient.invalidateQueries({ queryKey: ['nutritionLogs'] });
    },
  });
};

