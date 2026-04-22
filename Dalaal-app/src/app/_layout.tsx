import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../constants/theme';

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
    <>
      <StatusBar style={statusStyle} />
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(auth)">
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack>
    </>
  );
}

