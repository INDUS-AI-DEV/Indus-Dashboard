import axios from 'axios';

// Create a simple axios instance with default config
const axiosInstance = axios.create({
  baseURL: '/api', // Using relative path since we're using Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for CORS with credentials
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Create a new headers object to avoid mutating the original
      const newConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      };
      return newConfig;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default axiosInstance;
