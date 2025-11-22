import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Package Service
 * Handles all package-related API calls (public endpoints)
 */

/**
 * Get list of packages
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @returns {Promise<object>} - List of packages
 */
export const getPackages = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.PACKAGES.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single package by ID
 * @param {number|string} id - Package ID
 * @returns {Promise<object>} - Package details
 */
export const getPackage = async (id) => {
  return apiCall(API_ENDPOINTS.PACKAGES.detail(id), 'GET');
};

