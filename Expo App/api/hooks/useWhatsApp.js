import { useQuery } from '@tanstack/react-query';
import { getWhatsAppSupport } from '../services/whatsappService';

/**
 * React Query hooks for WhatsApp Support
 */

/**
 * Hook to get WhatsApp support information
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useWhatsAppSupport = (options = {}) => {
  return useQuery({
    queryKey: ['whatsapp', 'support'],
    queryFn: getWhatsAppSupport,
    ...options,
  });
};

