import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Check-in Service
 * Handles all check-in-related API calls (authenticated endpoints)
 */

/**
 * Get list of check-ins
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page
 * @param {number} [params.page] - Page number
 * @returns {Promise<object>} - Paginated list of check-ins
 */
export const getCheckIns = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.CHECK_INS.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Create a new check-in
 * @param {object} checkInData - Check-in data
 * @param {number} checkInData.coach_id - Coach ID
 * @param {string} checkInData.scheduled_at - Scheduled date and time (ISO 8601)
 * @param {string} [checkInData.status] - Status (scheduled, completed, etc.)
 * @param {string} [checkInData.notes] - Notes about the check-in
 * @returns {Promise<object>} - Created check-in
 */
export const createCheckIn = async (checkInData) => {
  return apiCallWithAuth(API_ENDPOINTS.CHECK_INS.create, 'POST', checkInData);
};

