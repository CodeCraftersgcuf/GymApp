import { apiCall } from '../../utils/customApiCall';
import { API_ENDPOINTS } from '../../apiConfig';

/**
 * WhatsApp Service
 * Handles WhatsApp support-related API calls (public endpoints)
 */

/**
 * Get WhatsApp support information
 * @returns {Promise<object>} - WhatsApp support number and link
 */
export const getWhatsAppSupport = async () => {
  return apiCall(API_ENDPOINTS.WHATSAPP.support, 'GET');
};

