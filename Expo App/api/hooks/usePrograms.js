import { useQuery } from '@tanstack/react-query';
import { getPrograms, getProgram } from '../services/programService';

/**
 * React Query hooks for Programs
 */

/**
 * Hook to get list of programs
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const usePrograms = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['programs', 'list', params],
    queryFn: () => getPrograms(params),
    ...options,
  });
};

/**
 * Hook to get single program by ID
 * @param {number|string} id - Program ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useProgram = (id, options = {}) => {
  return useQuery({
    queryKey: ['programs', id],
    queryFn: () => getProgram(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

