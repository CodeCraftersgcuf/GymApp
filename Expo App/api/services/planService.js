import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Plan Service
 * Handles all plan-related API calls (public endpoints)
 */

/**
 * Get list of plans
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.category] - Filter by category (weight_loss, etc.)
 * @param {string} [params.difficulty] - Filter by difficulty (beginner, intermediate, advanced)
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of plans
 */
export const getPlans = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.PLANS.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single plan by ID
 * @param {number|string} id - Plan ID
 * @returns {Promise<object>} - Plan details
 */
export const getPlan = async (id) => {
  return apiCall(API_ENDPOINTS.PLANS.detail(id), 'GET');
};

