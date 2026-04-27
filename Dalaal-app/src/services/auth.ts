import { api } from './api';
import * as SecureStore from 'expo-secure-store';

function unwrapResponse<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T;
  }
  return payload as T;
}

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
    try {
      const response = await api.post('auth/login', loginData);
      const data = unwrapResponse<any>(response.data);
      await persistTokens(data);
      return data;
    } catch (error: any) {
      let message = 'Login failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      const err = new Error(message);
      err.response = error.response;
      throw err;
    }
  },

  async register(registerData: any) {
    const response = await api.post('auth/register', registerData);
    const data = unwrapResponse<any>(response.data);
    await persistTokens(data);
    return data;
  },

  async resendVerification(email: string) {
    const response = await api.post('auth/resend-verification', { email });
    return unwrapResponse<any>(response.data);
  },

  async sendOtp(email: string) {
    const response = await api.post('auth/send-otp', { email });
    return unwrapResponse<any>(response.data);
  },

  async verifyEmail(email: string, code: string) {
    const response = await api.post('auth/verify-email', { email, code });
    return unwrapResponse<any>(response.data);
  },

  async verifyPhone(phone: string, firebaseToken: string) {
    const response = await api.post('auth/verify-phone', { phone, firebaseToken });
    return unwrapResponse<any>(response.data);
  },

  async logout() {
    try {
      await api.post('auth/logout');
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    }
  },

  async forgotPassword(email: string) {
    const response = await api.post('auth/forgot-password', { email });
    return unwrapResponse<any>(response.data);
  },

  async resetPassword(resetData: any) {
    const response = await api.post('auth/reset-password', resetData);
    return unwrapResponse<any>(response.data);
  },

  async getCurrentUser() {
    const response = await api.get('users/profile');
    return unwrapResponse<any>(response.data);
  },

  async updateProfile(profileData: Record<string, any>) {
    const response = await api.put('users/profile', profileData);
    return unwrapResponse<any>(response.data);
  },

  async uploadProfileImage(imageUri: string) {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match?.[1]?.toLowerCase() || 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: mimeType,
    } as any);

    const uploadResponse = await api.post('uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const uploadResult = unwrapResponse<any>(uploadResponse.data);
    const avatarUrl = uploadResult?.url;

    if (!avatarUrl) {
      throw new Error('Image upload failed');
    }

    const profileResponse = await api.put('users/profile', { avatar: avatarUrl });
    return unwrapResponse<any>(profileResponse.data);
  },
};

export async function login(loginData: any) {
  return authService.login(loginData);
}