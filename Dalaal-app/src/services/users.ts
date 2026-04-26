import { api } from './api';

function unwrapResponse<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export const userService = {
  async searchUsers(query: string = '', page: number = 1, limit: number = 20) {
    const response = await api.get('users', {
      params: { q: query, page, limit },
    });
    return unwrapResponse<any>(response.data);
  },

  async getUserProfile(id: string) {
    const response = await api.get(`users/${id}`);
    return unwrapResponse<any>(response.data);
  },
};
