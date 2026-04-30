import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../constants/theme';
import { FavoritesProvider } from '../context/favorites-context';
import { ThemeProvider, useAppTheme } from '../context/theme-context';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { socketService } from '../services/socket';
import { chatService } from '../services/chat';

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
  const lastNotificationIdRef = useRef<string | null>(null);
  const statusStyle: 'auto' | 'inverted' | 'light' | 'dark' = scheme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isEmailVerified = user?.emailVerified;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and trying to access protected routes
      router.replace('/(auth)/login');
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

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      socketService.disconnect();
      return;
    }

    const handleNewMessage = (message: any) => {
      useChatStore.getState().applyIncomingMessage(message);

      const isIncoming = message.senderId && message.senderId !== user.id;
      const isActive = useChatStore.getState().isActiveConversation(message.conversationId);
      if (!isIncoming || isActive) return;

      if (lastNotificationIdRef.current === message.id) return;
      lastNotificationIdRef.current = message.id;

      const chats = useChatStore.getState().chats;
      const chat = chats.find((c) => c.conversationId === message.conversationId);
      const senderName = chat?.name || message?.sender?.profile?.firstName || message?.sender?.username || 'New message';
      const preview = message?.content || (message?.mediaUrl ? 'Photo' : 'New message');

      Alert.alert(
        'New message',
        `${senderName}: ${preview}`,
        [
          {
            text: 'Open',
            onPress: () => {
              router.push({
                pathname: '/chat/[id]',
                params: {
                  id: message.conversationId,
                  name: chat?.name || senderName,
                  role: chat?.role || message?.sender?.role || 'User',
                  online: '0',
                  imageUri: chat?.imageUri || message?.sender?.profile?.avatar || '',
                },
              });
            },
          },
          { text: 'Dismiss', style: 'cancel' },
        ]
      );
    };

    const handleMessageDeleted = async (data: { messageId: string; conversationId: string }) => {
      if (!data.conversationId) return;
      if (useChatStore.getState().isActiveConversation(data.conversationId)) return;
      try {
        const latest = await chatService.getMessages(data.conversationId, 1, 1);
        useChatStore.getState().updateConversationPreview(data.conversationId, latest?.[0]);
      } catch {
        // ignore refresh errors
      }
    };

    const setup = async () => {
      await socketService.connect(user.id);
    };

    setup();
    socketService.onNewMessage(handleNewMessage);
    socketService.onMessageDeleted(handleMessageDeleted);

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.offMessageDeleted(handleMessageDeleted);
    };
  }, [isAuthenticated, user?.id, router]);

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

