import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * User Program Service
 * Handles all user program-related API calls (authenticated endpoints)
 */

/**
 * Get list of user programs
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page
 * @param {number} [params.page] - Page number
 * @returns {Promise<object>} - Paginated list of user programs
 */
export const getUserPrograms = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.USER_PROGRAMS.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Create a new user program
 * @param {object} programData - User program data
 * @param {number} programData.program_id - Program ID
 * @param {number} [programData.coach_id] - Coach ID
 * @param {string} programData.start_date - Start date (YYYY-MM-DD)
 * @param {string} programData.end_date - End date (YYYY-MM-DD)
 * @param {string} [programData.status] - Status (active, completed, etc.)
 * @returns {Promise<object>} - Created user program
 */
export const createUserProgram = async (programData) => {
  return apiCallWithAuth(API_ENDPOINTS.USER_PROGRAMS.create, 'POST', programData);
};

/**
 * Get single user program by ID
 * @param {number|string} id - User program ID
 * @returns {Promise<object>} - User program details
 */
export const getUserProgram = async (id) => {
  return apiCallWithAuth(API_ENDPOINTS.USER_PROGRAMS.detail(id), 'GET');
};

