import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "sa-1",
    name: "System Owner",
    email: "superadmin@sea.com",
    role: "SUPER_ADMIN",
    avatar: "SO",
  },
  setUser: (user) => set({ user }),
}));
