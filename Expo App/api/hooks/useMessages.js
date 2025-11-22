import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage, getUnreadMessageCount } from '../services/messageService';

/**
 * React Query hooks for Messages
 */

/**
 * Hook to get list of messages
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useMessages = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['messages', 'list', params],
    queryFn: () => getMessages(params),
    ...options,
  });
};

/**
 * Hook to send a message
 * @returns {object} - Mutation object with mutate function
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // Invalidate messages list and unread count
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};

/**
 * Hook to get unread message count
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useUnreadMessageCount = (options = {}) => {
  return useQuery({
    queryKey: ['messages', 'unreadCount'],
    queryFn: getUnreadMessageCount,
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
};

