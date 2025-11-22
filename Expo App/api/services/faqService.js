import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * FAQ Service
 * Handles all FAQ-related API calls (public endpoints)
 */

/**
 * Get list of FAQs
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.category] - Filter by category (general, etc.)
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of FAQs
 */
export const getFAQs = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.FAQS.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single FAQ by ID
 * @param {number|string} id - FAQ ID
 * @returns {Promise<object>} - FAQ details
 */
export const getFAQ = async (id) => {
  return apiCall(API_ENDPOINTS.FAQS.detail(id), 'GET');
};

