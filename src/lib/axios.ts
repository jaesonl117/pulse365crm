import axios from 'axios';
import { getAuthToken } from './auth';
import { toast } from 'react-hot-toast';

const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging in development
    if (isDevelopment) {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        headers: config.headers
      });
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Debug logging in development
    if (isDevelopment) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      });
    }

    // Handle specific error cases
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const errorMessage = error.response.data?.message || 'An unexpected error occurred';
    
    switch (error.response.status) {
      case 400:
        toast.error(errorMessage);
        break;
      case 401:
        toast.error('Authentication required. Please log in.');
        break;
      case 403:
        toast.error('You don\'t have permission to perform this action.');
        break;
      case 404:
        toast.error('The requested resource was not found.');
        break;
      case 409:
        toast.error(errorMessage);
        break;
      case 422:
        toast.error(errorMessage);
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error('An unexpected error occurred. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;