import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';
import { getItemAsync } from '../utils/storage';

export default function useAuth() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    setUser, 
    setAuthenticated, 
    setLoading,
    logout: storeLogout 
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getItemAsync('accessToken');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setAuthenticated(true);
      }
    } catch (error) {
      await storeLogout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginData: any) => {
    setLoading(true);
    try {
      const data = await authService.login(loginData);
      setUser(data.user);
      setAuthenticated(true);
      return data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: any) => {
    setLoading(true);
    try {
      console.log('[useAuth] Registering user:', registerData.email);
      const data = await authService.register(registerData);
      // We don't setAuthenticated(true) here because we need to verify email first
      setUser(data.user);
      console.log('[useAuth] Register success, user set, awaiting verification');
      return data;
    } catch (error: any) {
      console.log('[useAuth] Register error:', error.message);
      const message = error?.response?.data?.message || error?.message || 'Registration failed';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    setLoading(true);
    try {
      return await authService.sendOtp(email);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    setLoading(true);
    try {
      return await authService.resendVerification(email);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    setLoading(true);
    try {
      const data = await authService.verifyEmail(email, code);
      if (data.user) {
        setUser(data.user);
      }
      setAuthenticated(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    setLoading(true);
    try {
      const data = await authService.verifyOtp(email, code);
      setUser(data.user);
      setAuthenticated(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async (phone: string, firebaseToken: string) => {
    setLoading(true);
    try {
      const result = await authService.verifyPhone(phone, firebaseToken);
      // After verification, we might want to refresh user profile
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } finally {
      await storeLogout();
      setLoading(false);
    }
  };

    return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    sendOtp,
    resendVerification,
    verifyEmail,
    verifyOtp,
    verifyPhone,
    logout,
    checkAuth,
  };
}
