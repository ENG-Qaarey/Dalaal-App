import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const resolveDevHost = () => {
  const manifest = Constants.manifest as any;
  const manifest2 = (Constants as any).manifest2;
  const hostUri =
    Constants.expoConfig?.hostUri ||
    manifest?.debuggerHost ||
    manifest2?.extra?.expoClient?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host) {
    return host;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

// Prefer EXPO_PUBLIC_API_URL; fall back to the Expo dev host for local development.
const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${resolveDevHost()}:3000/api`;

interface RequestOptions extends RequestInit {
  _retry?: boolean;
}

const request = async (endpoint: string, options: RequestOptions = {}) => {
  // Normalize endpoint
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${path}`;

  // Request Interceptor: Add Auth Token
  const token = await SecureStore.getItemAsync('accessToken');
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // If body is not FormData, ensure Content-Type is application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Handle multipart/form-data: fetch needs the boundary to be set automatically,
  // so we delete the manual Content-Type header if it exists for FormData.
  if (options.body instanceof FormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Response Interceptor: Handle 401 and Token Refresh
    if (response.status === 401 && !options._retry) {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const payload = refreshData?.data || refreshData;
            const { accessToken } = payload;

            if (accessToken) {
              await SecureStore.setItemAsync('accessToken', accessToken);
              
              // Retry the original request with the new token
              const retryHeaders = {
                ...headers,
                'Authorization': `Bearer ${accessToken}`,
              };
              return request(endpoint, { ...options, headers: retryHeaders, _retry: true });
            }
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and let the 401 bubble up
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
        }
      }
    }

    // Handle Non-OK responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP Error ${response.status}` };
      }

      const errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage) as any;
      error.response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    // Parse success response
    let data = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }
    } else {
      // Handle non-json or empty responses (like 204 No Content)
      await response.text(); // Consume the body
    }

    return { data }; // Wrap in data property to maintain Axios compatibility
  } catch (error: any) {
    // Handle Network Errors (simulating Axios error structure)
    if (error.message === 'Network request failed') {
      const message = 'Cannot connect to server. Please check your connection.';
      const networkError = new Error(message) as any;
      networkError.response = { data: { message } };
      throw networkError;
    }
    throw error;
  }
};

// Export an Axios-like API object
export const api = {
  get: (url: string, options?: RequestOptions) => 
    request(url, { ...options, method: 'GET' }),
  
  post: (url: string, body?: any, options?: RequestOptions) => 
    request(url, { 
      ...options, 
      method: 'POST', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  put: (url: string, body?: any, options?: RequestOptions) => 
    request(url, { 
      ...options, 
      method: 'PUT', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  patch: (url: string, body?: any, options?: RequestOptions) => 
    request(url, { 
      ...options, 
      method: 'PATCH', 
      body: body instanceof FormData ? body : JSON.stringify(body) 
    }),
  
  delete: (url: string, options?: RequestOptions) => 
    request(url, { ...options, method: 'DELETE' }),
};