import { api } from './api';
import * as SecureStore from 'expo-secure-store';

async function persistTokens(tokens: { accessToken?: string; refreshToken?: string }) {
  if (tokens.accessToken) {
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
  }

  if (tokens.refreshToken) {
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
  }
}

export const authService = {
  async storeTokens(tokens: { accessToken?: string; refreshToken?: string }) {
    await persistTokens(tokens);
  },

  async login(loginData: any) {
    const response = await api.post('/auth/login', loginData);
    await persistTokens(response.data);
    return response.data;
  },

  async register(registerData: any) {
    const response = await api.post('/auth/register', registerData);
    await persistTokens(response.data);
    return response.data;
  },

  async resendVerification(email: string) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  async sendOtp(email: string) {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  async verifyOtp(email: string, code: string) {
    const response = await api.post('/auth/verify-otp', { email, code });
    if (response.data.accessToken) {
      await persistTokens(response.data);
    }
    return response.data;
  },

  async verifyPhone(phone: string, firebaseToken: string) {
    const response = await api.post('/auth/verify-phone', { phone, firebaseToken });
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(resetData: any) {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Backwards compatibility for the existing empty export if needed
export async function login(loginData: any) {
  return authService.login(loginData);
}
