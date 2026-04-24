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
  const { isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const statusStyle: 'auto' | 'inverted' | 'light' | 'dark' = scheme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to splash if not authenticated and trying to access protected routes
      router.replace('/splash');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated and trying to access auth screens
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading]);

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

