import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Achievement Service
 * Handles all achievement-related API calls (public endpoints)
 */

/**
 * Get list of achievements
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of achievements
 */
export const getAchievements = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.ACHIEVEMENTS.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single achievement by ID
 * @param {number|string} id - Achievement ID
 * @returns {Promise<object>} - Achievement details with videos
 */
export const getAchievement = async (id) => {
  return apiCall(API_ENDPOINTS.ACHIEVEMENTS.detail(id), 'GET');
};

