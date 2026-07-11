const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";

interface RequestOptions extends RequestInit {
  _retry?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  }

  setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
  }

  clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { _retry, ...fetchOptions } = options;
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 - try refresh (skip for auth endpoints)
    const isAuthEndpoint = endpoint.includes("/auth/");
    if (response.status === 401 && !_retry && !isAuthEndpoint) {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const payload = refreshData?.data || refreshData;
            if (payload.accessToken) {
              this.setTokens(payload.accessToken, payload.refreshToken || refreshToken);
              return this.request<T>(endpoint, { ...options, _retry: true });
            }
          }
        } catch {
          this.clearTokens();
        }
      }
      this.clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP Error ${response.status}` };
      }
      const error = new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
      (error as any).response = { status: response.status, data: errorData };
      throw error;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data?.data !== undefined ? data.data : data;
    }

    return {} as T;
  }

  get<T = any>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : body == null ? undefined : JSON.stringify(body),
    });
  }

  put<T = any>(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body == null ? undefined : JSON.stringify(body),
    });
  }

  delete<T = any>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient(API_URL);

export const authService = {
  async register(data: {
    fullName: string;
    username?: string;
    phone?: string;
    email: string;
    password: string;
  }) {
    const result = await api.post("/auth/register", data);
    if (result.accessToken) {
      api.setTokens(result.accessToken, result.refreshToken);
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    }
    return result;
  },

  async login(identifier: string, password: string) {
    const result = await api.post("/auth/login", { identifier, password });
    if (result.accessToken) {
      api.setTokens(result.accessToken, result.refreshToken);
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    }
    return result;
  },

  async verifyEmail(email: string, code: string) {
    const result = await api.post("/auth/verify-email", { email, code });
    if (result.accessToken) {
      api.setTokens(result.accessToken, result.refreshToken);
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    }
    return result;
  },

  async resendVerification(email: string) {
    return api.post("/auth/resend-verification", { email });
  },

  async forgotPassword(email: string) {
    return api.post("/auth/forgot-password", { email });
  },

  async resetPassword(email: string, code: string, newPassword: string) {
    return api.post("/auth/reset-password", { email, code, newPassword });
  },

  async getProfile() {
    return api.get("/users/profile");
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore logout errors
    }
    api.clearTokens();
  },
};
