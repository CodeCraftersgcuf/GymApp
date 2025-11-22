import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Progress Log Service
 * Handles all progress log-related API calls (authenticated endpoints)
 */

/**
 * Get list of progress logs
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page
 * @param {number} [params.page] - Page number
 * @returns {Promise<object>} - Paginated list of progress logs
 */
export const getProgressLogs = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.PROGRESS_LOGS.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Create a new progress log
 * @param {object} logData - Progress log data
 * @param {string} logData.logged_at - Date (YYYY-MM-DD)
 * @param {number} logData.weight_kg - Weight in kg
 * @param {number} [logData.body_fat_percent] - Body fat percentage
 * @param {number} [logData.chest_cm] - Chest measurement in cm
 * @param {number} [logData.waist_cm] - Waist measurement in cm
 * @param {number} [logData.hips_cm] - Hips measurement in cm
 * @param {string} [logData.notes] - Notes about progress
 * @returns {Promise<object>} - Created progress log
 */
export const createProgressLog = async (logData) => {
  return apiCallWithAuth(API_ENDPOINTS.PROGRESS_LOGS.create, 'POST', logData);
};

