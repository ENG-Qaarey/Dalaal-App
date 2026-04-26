import { api } from './api';

function unwrapResponse<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export const chatService = {
  async getConversations() {
    const response = await api.get('chat/conversations');
    return unwrapResponse<any[]>(response.data);
  },

  async getMessages(conversationId: string, page: number = 1, limit: number = 50) {
    const response = await api.get(`chat/conversations/${conversationId}/messages`, {
      params: { page, limit },
    });
    return unwrapResponse<any[]>(response.data);
  },

  async createConversation(participantId: string, listingId?: string, title?: string) {
    const response = await api.post('chat/conversations', {
      participantId,
      listingId,
      title,
    });
    return unwrapResponse<any>(response.data);
  },
};
