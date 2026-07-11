"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api";

interface User {
  id: string;
  email: string;
  username?: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  status: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    username?: string;
    phone?: string;
    email: string;
    password: string;
  }) => Promise<{ user: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        return;
      }
      const userData = await authService.getProfile();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");
      if (stored && token) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else if (token && !stored) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(
    async (identifier: string, password: string) => {
      const result = await authService.login(identifier, password);
      if (result.user) {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
      }
    },
    []
  );

  const register = useCallback(
    async (data: {
      fullName: string;
      username?: string;
      phone?: string;
      email: string;
      password: string;
    }) => {
      const result = await authService.register(data);
      if (result.user) {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
      }
      return result;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore backend errors
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "refreshToken=; path=/; max-age=0";
    }
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
