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

// Auth
export const authService = {
  async register(data: {
    fullName: string;
    username?: string;
    phone?: string;
    email: string;
    password: string;
    role?: string;
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

  async updateProfile(data: any) {
    return api.put("/users/profile", data);
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

// Listings
export const listingsService = {
  async getAll(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/listings${query ? `?${query}` : ""}`);
  },
  async getMine(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/listings/mine${query ? `?${query}` : ""}`);
  },
  async getById(id: string) {
    return api.get(`/listings/${id}`);
  },
  async create(data: any) {
    return api.post("/listings", data);
  },
  async update(id: string, data: any) {
    return api.put(`/listings/${id}`, data);
  },
  async delete(id: string) {
    return api.delete(`/listings/${id}`);
  },
  async publish(id: string) {
    return api.post(`/listings/${id}/publish`);
  },
};

// Admin
export const adminService = {
  // Dashboard & Analytics
  async getStats() { return api.get("/admin/stats"); },
  async getDashboard() { return api.get("/admin/dashboard"); },
  async getAnalyticsOverview(period?: string) { return api.get(`/admin/analytics/overview${period ? `?period=${period}` : ""}`); },
  async getAnalyticsTimeseries(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/analytics/timeseries${q ? `?${q}` : ""}`); },
  async getAnalyticsBreakdown(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/analytics/listings/breakdown${q ? `?${q}` : ""}`); },
  async getBrokerAnalytics(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/analytics/brokers${q ? `?${q}` : ""}`); },

  // Users
  async getUsers(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/users${q ? `?${q}` : ""}`); },
  async getUserById(id: string) { return api.get(`/admin/users/${id}`); },
  async updateUserStatus(id: string, status: string) { return api.put(`/admin/users/${id}/status`, { status }); },
  async updateUser(id: string, data: any) { return api.put(`/users/${id}`, data); },
  async deleteUser(id: string) { return api.delete(`/users/${id}`); },

  // Listings
  async getAllListings(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/listings${q ? `?${q}` : ""}`); },
  async getPendingListings() { return api.get("/admin/pending-listings"); },
  async approveListing(id: string) { return api.post(`/admin/listings/${id}/approve`); },
  async rejectListing(id: string, reason: string) { return api.post(`/admin/listings/${id}/reject`, { reason }); },

  // Properties & Vehicles
  async getAllProperties(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/properties${q ? `?${q}` : ""}`); },
  async getAllVehicles(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/vehicles${q ? `?${q}` : ""}`); },

  // Payments & Escrow
  async getPayments(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/payments${q ? `?${q}` : ""}`); },
  async getEscrow(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/escrow${q ? `?${q}` : ""}`); },

  // Reviews
  async getReviews(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/reviews${q ? `?${q}` : ""}`); },
  async deleteReview(id: string) { return api.delete(`/admin/reviews/${id}`); },

  // Reports
  async getReports(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/reports${q ? `?${q}` : ""}`); },
  async updateReportStatus(id: string, status: string, resolution?: string) { return api.put(`/reports/${id}/status`, { status, resolution }); },
  async exportSystemReport() { return api.get('/admin/reports/export'); },

  // Notifications
  async getNotifications(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/notifications${q ? `?${q}` : ""}`); },

  // Verifications
  async getPendingVerifications() { return api.get("/verification/pending"); },
  async updateVerificationStatus(id: string, status: string, rejectionReason?: string) { return api.put(`/verification/${id}/status`, { status, rejectionReason }); },

  // Announcements
  async getAnnouncements() { return api.get("/admin/announcements"); },
  async createAnnouncement(data: any) { return api.post("/admin/announcements", data); },
  async updateAnnouncement(id: string, data: any) { return api.put(`/admin/announcements/${id}`, data); },
  async deleteAnnouncement(id: string) { return api.delete(`/admin/announcements/${id}`); },

  // Public Announcements (For customers & brokers)
  async getPublicAnnouncements() { return api.get("/announcements"); },

  // Contact Messages
  async getContactMessages(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/contact-messages${q ? `?${q}` : ""}`); },
  async updateContactMessage(id: string, data: any) { return api.put(`/admin/contact-messages/${id}`, data); },

  // FAQs
  async getFaqs() { return api.get("/admin/faqs"); },
  async createFaq(data: any) { return api.post("/admin/faqs", data); },
  async updateFaq(id: string, data: any) { return api.put(`/admin/faqs/${id}`, data); },
  async deleteFaq(id: string) { return api.delete(`/admin/faqs/${id}`); },

  // Audit Logs
  async getAuditLogs(params?: any) { const q = new URLSearchParams(params).toString(); return api.get(`/admin/audit-logs${q ? `?${q}` : ""}`); },
};

export const usersService = adminService;

// Payments
export const paymentsService = {
  async create(data: any) {
    return api.post("/payments", data);
  },
  async getMy() {
    return api.get("/payments/my");
  },
  async verify(id: string, transactionId: string) {
    return api.post(`/payments/${id}/verify`, { transactionId });
  },
};

// Escrow
export const escrowService = {
  async create(data: any) {
    return api.post("/escrow", data);
  },
  async getMy() {
    return api.get("/escrow/my");
  },
  async release(id: string) {
    return api.post(`/escrow/${id}/release`);
  },
};

// Verification
export const verificationService = {
  async submit(data: any) {
    return api.post("/verification", data);
  },
  async getMy() {
    return api.get("/verification/my");
  },
};

// Favorites
export const favoritesService = {
  async getMy() {
    return api.get("/favorites/my");
  },
  async toggle(listingId: string) {
    return api.post(`/favorites/${listingId}`);
  },
  async add(listingId: string) {
    return api.post(`/favorites/${listingId}`);
  },
  async remove(listingId: string) {
    return api.post(`/favorites/${listingId}`);
  },
};

// Search
export const searchService = {
  async search(query: any) {
    const params = new URLSearchParams(query).toString();
    return api.get(`/search${params ? `?${params}` : ""}`);
  },
};

// Agents (Broker)
export const agentsService = {
  async getStats(period?: string) {
    const params = period ? `?period=${period}` : "";
    return api.get(`/agents/me/stats${params}`);
  },
  async getLeads() {
    return api.get("/agents/me/leads");
  },
  async getListings(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/agents/me/listings${query ? `?${query}` : ""}`);
  },
};

// Chat
export const chatService = {
  async getConversations() {
    return api.get("/chat/conversations");
  },
  async createConversation(data: { participantId: string; listingId?: string; title?: string }) {
    return api.post("/chat/conversations", data);
  },
  async getMessages(conversationId: string, params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/chat/conversations/${conversationId}/messages${query ? `?${query}` : ""}`);
  },
  async sendMessage(conversationId: string, data: { content?: string; mediaUrl?: string; type?: string; tempId?: string }) {
    return api.post(`/chat/conversations/${conversationId}/messages`, data);
  },
  async deleteMessage(messageId: string) {
    return api.delete(`/chat/messages/${messageId}`);
  },
};

// Notifications
export const notificationsService = {
  async getAll(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/notifications${query ? `?${query}` : ""}`);
  },
  async getUnreadCount() {
    return api.get("/notifications/unread-count");
  },
  async markRead(id: string) {
    return api.put(`/notifications/${id}/read`);
  },
  async markAllRead() {
    return api.put("/notifications/read-all");
  },
};

// Reviews
export const reviewsService = {
  async getForUser(userId: string, params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reviews/user/${userId}${query ? `?${query}` : ""}`);
  },
  async getForListing(listingId: string) {
    return api.get(`/reviews/listing/${listingId}`);
  },
  async create(data: any) {
    return api.post("/reviews", data);
  },
  async respond(reviewId: string, response: string) {
    return api.put(`/reviews/${reviewId}/respond`, { response });
  },
};

// Reports
export const reportsService = {
  async submit(data: { reportedId?: string; listingId?: string; type: string; description: string }) {
    return api.post("/reports", data);
  },
  async getMine(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reports/mine${query ? `?${query}` : ""}`);
  },
};

// Uploads
export const uploadsService = {
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/uploads/image", formData);
  },
  async uploadVideo(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/uploads/video", formData);
  },
};

