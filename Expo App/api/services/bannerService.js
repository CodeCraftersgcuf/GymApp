import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Banner Service
 * Handles all banner-related API calls (public endpoints)
 */

/**
 * Get list of banners
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of banners
 */
export const getBanners = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.BANNERS.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single banner by ID
 * @param {number|string} id - Banner ID
 * @returns {Promise<object>} - Banner details
 */
export const getBanner = async (id) => {
  return apiCall(API_ENDPOINTS.BANNERS.detail(id), 'GET');
};

