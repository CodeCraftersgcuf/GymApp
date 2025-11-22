import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Workout Log Service
 * Handles all workout log-related API calls (authenticated endpoints)
 */

/**
 * Get list of workout logs
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page
 * @param {number} [params.page] - Page number
 * @returns {Promise<object>} - Paginated list of workout logs
 */
export const getWorkoutLogs = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.WORKOUT_LOGS.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Create a new workout log
 * @param {object} logData - Workout log data
 * @param {number} logData.workout_id - Workout ID
 * @param {string} logData.performed_at - Date and time (ISO 8601)
 * @param {number} logData.duration_minutes - Duration in minutes
 * @param {string} [logData.notes] - Notes about the workout
 * @returns {Promise<object>} - Created workout log
 */
export const createWorkoutLog = async (logData) => {
  return apiCallWithAuth(API_ENDPOINTS.WORKOUT_LOGS.create, 'POST', logData);
};

/**
 * Get single workout log by ID
 * @param {number|string} id - Workout log ID
 * @returns {Promise<object>} - Workout log details
 */
export const getWorkoutLog = async (id) => {
  return apiCallWithAuth(API_ENDPOINTS.WORKOUT_LOGS.detail(id), 'GET');
};

