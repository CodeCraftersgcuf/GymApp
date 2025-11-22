import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Program Service
 * Handles all program-related API calls (public endpoints)
 */

/**
 * Get list of programs
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.goal] - Filter by goal (fat_loss, muscle_gain, maintenance, endurance, strength)
 * @param {string} [params.level] - Filter by level (beginner, intermediate, advanced)
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of programs
 */
export const getPrograms = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.PROGRAMS.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single program by ID
 * @param {number|string} id - Program ID
 * @returns {Promise<object>} - Program details
 */
export const getProgram = async (id) => {
  return apiCall(API_ENDPOINTS.PROGRAMS.detail(id), 'GET');
};

