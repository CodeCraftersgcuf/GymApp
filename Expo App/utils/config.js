// Development configuration
export const CONFIG = {
  // Set to true to force mock data usage (skip real API calls)
  USE_MOCK_DATA: false,
  
  // API timeout in milliseconds
  API_TIMEOUT: 10000,
  
  // Mock API delay to simulate real API calls
  MOCK_DELAY: 1000,
};

// Helper function to check if we should use mock data
export const shouldUseMockData = () => {
  return CONFIG.USE_MOCK_DATA;
};
