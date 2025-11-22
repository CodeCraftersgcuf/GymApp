import { apiCall, apiCallWithAuth } from '../../utils/customApiCall';
import { API_ENDPOINTS, buildUrl } from '../../apiConfig';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @param {string} userData.name - User's name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} [userData.profile_picture] - Profile picture file
 * @param {string} [userData.gender] - User's gender (male, female, other)
 * @param {number} [userData.weight_kg] - User's weight in kg
 * @param {string} [userData.city] - User's city
 * @param {string} [userData.locale] - User's locale (default: 'en')
 * @param {string} [userData.timezone] - User's timezone (default: 'UTC')
 * @returns {Promise<object>} - Response with user data and token
 */
export const register = async (userData) => {
  return apiCall(API_ENDPOINTS.AUTH.register, 'POST', userData);
};

/**
 * Login user
 * @param {object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<object>} - Response with user data and token
 */
export const login = async (credentials) => {
  return apiCall(API_ENDPOINTS.AUTH.login, 'POST', credentials);
};

/**
 * Get current authenticated user
 * @returns {Promise<object>} - Current user data
 */
export const getCurrentUser = async () => {
  return apiCallWithAuth(API_ENDPOINTS.USER.me, 'GET');
};

/**
 * Update user profile
 * @param {object} userData - Updated user data
 * @param {string} [userData.name] - Updated name
 * @param {string} [userData.phone] - Updated phone
 * @param {string} [userData.email] - Updated email
 * @param {string} [userData.gender] - Updated gender
 * @param {string} [userData.dob] - Date of birth (YYYY-MM-DD)
 * @param {number} [userData.height_cm] - Height in cm
 * @param {number} [userData.weight_kg] - Weight in kg
 * @param {string} [userData.goal] - Fitness goal (fat_loss, muscle_gain, etc.)
 * @param {string} [userData.city] - City
 * @param {string} [userData.locale] - Locale
 * @param {string} [userData.timezone] - Timezone
 * @param {string} [userData.notification_token] - FCM token
 * @param {string|FormData} [userData.profile_picture] - Profile picture
 * @returns {Promise<object>} - Updated user data
 */
export const updateProfile = async (userData) => {
  return apiCallWithAuth(API_ENDPOINTS.USER.updateProfile, 'PUT', userData);
};

/**
 * Update user password
 * @param {object} passwordData - Password update data
 * @param {string} passwordData.current_password - Current password
 * @param {string} passwordData.password - New password
 * @param {string} passwordData.password_confirmation - New password confirmation
 * @returns {Promise<object>} - Success response
 */
export const updatePassword = async (passwordData) => {
  return apiCallWithAuth(API_ENDPOINTS.USER.updatePassword, 'PUT', passwordData);
};

/**
 * Logout user
 * @returns {Promise<object>} - Success response
 */
export const logout = async () => {
  return apiCallWithAuth(API_ENDPOINTS.USER.logout, 'POST');
};

