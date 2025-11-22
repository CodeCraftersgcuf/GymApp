import { useQuery } from '@tanstack/react-query';
import { getFAQs, getFAQ } from '../services/faqService';

/**
 * React Query hooks for FAQs
 */

/**
 * Hook to get list of FAQs
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useFAQs = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['faqs', 'list', params],
    queryFn: () => getFAQs(params),
    ...options,
  });
};

/**
 * Hook to get single FAQ by ID
 * @param {number|string} id - FAQ ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useFAQ = (id, options = {}) => {
  return useQuery({
    queryKey: ['faqs', id],
    queryFn: () => getFAQ(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

