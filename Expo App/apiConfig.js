export const API_BASE_URL = "http://10.232.246.151:8000/api";

// Minimal endpoints to start; add more as the app grows
const API_ENDPOINTS = {
  AUTH: {
    Register: `${API_BASE_URL}/auth/register`,
    Login: `${API_BASE_URL}/auth/login`,
  },
};

export { API_ENDPOINTS };
