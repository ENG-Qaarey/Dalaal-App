import { create } from 'zustand';
import { chatService } from '../services/chat';
import { socketService } from '../services/socket';

export type ChatListItem = {
  id: string;
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

type ChatStore = {
  chats: ChatListItem[];
  isLoading: boolean;
  fetchConversations: () => Promise<void>;
  startChatWithUser: (user: { id: string; name: string; role: string; online: boolean; imageUri?: string }) => Promise<ChatListItem>;
  addMessage: (conversationId: string, message: any) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  isLoading: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const conversations = await chatService.getConversations();
      const mappedChats: ChatListItem[] = conversations.map((conv: any) => {
        // Find the other participant
        // For simplicity, we assume there's only one other participant
        // In a real app, you'd have the current user ID to filter
        const otherParticipant = conv.participants[0]; // This is a placeholder logic
        const lastMessage = conv.messages[0];

        return {
          id: conv.id,
          conversationId: conv.id,
          name: otherParticipant?.user?.profile?.firstName || 'User',
          role: otherParticipant?.user?.role || 'User',
          message: lastMessage?.content || 'No messages yet',
          time: lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now',
          unread: 0,
          online: false,
          pinned: false,
          imageUri: otherParticipant?.user?.profile?.avatar,
        };
      });
      set({ chats: mappedChats });
    } catch (error) {
      // Handle error silently
    } finally {
      set({ isLoading: false });
    }
  },

  startChatWithUser: async (user) => {
    // Check if conversation already exists in state
    const existing = get().chats.find((c) => c.id === user.id || c.conversationId === user.id);
    if (existing) return existing;

    try {
      const conv = await chatService.createConversation(user.id);
      const newChat: ChatListItem = {
        id: conv.id,
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
      // Return a temporary mock chat if backend fails, but ideally handle error
      throw error;
    }
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      chats: state.chats.map((chat) => 
        chat.conversationId === conversationId 
          ? { 
              ...chat, 
              message: message.content, 
              time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            } 
          : chat
      )
    }));
  },
}));

