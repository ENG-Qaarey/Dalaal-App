export interface User {
  id: string;
  email: string;
  phone?: string;
  username?: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  city?: string;
  country?: string;
  language?: string;
  currency?: string;
  whatsappNumber?: string;
  telegramHandle?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  city?: string;
  country?: string;
  language?: string;
  currency?: string;
  whatsappNumber?: string;
  telegramHandle?: string;
}
