import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS } from '../../apiConfig';

/**
 * Health Service
 * Handles health check and config API calls (public endpoints)
 */

/**
 * Check API health status
 * @returns {Promise<object>} - Health status response
 */
export const checkHealth = async () => {
  return apiCall(API_ENDPOINTS.HEALTH.check, 'GET');
};

/**
 * Get app configuration
 * @returns {Promise<object>} - App configuration including features, locales, etc.
 */
export const getConfig = async () => {
  return apiCall(API_ENDPOINTS.HEALTH.config, 'GET');
};

