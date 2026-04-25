import { create } from 'zustand';

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
};

type ChatStore = {
  chats: ChatListItem[];
  startChatWithUser: (user: { id: string; name: string; role: string; online: boolean; imageUri?: string }) => ChatListItem;
};

const INITIAL_CHATS: ChatListItem[] = [
  {
    id: 'c1',
    name: 'Ahmed Ali',
    role: 'Broker',
    message: 'I can show you the Hodan villa today. Would 6pm work?',
    time: '2m',
    unread: 2,
    online: true,
    pinned: true,
  },
  {
    id: 'c2',
    name: 'Fatima Noor',
    role: 'Owner',
    message: 'Here is the updated floor plan and pricing options.',
    time: '18m',
    unread: 0,
    online: true,
    pinned: false,
  },
  {
    id: 'c3',
    name: 'Dalaal Support',
    role: 'Support',
    message: 'Your verification is approved. Want to list today?',
    time: '1h',
    unread: 1,
    online: false,
    pinned: false,
  },
  {
    id: 'c4',
    name: 'Omar Yusuf',
    role: 'Dealer',
    message: 'The Land Cruiser has a new price and warranty.',
    time: '3h',
    unread: 0,
    online: false,
    pinned: false,
  },
  {
    id: 'c5',
    name: 'Amina Salim',
    role: 'Agent',
    message: 'Shared 5 new listings near Waberi.',
    time: 'Yesterday',
    unread: 0,
    online: true,
    pinned: false,
  },
];

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: INITIAL_CHATS,
  startChatWithUser: (user) => {
    const existing = get().chats.find((c) => c.id === user.id);
    if (existing) {
      set((state) => ({
        chats: [
          { ...existing, online: user.online, imageUri: user.imageUri ?? existing.imageUri, time: 'now' },
          ...state.chats.filter((c) => c.id !== user.id),
        ],
      }));
      return { ...existing, online: user.online, imageUri: user.imageUri ?? existing.imageUri, time: 'now' };
    }

    const created: ChatListItem = {
      id: user.id,
      name: user.name,
      role: user.role,
      message: 'Tap to start chatting',
      time: 'now',
      unread: 0,
      online: user.online,
      pinned: false,
      imageUri: user.imageUri,
    };
    set((state) => ({ chats: [created, ...state.chats] }));
    return created;
  },
}));

