import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../constants/theme';
import { FavoritesProvider } from '../context/favorites-context';

// Ensure cold-start lands on onboarding (incl. Android)
export const unstable_settings = {
  initialRouteName: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const surface = Colors[colorScheme ?? 'light']?.surface ?? '';
  const surfaceLower = String(surface).toLowerCase();
  const statusStyle: 'auto' | 'inverted' | 'light' | 'dark' =
    surfaceLower === '#ffffff' || surfaceLower === 'white' ? 'dark' : 'light';

  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <StatusBar style={statusStyle} />
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" />
        </Stack>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}

