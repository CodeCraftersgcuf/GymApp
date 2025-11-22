import { apiCall, apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Product Service
 * Handles all product-related API calls
 */

/**
 * Get list of products (public)
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @param {string} [params.search] - Search term
 * @returns {Promise<object>} - Paginated list of products
 */
export const getProducts = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.PRODUCTS.list, params);
  return apiCall(url, 'GET');
};

/**
 * Get single product by ID (public)
 * @param {number|string} id - Product ID
 * @returns {Promise<object>} - Product details
 */
export const getProduct = async (id) => {
  return apiCall(API_ENDPOINTS.PRODUCTS.detail(id), 'GET');
};

/**
 * Get list of products (authenticated - may include user-specific data)
 * @param {object} [params] - Query parameters
 * @param {number} [params.per_page] - Items per page (default: 15)
 * @param {number} [params.page] - Page number
 * @returns {Promise<object>} - Paginated list of products
 */
export const getProductsAuthenticated = async (params = {}) => {
  const url = buildUrl(API_ENDPOINTS.PRODUCTS.list, params);
  return apiCallWithAuth(url, 'GET');
};

