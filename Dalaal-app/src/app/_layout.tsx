import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../constants/theme';
import { FavoritesProvider } from '../context/favorites-context';
import { ThemeProvider, useAppTheme } from '../context/theme-context';
import { useAuthStore } from '../store/authStore';

// Ensure cold-start lands on onboarding (incl. Android)
export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <RootStack />
        </FavoritesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootStack() {
  const { scheme } = useAppTheme();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const statusStyle: 'auto' | 'inverted' | 'light' | 'dark' = scheme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isEmailVerified = user?.emailVerified;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to splash if not authenticated and trying to access protected routes
      router.replace('/splash');
    } else if (isAuthenticated) {
      // If authenticated but email not verified, force them to verification screen
      // except if they are already on the verify-email screen
      const isVerifyEmailScreen = segments[segments.length - 1] === 'verify-email';
      
      if (!isEmailVerified && !isVerifyEmailScreen) {
        router.replace({
          pathname: '/verify-email',
          params: { email: user?.email, type: 'register' }
        });
      } else if (isEmailVerified && inAuthGroup) {
        // Redirect to tabs if authenticated and verified and trying to access auth screens
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, user?.emailVerified, segments, isLoading]);

  return (
    <>
      <StatusBar style={statusStyle} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack>
    </>
  );
}

