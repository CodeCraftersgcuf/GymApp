import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Notification Service
 * Handles all notification-related API calls (authenticated endpoints)
 */

/**
 * Get list of notifications
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 20)
 * @param {number} [params.page] - Page number
 * @param {string} [params.status] - Filter by status (unread, read, or omit for all)
 * @returns {Promise<object>} - Paginated list of notifications
 */
export const getNotifications = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.NOTIFICATIONS.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Get unread notification count
 * @returns {Promise<object>} - Unread notification count
 */
export const getUnreadNotificationCount = async () => {
  return apiCallWithAuth(API_ENDPOINTS.NOTIFICATIONS.unreadCount, 'GET');
};

/**
 * Get single notification by ID
 * @param {number|string} id - Notification ID
 * @returns {Promise<object>} - Notification details
 */
export const getNotification = async (id) => {
  return apiCallWithAuth(API_ENDPOINTS.NOTIFICATIONS.detail(id), 'GET');
};

/**
 * Mark notification as read
 * @param {number|string} id - Notification ID
 * @returns {Promise<object>} - Success response
 */
export const markNotificationAsRead = async (id) => {
  return apiCallWithAuth(API_ENDPOINTS.NOTIFICATIONS.markAsRead(id), 'PUT');
};

/**
 * Mark all notifications as read
 * @returns {Promise<object>} - Success response
 */
export const markAllNotificationsAsRead = async () => {
  return apiCallWithAuth(API_ENDPOINTS.NOTIFICATIONS.markAllAsRead, 'PUT');
};

