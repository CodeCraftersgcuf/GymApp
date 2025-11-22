import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Message Service
 * Handles all message-related API calls (authenticated endpoints)
 */

/**
 * Get list of messages
 * @param {object} [params] - Query parameters
 * @param {number} [params.page] - Page number (default: 1)
 * @param {number} [params.per_page] - Items per page (default: 50)
 * @returns {Promise<object>} - Paginated list of messages
 */
export const getMessages = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.MESSAGES.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Send a message
 * @param {object} messageData - Message data
 * @param {string} messageData.message - Message content
 * @returns {Promise<object>} - Sent message
 */
export const sendMessage = async (messageData) => {
  return apiCallWithAuth(API_ENDPOINTS.MESSAGES.send, 'POST', messageData);
};

/**
 * Get unread message count
 * @returns {Promise<object>} - Unread message count
 */
export const getUnreadMessageCount = async () => {
  return apiCallWithAuth(API_ENDPOINTS.MESSAGES.unreadCount, 'GET');
};

