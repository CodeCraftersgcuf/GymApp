import { Alert } from 'react-native';
import { ApiError } from './customApiCall';

// Error types for different scenarios
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error messages mapping
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network connection failed. Please check your internet connection.',
  [ERROR_TYPES.AUTH]: 'Authentication failed. Please login again.',
  [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

// Custom error handler class
export class ErrorHandler {
  static getErrorType(error) {
    if (error instanceof ApiError) {
      // Treat statusCode 0 (no response) as a network error
      if (error.statusCode === 0 || (typeof error.message === 'string' && error.message.toLowerCase().includes('network'))) {
        return ERROR_TYPES.NETWORK;
      }
      switch (error.statusCode) {
        case 401:
        case 403:
          return ERROR_TYPES.AUTH;
        case 400:
        case 422:
          return ERROR_TYPES.VALIDATION;
        case 500:
        case 502:
        case 503:
          return ERROR_TYPES.SERVER;
        default:
          return ERROR_TYPES.UNKNOWN;
      }
    }
    
    // Network errors
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return ERROR_TYPES.NETWORK;
    }
    
    return ERROR_TYPES.UNKNOWN;
  }

  static getErrorMessage(error, customMessage = null) {
    if (customMessage) return customMessage;
    
    const errorType = this.getErrorType(error);
    
    if (error instanceof ApiError && error.data?.message) {
      return error.data.message;
    }
    
    if (error.message && error.message !== 'Something went wrong') {
      return error.message;
    }
    
    return ERROR_MESSAGES[errorType];
  }

  static handleError(error, customMessage = null, showAlert = true) {
    const errorType = this.getErrorType(error);
    const errorMessage = this.getErrorMessage(error, customMessage);
    
    console.error('API Error:', {
      type: errorType,
      message: errorMessage,
      originalError: error,
      statusCode: error.statusCode || 'N/A'
    });

    if (showAlert) {
      Alert.alert('Error', errorMessage);
    }

    return {
      type: errorType,
      message: errorMessage,
      originalError: error
    };
  }

  static handleApiError(error, customMessage = null) {
    return this.handleError(error, customMessage, true);
  }

  static handleSilentError(error, customMessage = null) {
    return this.handleError(error, customMessage, false);
  }

  // Specific error handlers for common scenarios
  static handleAuthError(error) {
    return this.handleError(error, 'Authentication failed. Please login again.');
  }

  static handleValidationError(error) {
    const message = error.data?.errors ? 
      Object.values(error.data.errors).flat().join('\n') : 
      'Please check your input and try again.';
    return this.handleError(error, message);
  }

  static handleNetworkError(error) {
    return this.handleError(error, 'Network connection failed. Please check your internet connection.');
  }

  static handleServerError(error) {
    return this.handleError(error, 'Server error occurred. Please try again later.');
  }
}

// React Hook for error handling
export const useErrorHandler = () => {
  const handleError = (error, customMessage = null) => {
    return ErrorHandler.handleApiError(error, customMessage);
  };

  const handleSilentError = (error, customMessage = null) => {
    return ErrorHandler.handleSilentError(error, customMessage);
  };

  return {
    handleError,
    handleSilentError,
    ErrorHandler
  };
};

export default ErrorHandler;
