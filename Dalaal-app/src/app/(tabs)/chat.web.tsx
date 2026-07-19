import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import OnboardingBackground from '../../components/common/OnboardingBackground';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import ChatComposer from '../../components/chat/ChatComposer';
import ConversationHeader from '../../components/chat/ConversationHeader';
import { useChatStore } from '../../store/chatStore';
import { chatService } from '../../services/chat';
import { useWebLayout } from '../../hooks/useWebLayout';

type FilterKey = 'all' | 'unread' | 'active';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'active', label: 'Active' },
];

export default function Chat() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const { isWideScreen } = useWebLayout();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const { chats, fetchConversations, isLoading } = useChatStore();

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [composerText, setComposerText] = useState('');

  const topUnreadChat = useMemo(() => chats.find((chat) => (chat.unread || 0) > 0) || null, [chats]);

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (chats || []).filter((chat) => {
      if (activeFilter === 'unread' && chat.unread === 0) return false;
      if (activeFilter === 'active' && !chat.online) return false;
      if (!q) return true;
      const hay = `${chat.name} ${chat.role} ${chat.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [activeFilter, query, chats]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    setLoadingMessages(true);
    chatService
      .getMessages(selectedChat.id, 1, 50)
      .then((msgs) => {
        setMessages(msgs || []);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [selectedChat?.id]);

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    if (!isWideScreen) {
      router.push({
        pathname: '/chat/[id]',
        params: {
          id: chat.id,
          name: chat.name,
          role: chat.role,
          online: chat.online ? '1' : '0',
          imageUri: chat.imageUri ?? '',
        },
      });
    }
  };

  if (isLoading && chats.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="chat" />
      </SafeAreaView>
    );
  }

  const chatListPanel = (
    <View style={[styles.listPanel, isWideScreen && styles.listPanelWide, { borderRightColor: C.brandBorder }]}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['left', 'right']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View>
            <Text style={[styles.title, { color: C.textMain }]}>Messages</Text>
            <Text style={[styles.subtitle, { color: C.textMuted }]}>Stay connected with your listings</Text>
          </View>
        </View>

        <View style={styles.listContent}>
          <View style={[styles.searchRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]} accessibilityRole="search">
            <Ionicons name="search" size={15} color={C.textMuted} style={{ marginRight: 7 }} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search chats..."
              placeholderTextColor={C.textMuted}
              style={[styles.searchInput, { color: C.textMain }]}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.85}>
                <Ionicons name="close" size={14} color={C.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => {
              const isActive = f.key === activeFilter;
              return (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.85}
                  onPress={() => setActiveFilter(f.key)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isActive ? C.brandBlue : C.tableRow,
                      borderColor: isActive ? C.brandBlueDark : C.brandBorder,
                    },
                  ]}
                >
                  <Text style={[styles.filterText, { color: isActive ? C.surface : C.textMain }]}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ChatList
            chats={filteredChats as any}
            colors={C}
            onPressChat={handleSelectChat}
            selectedId={selectedChat?.id}
          />
        </View>
      </SafeAreaView>
    </View>
  );

  const chatWindowPanel = (
    <View style={[styles.chatPanel, { backgroundColor: C.surface }]}>
      {selectedChat ? (
        <>
          <ConversationHeader
            userName={selectedChat.name}
            userRole={selectedChat.role}
            isOnline={selectedChat.online}
            userImageUri={selectedChat.imageUri}
            colors={C}
            onBack={() => setSelectedChat(null)}
            onAudioCall={() => {}}
            onVideoCall={() => {}}
          />
          <ChatWindow
            colors={C}
            messages={messages}
            autoScrollToBottom
          />
          <ChatComposer
            colors={C}
            value={composerText}
            onChangeText={setComposerText}
            onSend={() => {
              const text = composerText.trim();
              if (!text) return;
              chatService.sendMessage(selectedChat.id, { content: text }).then((msg) => {
                setMessages((prev) => [...prev, msg]);
                setComposerText('');
              });
            }}
            onAttach={() => {}}
            onCamera={() => {}}
            onVoiceHoldStart={() => {}}
            onVoiceHoldEnd={() => {}}
            onVoiceLock={() => {}}
            onVoiceLockedSend={() => {}}
            onVoiceLockedCancel={() => {}}
            onEditPendingImage={() => {}}
            onClearPendingAttachment={() => {}}
          />
        </>
      ) : (
        <View style={styles.emptyChatPanel}>
          <Ionicons name="chatbubbles-outline" size={64} color={C.textMuted} />
          <Text style={[styles.emptyTitle, { color: C.textMain }]}>Select a conversation</Text>
          <Text style={[styles.emptySubtitle, { color: C.textMuted }]}>Choose from your conversations on the left</Text>
        </View>
      )}
    </View>
  );

  if (isWideScreen) {
    return (
      <View style={[styles.splitContainer, { backgroundColor: C.surface }]}>
        {chatListPanel}
        {chatWindowPanel}
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View>
          <Text style={[styles.title, { color: C.textMain }]}>Messages</Text>
          <Text style={[styles.subtitle, { color: C.textMuted }]}>Stay connected with your listings</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.headerIcon, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
            onPress={() => router.push('/(tabs)/search' as any)}
          >
            <Ionicons name="create-outline" size={16} color={C.brandBlue} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.mobileContent, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]} accessibilityRole="search">
          <Ionicons name="search" size={15} color={C.textMuted} style={{ marginRight: 7 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search chats, names, or topics"
            placeholderTextColor={C.textMuted}
            style={[styles.searchInput, { color: C.textMain }]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.85}>
              <Ionicons name="close" size={12} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isActive = f.key === activeFilter;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(f.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? C.brandBlue : C.tableRow,
                    borderColor: isActive ? C.brandBlueDark : C.brandBorder,
                  },
                ]}
              >
                <Text style={[styles.filterText, { color: isActive ? C.surface : C.textMain }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ChatList
          chats={filteredChats as any}
          colors={C}
          onPressChat={handleSelectChat}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  listPanel: {
    flex: 1,
    borderRightWidth: 1,
  },
  listPanelWide: {
    maxWidth: 400,
    minWidth: 320,
  },
  chatPanel: {
    flex: 2,
  },
  header: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900' },
  subtitle: { marginTop: 3, fontSize: 10 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerIcon: {
    height: 32,
    width: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { flex: 1, paddingHorizontal: 12 },
  mobileContent: { paddingHorizontal: 12, paddingBottom: 20 },
  searchRow: {
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 12 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  filterText: { fontSize: 10, fontWeight: '800' },
  emptyChatPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800' },
  emptySubtitle: { fontSize: 13 },
});
