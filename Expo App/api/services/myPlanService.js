import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * My Plan Service (Premium)
 * Handles all premium plan-related API calls (authenticated + premium required)
 */

/**
 * Get list of user's plans (premium feature)
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.category] - Filter by category (weight_loss, etc.)
 * @param {string} [params.difficulty] - Filter by difficulty (beginner, intermediate, advanced)
 * @returns {Promise<object>} - Paginated list of user's plans
 */
export const getMyPlans = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.MY_PLANS.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Get single user plan by ID (premium feature)
 * @param {number|string} id - My Plan ID
 * @returns {Promise<object>} - User plan details with all sections
 */
export const getMyPlan = async (id) => {
  return apiCallWithAuth(API_ENDPOINTS.MY_PLANS.detail(id), 'GET');
};

