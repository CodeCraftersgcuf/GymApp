import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Review Service
 * Handles all review-related API calls (public endpoints)
 */

/**
 * Get list of reviews
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of reviews
 */
export const getReviews = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.REVIEWS.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single review by ID
 * @param {number|string} id - Review ID
 * @returns {Promise<object>} - Review details
 */
export const getReview = async (id) => {
  return apiCall(API_ENDPOINTS.REVIEWS.detail(id), 'GET');
};

