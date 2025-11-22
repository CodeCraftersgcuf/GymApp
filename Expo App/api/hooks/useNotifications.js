import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadNotificationCount,
  getNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService';

/**
 * React Query hooks for Notifications
 */

/**
 * Hook to get list of notifications
 * @param {object} [params] - Query parameters
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useNotifications = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['notifications', 'list', params],
    queryFn: () => getNotifications(params),
    ...options,
  });
};

/**
 * Hook to get unread notification count
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useUnreadNotificationCount = (options = {}) => {
  return useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30000, // Refetch every 30 seconds
    ...options,
  });
};

/**
 * Hook to get single notification by ID
 * @param {number|string} id - Notification ID
 * @param {object} [options] - Query options
 * @returns {object} - Query object with data, isLoading, error, etc.
 */
export const useNotification = (id, options = {}) => {
  return useQuery({
    queryKey: ['notifications', id],
    queryFn: () => getNotification(id),
    enabled: !!id && options.enabled !== false,
    ...options,
  });
};

/**
 * Hook to mark notification as read
 * @returns {object} - Mutation object with mutate function
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, id) => {
      // Invalidate notifications list, unread count, and specific notification
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook to mark all notifications as read
 * @returns {object} - Mutation object with mutate function
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

