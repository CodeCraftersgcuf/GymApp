import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Exercise Service
 * Handles all exercise-related API calls (public endpoints)
 */

/**
 * Get list of exercises
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.equipment] - Filter by equipment (bodyweight, dumbbell, etc.)
 * @param {string} [params.primary_muscle] - Filter by primary muscle (chest, back, etc.)
 * @param {string} [params.difficulty] - Filter by difficulty (beginner, intermediate, advanced)
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of exercises
 */
export const getExercises = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.EXERCISES.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single exercise by ID
 * @param {number|string} id - Exercise ID
 * @returns {Promise<object>} - Exercise details
 */
export const getExercise = async (id) => {
  return apiCall(API_ENDPOINTS.EXERCISES.detail(id), 'GET');
};

