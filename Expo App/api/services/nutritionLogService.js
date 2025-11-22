import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Nutrition Log Service
 * Handles all nutrition log-related API calls (authenticated endpoints)
 */

/**
 * Get list of nutrition logs
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page
 * @param {number} [params.page] - Page number
 * @returns {Promise<object>} - Paginated list of nutrition logs
 */
export const getNutritionLogs = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.NUTRITION_LOGS.list, params);
  return apiCallWithAuth(url, 'GET');
};

/**
 * Create a new nutrition log
 * @param {object} logData - Nutrition log data
 * @param {string} logData.logged_at - Date (YYYY-MM-DD)
 * @param {number} logData.kcal - Calories
 * @param {number} logData.protein_g - Protein in grams
 * @param {number} logData.carbs_g - Carbs in grams
 * @param {number} logData.fats_g - Fats in grams
 * @param {number} [logData.water_ml] - Water intake in ml
 * @param {string} [logData.notes] - Notes about nutrition
 * @returns {Promise<object>} - Created nutrition log
 */
export const createNutritionLog = async (logData) => {
  return apiCallWithAuth(API_ENDPOINTS.NUTRITION_LOGS.create, 'POST', logData);
};

