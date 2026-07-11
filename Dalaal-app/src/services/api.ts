import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/authStore';
import { getApiBaseUrl, getNetworkHelpMessage } from '../utils/network-config';

let cachedApiBaseUrl: string | null = null;

interface RequestOptions extends RequestInit {
  _retry?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrlWithParams(base: string, endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const root = base.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!params) return `${root}${path}`;
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `${root}${path}?${qs}` : `${root}${path}`;
}

const safeGetItem = async (key: string) => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
};

const safeSetItem = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // ignore secure store errors
  }
};

const safeDeleteItem = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // ignore secure store errors
  }
};

const REQUEST_TIMEOUT_MS = 20000;

async function fetchWithTimeout(url: string, config: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...config, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Network request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildUrl(base: string, endpoint: string): string {
  const root = base.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${root}${path}`;
}

function uniqueUrls(urls: Array<string | null | undefined>): string[] {
  const cleaned = urls
    .map((u) => (u ? u.replace(/\/$/, '') : null))
    .filter((u): u is string => Boolean(u));
  return [...new Set(cleaned)];
}

async function probeHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(buildUrl(baseUrl, 'health'), { method: 'GET' });
    if (!res.ok) return false;
    const json = await res.json().catch(() => null);
    const payload = json?.data ?? json;
    return payload?.ok === true || payload?.database === 'connected';
  } catch {
    return false;
  }
}

async function resolveReachableApiBaseUrl(primary: string): Promise<string> {
  const candidates = uniqueUrls([
    primary,
    process.env.EXPO_PUBLIC_API_URL,
    // Common Android emulator host mapping
    'http://10.0.2.2:3005/api',
    // Common iOS simulator / web fallback
    'http://localhost:3005/api',
  ]);

  for (const candidate of candidates) {
    if (await probeHealth(candidate)) {
      return candidate;
    }
  }

  return primary;
}

const request = async (endpoint: string, options: RequestOptions = {}) => {
  const API_URL = cachedApiBaseUrl ?? getApiBaseUrl();
  const { params, ...fetchOptions } = options;
  const url = buildUrlWithParams(API_URL, endpoint, params);
  if (__DEV__) {
    console.log('[API]', options.method || 'GET', url);
  }

  // Request Interceptor: Add Auth Token
  const token = await safeGetItem('accessToken');
  
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
    ...fetchOptions,
    headers,
  };

  const forceLogout = async () => {
    await safeDeleteItem('accessToken');
    await safeDeleteItem('refreshToken');
    await useAuthStore.getState().logout();
  };

  try {
    const response = await fetchWithTimeout(url, config);

    // Response Interceptor: Handle 401 and Token Refresh
    if (response.status === 401 && !options._retry) {
      let errorPayload: any = null;
      try {
        errorPayload = await response.clone().json();
      } catch {
        errorPayload = null;
      }

      if (errorPayload?.message === 'Session expired. Logged in on another device.') {
        await forceLogout();
      } else {
      const refreshToken = await safeGetItem('refreshToken');
      
      if (refreshToken) {
        try {
          const refreshResponse = await fetchWithTimeout(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const payload = refreshData?.data || refreshData;
            const { accessToken } = payload;

            if (accessToken) {
              await safeSetItem('accessToken', accessToken);
              
              // Retry the original request with the new token
              const retryHeaders = {
                ...headers,
                'Authorization': `Bearer ${accessToken}`,
              };
              const retryBody = options.body ? options.body : undefined;
              return request(endpoint, { ...options, body: retryBody, headers: retryHeaders, _retry: true });
            }
          } else {
            // Refresh token is invalid/expired; clear stored tokens but allow the original 401 to bubble up.
            await safeDeleteItem('accessToken');
            await safeDeleteItem('refreshToken');
          }
        } catch (refreshError) {
          await forceLogout();
        }
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

      let errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
      if (response.status === 404) {
        errorMessage =
          'API not found (404). Start the backend (cd backend && npm run start:dev), then reload the app. Check console for [API] URL.';
      }
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
      let rawText = '';
      try {
        rawText = await response.text();
        const trimmed = rawText.trim();
        data = trimmed ? JSON.parse(trimmed) : {};
      } catch (e) {
        const bodyPreview = rawText ? rawText.slice(0, 2000) : '';
        console.error('Failed to parse JSON response', {
          error: e,
          status: response.status,
          url: response.url,
          body: bodyPreview,
        });
        data = {};
      }
    } else {
      // Handle non-json or empty responses (like 204 No Content)
      await response.text(); // Consume the body
    }

    return { data }; // Wrap in data property to maintain Axios compatibility
  } catch (error: any) {
    // Handle Network Errors (simulating Axios error structure)
    if (
      error.message === 'Network request failed' ||
      error.message?.includes('timed out') ||
      error.message?.includes('Failed to fetch')
    ) {
      // Auto-heal: try common base URLs and retry once.
      if (!options._retry) {
        const reachable = await resolveReachableApiBaseUrl(API_URL);
        if (reachable && reachable !== API_URL) {
          cachedApiBaseUrl = reachable;
          return request(endpoint, { ...options, _retry: true });
        }
      }

      const message = getNetworkHelpMessage(API_URL);
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
      body: body instanceof FormData ? body : (body == null ? undefined : JSON.stringify(body)) 
    }),
  
  put: (url: string, body?: any, options?: RequestOptions) => 
    request(url, { 
      ...options, 
      method: 'PUT', 
      body: body instanceof FormData ? body : (body == null ? undefined : JSON.stringify(body)) 
    }),
  
  patch: (url: string, body?: any, options?: RequestOptions) => 
    request(url, { 
      ...options, 
      method: 'PATCH', 
      body: body instanceof FormData ? body : (body == null ? undefined : JSON.stringify(body)) 
    }),
  
  delete: (url: string, options?: RequestOptions) => 
    request(url, { ...options, method: 'DELETE' }),
};

export { getApiBaseUrl };