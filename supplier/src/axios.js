import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: '/', // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add an authorization token or custom headers
    const token = localStorage.getItem('authAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('Request Config:', config);
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify the response if needed
    // console.log('Response:', response);
    return response;
  },
  (error) => {
    // Handle response errors
    console.error('Error Response:', error.response);
    if (error.response && error.response.status === 403) {
      // Handle unauthorized errors (e.g., redirect to login)
      // localStorage.removeItem('user');
      // localStorage.removeItem('authAccessToken');
      // console.warn('Unauthorized! Redirecting to login...');
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
