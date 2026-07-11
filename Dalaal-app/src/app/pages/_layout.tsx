import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="super-admin" />
      <Stack.Screen name="broker" />
      <Stack.Screen name="customer" />
      <Stack.Screen name="owner" />
      <Stack.Screen name="moderator" />
    </Stack>
  );
}
