import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserPrograms, createUserProgram, getUserProgram } from '../services/userProgramService';

/**
 * React Query hooks for User Programs
 */

/**
 * Hook to get list of user programs
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useUserPrograms = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['userPrograms', 'list', params],
    queryFn: () => getUserPrograms(params),
    ...options,
  });
};

/**
 * Hook to create a new user program
 * @returns {object} - Mutation object with mutate function
 */
export const useCreateUserProgram = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUserProgram,
    onSuccess: () => {
      // Invalidate user programs list
      queryClient.invalidateQueries({ queryKey: ['userPrograms'] });
    },
  });
};

/**
 * Hook to get single user program by ID
 * @param {number|string} id - User program ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useUserProgram = (id, options = {}) => {
  return useQuery({
    queryKey: ['userPrograms', id],
    queryFn: () => getUserProgram(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

