import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Change this to your computer's IP address when testing on a real device
const DEV_IP = '172.20.10.2'; 
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${DEV_IP}:3001/api`;

console.log('Connecting to API at:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken } = response.data;
          
          await SecureStore.setItemAsync('accessToken', accessToken);
          
          // Update the original request header
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid, logout user
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          return Promise.reject(refreshError);
        }
      }
    }
    
    // Handle generic errors or timeouts
    return Promise.reject(error);
  }
);
