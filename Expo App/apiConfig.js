export const API_BASE_URL = "http://10.62.36.10:8000/api/v1";

/**
 * Helper function to build URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {object} params - Query parameters object
 * @returns {string} - URL with query string
 */
export const buildUrl = (baseUrl, params = {}) => {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }
  
  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * API Endpoints organized by resource type
 * All endpoints use the base URL: http://10.62.36.10:8000/api/v1
 */
const API_ENDPOINTS = {
  // ==================== Public Endpoints ====================
  
  // Health & Config
  HEALTH: {
    check: `${API_BASE_URL}/health`,
    config: `${API_BASE_URL}/config`,
  },

  // Authentication (Public)
  AUTH: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
  },

  // Programs (Public)
  PROGRAMS: {
    list: `${API_BASE_URL}/programs`,
    detail: (id) => `${API_BASE_URL}/programs/${id}`,
  },

  // Plans (Public)
  PLANS: {
    list: `${API_BASE_URL}/plans`,
    detail: (id) => `${API_BASE_URL}/plans/${id}`,
  },

  // Exercises (Public)
  EXERCISES: {
    list: `${API_BASE_URL}/exercises`,
    detail: (id) => `${API_BASE_URL}/exercises/${id}`,
  },

  // FAQs (Public)
  FAQS: {
    list: `${API_BASE_URL}/faqs`,
    detail: (id) => `${API_BASE_URL}/faqs/${id}`,
  },

  // Video Libraries (Public)
  VIDEO_LIBRARIES: {
    list: `${API_BASE_URL}/video-libraries`,
    detail: (id) => `${API_BASE_URL}/video-libraries/${id}`,
  },

  // Banners (Public)
  BANNERS: {
    list: `${API_BASE_URL}/banners`,
    detail: (id) => `${API_BASE_URL}/banners/${id}`,
  },

  // Achievements (Public)
  ACHIEVEMENTS: {
    list: `${API_BASE_URL}/achievements`,
    detail: (id) => `${API_BASE_URL}/achievements/${id}`,
  },

  // Reviews (Public)
  REVIEWS: {
    list: `${API_BASE_URL}/reviews`,
    detail: (id) => `${API_BASE_URL}/reviews/${id}`,
  },

  // Communities (Public)
  COMMUNITIES: {
    list: `${API_BASE_URL}/communities`,
    detail: (id) => `${API_BASE_URL}/communities/${id}`,
  },

  // Products (Public)
  PRODUCTS: {
    list: `${API_BASE_URL}/products`,
    detail: (id) => `${API_BASE_URL}/products/${id}`,
  },

  // Packages (Public)
  PACKAGES: {
    list: `${API_BASE_URL}/packages`,
    detail: (id) => `${API_BASE_URL}/packages/${id}`,
  },

  // WhatsApp Support (Public)
  WHATSAPP: {
    support: `${API_BASE_URL}/messages/whatsapp-support`,
  },

  // ==================== Authenticated Endpoints ====================

  // User Management (Authenticated)
  USER: {
    me: `${API_BASE_URL}/auth/me`,
    updateProfile: `${API_BASE_URL}/auth/me`,
    updatePassword: `${API_BASE_URL}/auth/password`,
    logout: `${API_BASE_URL}/auth/logout`,
  },

  // User Programs (Authenticated)
  USER_PROGRAMS: {
    list: `${API_BASE_URL}/user-programs`,
    create: `${API_BASE_URL}/user-programs`,
    detail: (id) => `${API_BASE_URL}/user-programs/${id}`,
  },

  // Workout Logs (Authenticated)
  WORKOUT_LOGS: {
    list: `${API_BASE_URL}/workout-logs`,
    create: `${API_BASE_URL}/workout-logs`,
    detail: (id) => `${API_BASE_URL}/workout-logs/${id}`,
  },

  // Nutrition Logs (Authenticated)
  NUTRITION_LOGS: {
    list: `${API_BASE_URL}/nutrition-logs`,
    create: `${API_BASE_URL}/nutrition-logs`,
  },

  // Progress Logs (Authenticated)
  PROGRESS_LOGS: {
    list: `${API_BASE_URL}/progress-logs`,
    create: `${API_BASE_URL}/progress-logs`,
  },

  // Check-ins (Authenticated)
  CHECK_INS: {
    list: `${API_BASE_URL}/check-ins`,
    create: `${API_BASE_URL}/check-ins`,
  },

  // Messages (Authenticated)
  MESSAGES: {
    list: `${API_BASE_URL}/messages`,
    send: `${API_BASE_URL}/messages`,
    unreadCount: `${API_BASE_URL}/messages/unread-count`,
  },

  // Notifications (Authenticated)
  NOTIFICATIONS: {
    list: `${API_BASE_URL}/notifications`,
    unreadCount: `${API_BASE_URL}/notifications/unread-count`,
    detail: (id) => `${API_BASE_URL}/notifications/${id}`,
    markAsRead: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    markAllAsRead: `${API_BASE_URL}/notifications/read-all`,
  },

  // Orders (Authenticated)
  ORDERS: {
    create: `${API_BASE_URL}/orders`,
  },

  // ==================== Premium Endpoints ====================

  // My Plans (Premium - Authenticated)
  MY_PLANS: {
    list: `${API_BASE_URL}/myplans`,
    detail: (id) => `${API_BASE_URL}/myplans/${id}`,
  },
};

export { API_ENDPOINTS };
