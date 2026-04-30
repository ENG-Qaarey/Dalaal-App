import { create } from 'zustand';
import { chatService } from '../services/chat';
import { useAuthStore } from './authStore';

export type ChatListItem = {
  id: string;
  participantId?: string;
  name: string;
  role: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  pinned: boolean;
  imageUri?: string;
  conversationId?: string;
};

const formatTime = (value?: string | Date) => {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const buildDisplayName = (user?: any) => {
  if (!user) return 'User';
  if (user.username) return `@${user.username}`;
  const firstName = user.profile?.firstName || '';
  const lastName = user.profile?.lastName || '';
  const name = `${firstName} ${lastName}`.trim();
  return name || user.email || 'User';
};

const previewForMessage = (message: any) => {
  if (message?.type === 'SYSTEM' && typeof message?.content === 'string') {
    const callParts = message.content.split('|');
    if (callParts[0] === 'CALL') {
      const status = callParts[1] || 'missed';
      const mode = callParts[2] || 'audio';
      const durationSeconds = Number.parseInt(callParts[3] || '0', 10) || 0;
      const mins = Math.floor(durationSeconds / 60)
        .toString()
        .padStart(2, '0');
      const secs = (durationSeconds % 60).toString().padStart(2, '0');
      const durationLabel = durationSeconds > 0 ? ` (${mins}:${secs})` : '';
      if (status === 'answered') return `Call ended${durationLabel}`;
      if (status === 'declined') return 'Call declined';
      return `Missed ${mode} call`;
    }
  }
  if (message?.content) return message.content;
  if (message?.mediaUrl) return 'Photo';
  return 'New message';
};

type ChatStore = {
  chats: ChatListItem[];
  isLoading: boolean;
  activeConversationId: string | null;
  fetchConversations: () => Promise<void>;
  startChatWithUser: (user: { id: string; name: string; role: string; online: boolean; imageUri?: string }) => Promise<ChatListItem>;
  addMessage: (conversationId: string, message: any) => void;
  applyIncomingMessage: (message: any) => void;
  markConversationRead: (conversationId: string) => void;
  updateConversationPreview: (conversationId: string, message?: any) => void;
  setActiveConversation: (conversationId: string | null) => void;
  clearActiveConversation: () => void;
  isActiveConversation: (conversationId: string) => boolean;
  incrementUnread: (conversationId: string) => void;
  reset: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  isLoading: false,
  activeConversationId: null,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const currentUserId = useAuthStore.getState().user?.id;
      const conversations = await chatService.getConversations();
      const hasUnreadInPayload = conversations.some(
        (conv: any) => conv?.unreadCount != null || conv?.unread != null || conv?.participants?.some((p: any) => p?.unreadCount != null),
      );
      if (!hasUnreadInPayload) {
        console.warn('chatService.getConversations() payload does not include unread counts');
      }
      const mappedChats: ChatListItem[] = conversations
        .map((conv: any) => {
        const otherParticipant = conv.participants?.find((p: any) => p.userId !== currentUserId);
        if (!otherParticipant) return null;
        const lastMessage = conv.messages[0];
        const otherUser = otherParticipant?.user;
        const lastSeen = otherUser?.lastLoginAt ? new Date(otherUser.lastLoginAt).getTime() : 0;
        const isOnline = lastSeen > 0 && Date.now() - lastSeen < 10 * 60 * 1000;

        return {
          id: conv.id,
          participantId: otherParticipant?.userId,
          conversationId: conv.id,
          name: buildDisplayName(otherUser),
          role: otherUser?.role || 'User',
          message: lastMessage?.content || 'No messages yet',
          time: lastMessage ? formatTime(lastMessage.createdAt) : 'now',
          unread: conv.unreadCount ?? conv.unread ?? otherParticipant?.unreadCount ?? 0,
          online: isOnline,
          pinned: false,
          imageUri: otherUser?.profile?.avatar,
        };
      })
      .filter(Boolean) as ChatListItem[];
      set({ chats: mappedChats });
    } catch (error) {
      // Handle error silently
    } finally {
      set({ isLoading: false });
    }
  },

  startChatWithUser: async (user) => {
    const currentUserId = useAuthStore.getState().user?.id;
    if (currentUserId && user.id === currentUserId) {
      throw new Error('You cannot chat with yourself.');
    }
    const existing = get().chats.find((c) => c.participantId === user.id);
    if (existing) return existing;

    try {
      const conv = await chatService.createConversation(user.id);
      const newChat: ChatListItem = {
        id: conv.id,
        participantId: user.id,
        conversationId: conv.id,
        name: user.name,
        role: user.role,
        message: 'Tap to start chatting',
        time: 'now',
        unread: 0,
        online: user.online,
        pinned: false,
        imageUri: user.imageUri,
      };
      set((state) => ({ chats: [newChat, ...state.chats] }));
      return newChat;
    } catch (error) {
      throw error;
    }
  },

  addMessage: (conversationId, message) => {
    get().applyIncomingMessage({ ...message, conversationId });
  },

  applyIncomingMessage: (message) => {
    const currentUserId = useAuthStore.getState().user?.id;
    if (!currentUserId || !message?.conversationId) return;
    const isIncoming = message.senderId && message.senderId !== currentUserId;
    const isActive = get().activeConversationId === message.conversationId;
    const preview = previewForMessage(message);
    const time = formatTime(message.createdAt);

    set((state) => {
      const existingIndex = state.chats.findIndex(
        (chat) => chat.conversationId === message.conversationId || chat.id === message.conversationId
      );

      if (existingIndex === -1) {
        const sender = message.sender || {};
        const recipient = message.recipient || message.to || {};
        const recipientId = message.recipientId || recipient?.id;
        const targetUser = isIncoming ? sender : recipient;
        const name = buildDisplayName(targetUser);
        const role = targetUser?.role || 'User';
        const newChat: ChatListItem = {
          id: message.conversationId,
          participantId: isIncoming ? message.senderId : recipientId,
          conversationId: message.conversationId,
          name,
          role,
          message: preview,
          time,
          unread: isIncoming && !isActive ? 1 : 0,
          online: false,
          pinned: false,
          imageUri: targetUser?.profile?.avatar,
        };
        return { chats: [newChat, ...state.chats] };
      }

      const existing = state.chats[existingIndex];
      const sender = message.sender || {};
      let unread = existing.unread || 0;
      if (isIncoming && !isActive) {
        unread += 1;
      }
      if (isActive) {
        unread = 0;
      }
      const updated = {
        ...existing,
        participantId: existing.participantId || (isIncoming ? message.senderId : existing.participantId),
        name: existing.name || (isIncoming ? buildDisplayName(sender) : existing.name),
        role: existing.role || sender.role || 'User',
        imageUri: existing.imageUri || sender.profile?.avatar,
        message: preview,
        time,
        unread,
      };

      const next = [updated, ...state.chats.filter((_, index) => index !== existingIndex)];
      return { chats: next };
    });
  },

  markConversationRead: (conversationId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.conversationId === conversationId ? { ...chat, unread: 0 } : chat
      ),
    }));
  },

  updateConversationPreview: (conversationId, message) => {
    const preview = message ? previewForMessage(message) : 'No messages yet';
    const time = message ? formatTime(message.createdAt) : 'now';
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.conversationId === conversationId
          ? { ...chat, message: preview, time }
          : chat
      ),
    }));
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
  },

  clearActiveConversation: () => {
    set({ activeConversationId: null });
  },

  isActiveConversation: (conversationId) => {
    return get().activeConversationId === conversationId;
  },

  incrementUnread: (conversationId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.conversationId === conversationId
          ? { ...chat, unread: (chat.unread || 0) + 1 }
          : chat
      )
    }));
  },
  reset: () => {
    set({ chats: [], activeConversationId: null, isLoading: false });
  },
}));

