import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Video Library Service
 * Handles all video library-related API calls (public endpoints)
 */

/**
 * Get list of video libraries
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of video libraries
 */
export const getVideoLibraries = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.VIDEO_LIBRARIES.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single video library by ID
 * @param {number|string} id - Video library ID
 * @returns {Promise<object>} - Video library details with videos
 */
export const getVideoLibrary = async (id) => {
  return apiCall(API_ENDPOINTS.VIDEO_LIBRARIES.detail(id), 'GET');
};

