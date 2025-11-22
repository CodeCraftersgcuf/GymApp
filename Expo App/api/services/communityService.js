import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Community Service
 * Handles all community-related API calls (public endpoints)
 */

/**
 * Get list of communities
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of communities
 */
export const getCommunities = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.COMMUNITIES.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single community by ID
 * @param {number|string} id - Community ID
 * @returns {Promise<object>} - Community details
 */
export const getCommunity = async (id) => {
  return apiCall(API_ENDPOINTS.COMMUNITIES.detail(id), 'GET');
};

