"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export type UserRole = "seeker" | "broker" | "admin"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; firstName: string; lastName: string; role: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isBroker: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USERS: Record<string, User & { password: string }> = {
  "admin@dalaal.com": {
    id: "1",
    email: "admin@dalaal.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    password: "admin123",
    avatar: "AU",
  },
  "broker@dalaal.com": {
    id: "2",
    email: "broker@dalaal.com",
    firstName: "Ahmed",
    lastName: "Farah",
    role: "broker",
    password: "broker123",
    avatar: "AF",
  },
  "user@dalaal.com": {
    id: "3",
    email: "user@dalaal.com",
    firstName: "Muscab",
    lastName: "Qaarey",
    role: "seeker",
    password: "user123",
    avatar: "MQ",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("dalaal_user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("dalaal_user")
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const mockUser = MOCK_USERS[email]
    if (!mockUser) {
      return { success: false, error: "Invalid email or password" }
    }
    if (mockUser.password !== password) {
      return { success: false, error: "Invalid email or password" }
    }
    const { password: _, ...userWithoutPassword } = mockUser
    setUser(userWithoutPassword)
    localStorage.setItem("dalaal_user", JSON.stringify(userWithoutPassword))
    return { success: true }
  }, [])

  const register = useCallback(async (data: { email: string; password: string; firstName: string; lastName: string; role: UserRole }) => {
    if (MOCK_USERS[data.email]) {
      return { success: false, error: "An account with this email already exists" };
    }
    const newUser: User = {
      id: String(Date.now()),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      avatar: `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase(),
    };
    MOCK_USERS[data.email] = { ...newUser, password: data.password };
    setUser(newUser);
    localStorage.setItem("dalaal_user", JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("dalaal_user")
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === "admin",
    isBroker: user?.role === "broker",
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}