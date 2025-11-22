import { apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS } from '../../apiConfig';

/**
 * Order Service
 * Handles all order-related API calls (authenticated endpoints)
 */

/**
 * Create a new order
 * @param {object} orderData - Order data
 * @param {number} orderData.product_id - Product ID
 * @param {string} orderData.provider - Payment provider (stripe, etc.)
 * @returns {Promise<object>} - Created order with payment details
 */
export const createOrder = async (orderData) => {
  return apiCallWithAuth(API_ENDPOINTS.ORDERS.create, 'POST', orderData);
};

