import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://172.20.10.5:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!error.response) {
      let message = 'Cannot connect to server';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        message = 'Server is not responding';
      } else if (error.code === 'ECONNREFUSED') {
        message = 'Cannot connect to server';
      }
      const networkError = new Error(message);
      networkError.response = { data: { message } };
      return Promise.reject(networkError);
    }
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}auth/refresh`, { refreshToken });
          const refreshPayload = response.data?.data || response.data;
          const { accessToken } = refreshPayload;
          
          await SecureStore.setItemAsync('accessToken', accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
          return Promise.reject(refreshError);
        }
      }
    }
    
    const errorMessage = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'An error occurred';
    const enhancedError = new Error(errorMessage);
    enhancedError.response = error.response;
    return Promise.reject(enhancedError);
  }
);