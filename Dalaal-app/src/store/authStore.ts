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
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    set({ user: null, isAuthenticated: false });
  },
}));
