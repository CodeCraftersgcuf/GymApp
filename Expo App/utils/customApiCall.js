import axios from 'axios';
import { getToken, getOnboardingToken } from './tokenStorage';
import { clearAuthData } from './tokenStorage';
import { CONFIG } from './config';

// Custom Error Class for API errors
export class ApiError extends Error {
  constructor(data, statusText, message, statusCode) {
    super();
    this.name = 'ApiError';
    this.data = data;
    this.statusText = statusText;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export const apiCall = async (url, method, data, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };

  try {
    // If payload is FormData, adjust headers
    const isMultipart = (typeof FormData !== 'undefined') && (data instanceof FormData);
    if (isMultipart) {
      delete headers['Content-Type'];
    }

    console.log(`Making ${method} request to:`, url);
    if (isMultipart) {
      console.log('Using multipart/form-data');
    }
    console.log('Headers:', headers);
    console.log('Data:', data);

    const axiosConfig = {
      headers,
      timeout: CONFIG.API_TIMEOUT,
    };

    let response;
    switch (method) {
      case 'GET':
        response = await axios.get(url, axiosConfig);
        break;
      case 'POST':
        response = await axios.post(url, data, axiosConfig);
        break;
      case 'PUT':
        response = await axios.put(url, data, axiosConfig);
        break;
      case 'PATCH':
        response = await axios.patch(url, data, axiosConfig);
        break;
      case 'DELETE':
        response = await axios.delete(url, axiosConfig);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error) {
    console.log('Full error object:', error);
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Is axios error:', axios.isAxiosError(error));

    if (axios.isAxiosError(error) && error.response) {
      const { data: errData, status, statusText } = error.response;
      throw new ApiError(errData, statusText, errData?.message || error.message || 'Request failed', status);
    }

    const errorMessage = error.code === 'ECONNABORTED' ? 'Request timeout' :
      error.message?.includes('Network Error') ? 'Network error' : 'Server unavailable';

    throw new ApiError(undefined, 'Network Error', errorMessage, 0);
  }
};

export const apiCallWithAuth = async (url, method, data) => {
  const token = await getToken();
  console.log('Token retrieved for API call:', token ? 'exists' : 'null');
  console.log('Token value:', token);
  return apiCall(url, method, data, token);
};
