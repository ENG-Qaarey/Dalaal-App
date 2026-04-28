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

  async sendMessage(conversationId: string, payload: { content?: string; mediaUrl?: string; tempId?: string }) {
    const response = await api.post(`chat/conversations/${conversationId}/messages`, payload);
    return unwrapResponse<any>(response.data);
  },

  async deleteMessage(messageId: string, scope: 'self' | 'all' = 'self') {
    try {
      const response = await api.delete(`chat/messages/${messageId}`, {
        params: { scope },
      });
      return unwrapResponse<any>(response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      const responseMessage = String(error?.response?.data?.message || '');
      const isDeleteRouteMissing =
        status === 404 &&
        responseMessage.includes('Cannot DELETE') &&
        responseMessage.includes('/chat/messages/');

      if (status === 405 || isDeleteRouteMissing) {
        try {
          const response = await api.post(`chat/messages/${messageId}/delete`, {}, {
            params: { scope },
          });
          return unwrapResponse<any>(response.data);
        } catch (postDeleteError: any) {
          const postDeleteStatus = postDeleteError?.response?.status;
          const postDeleteMessage = String(postDeleteError?.response?.data?.message || '');
          const isPostDeleteRouteMissing =
            postDeleteStatus === 404 &&
            postDeleteMessage.includes('Cannot POST') &&
            postDeleteMessage.includes('/chat/messages/');

          if (!isPostDeleteRouteMissing) {
            throw postDeleteError;
          }

          const legacyResponse = await api.post(`chat/messages/${messageId}`, { scope });
          return unwrapResponse<any>(legacyResponse.data);
        }
      }
      throw error;
    }
  },
};
