import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: any) => void;
  setAuthenticated: (status: boolean) => void;
  setLoading: (status: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setLoading: (status) => set({ isLoading: status }),
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
    } catch {}
    try {
      await SecureStore.deleteItemAsync('refreshToken');
    } catch {}
    
    // Completely wipe persistent chat storage to prevent cross-user data leakage
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('dalaal-chat-storage');
    } catch (e) {
      console.warn('Failed to clear chat storage:', e);
    }
    
    // Reset other stores
    const { useChatStore } = require('./chatStore');
    useChatStore.getState().reset();
    
    set({ user: null, isAuthenticated: false });
  },
}));
