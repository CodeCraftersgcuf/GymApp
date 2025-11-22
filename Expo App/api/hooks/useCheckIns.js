import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCheckIns, createCheckIn } from '../services/checkInService';

/**
 * React Query hooks for Check-ins
 */

/**
 * Hook to get list of check-ins
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useCheckIns = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['checkIns', 'list', params],
    queryFn: () => getCheckIns(params),
    ...options,
  });
};

/**
 * Hook to create a new check-in
 * @returns {object} - Mutation object with mutate function
 */
export const useCreateCheckIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCheckIn,
    onSuccess: () => {
      // Invalidate check-ins list
      queryClient.invalidateQueries({ queryKey: ['checkIns'] });
    },
  });
};

