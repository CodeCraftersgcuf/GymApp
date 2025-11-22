import { useQuery } from '@tanstack/react-query';
import { getVideoLibraries, getVideoLibrary } from '../services/videoLibraryService';

/**
 * React Query hooks for Video Libraries
 */

/**
 * Hook to get list of video libraries
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useVideoLibraries = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['videoLibraries', 'list', params],
    queryFn: () => getVideoLibraries(params),
    ...options,
  });
};

/**
 * Hook to get single video library by ID
 * @param {number|string} id - Video library ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useVideoLibrary = (id, options = {}) => {
  return useQuery({
    queryKey: ['videoLibraries', id],
    queryFn: () => getVideoLibrary(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

