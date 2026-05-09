export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
}

export interface ConversationParticipant {
  userId: string;
  user?: any;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}
