import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// IMPORTANT: When testing on a real device (physical phone), this MUST be your computer's local IP address.
// 1. Open a terminal and run 'ipconfig'.
// 2. Find your IPv4 Address (e.g., 172.20.10.2 or 192.168.1.X).
// 3. Update the DEV_IP constant below with that address.
// 4. Ensure your phone and computer are on the SAME Wi-Fi/Hotspot.
const DEV_IP = '172.20.10.2'; 
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${DEV_IP}:3001/api`;

console.log('Connecting to API at:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      console.log('Sending token:', token.substring(0, 10) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in SecureStore');
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
    if (error.response?.status === 401) {
      console.log('401 Unauthorized error for URL:', error.config?.url);
    }
    return Promise.reject(error);
  }
);
