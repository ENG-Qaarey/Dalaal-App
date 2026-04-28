import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import OnboardingBackground from '../../components/OnboardingBackground';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';
import ChatList from '../../components/chat/ChatList';
import { useChatStore } from '../../store/chatStore';

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
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const { chats, fetchConversations, isLoading } = useChatStore();

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

  if (isLoading && chats.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="chat" />
      </SafeAreaView>
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
            onPress={() => router.push('/explore')}
          >
            <Ionicons name="create-outline" size={16} color={C.brandBlue} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.headerIcon, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
          >
            <Ionicons name="notifications-outline" size={16} color={C.textMain} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
          accessibilityRole="search"
        >
          <Ionicons name="search" size={15} color={C.textMuted} style={{ marginRight: 7 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search chats, names, or topics"
            placeholderTextColor={C.textMuted}
            style={[styles.searchInput, { color: C.textMain }]}
          />
          {query.length > 0 ? (
            <TouchableOpacity
              onPress={() => setQuery('')}
              activeOpacity={0.85}
              style={[styles.clearBtn, { backgroundColor: C.brandBorder }]}
            >
              <Ionicons name="close" size={12} color={C.textMain} />
            </TouchableOpacity>
          ) : (
            <View style={styles.clearBtn} />
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

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Recent chats</Text>
          <Text style={[styles.sectionHint, { color: C.textMuted }]}>{filteredChats.length} conversations</Text>
        </View>
        {topUnreadChat ? (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.notificationCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}
            onPress={() =>
              router.push({
                pathname: '/chat/[id]',
                params: {
                  id: topUnreadChat.id,
                  name: topUnreadChat.name,
                  role: topUnreadChat.role,
                  online: topUnreadChat.online ? '1' : '0',
                  imageUri: topUnreadChat.imageUri ?? '',
                },
              })
            }
          >
            {topUnreadChat.imageUri ? (
              <Image source={{ uri: topUnreadChat.imageUri }} style={styles.notificationAvatar} />
            ) : (
              <View style={[styles.notificationAvatar, { backgroundColor: C.tableRow }]}>
                <Text style={[styles.notificationAvatarText, { color: C.textMain }]}>
                  {topUnreadChat.name.slice(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.notificationBody}>
              <View style={styles.notificationTopRow}>
                <Text style={[styles.notificationName, { color: C.textMain }]} numberOfLines={1}>
                  {topUnreadChat.name}
                </Text>
                <Text style={[styles.notificationTime, { color: C.textMuted }]}>now</Text>
              </View>
              <Text style={[styles.notificationMessage, { color: C.textMuted }]} numberOfLines={1}>
                {topUnreadChat.message}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        <ChatList
          chats={filteredChats as any}
          colors={C}
          onPressChat={(chat) =>
            router.push({
              pathname: '/chat/[id]',
              params: {
                id: chat.id,
                name: chat.name,
                role: chat.role,
                online: chat.online ? '1' : '0',
                imageUri: chat.imageUri ?? '',
              },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
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
  content: { paddingHorizontal: 12, paddingBottom: 20 },
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
  clearBtn: { height: 22, width: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  filterText: { fontSize: 10, fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: '900' },
  sectionHint: { fontSize: 10 },
  notificationCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationAvatar: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  notificationAvatarText: { fontSize: 14, fontWeight: '900' },
  notificationBody: { flex: 1 },
  notificationTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notificationName: { fontSize: 20, fontWeight: '900', maxWidth: '80%' },
  notificationTime: { fontSize: 12, fontWeight: '700' },
  notificationMessage: { marginTop: 2, fontSize: 14, fontWeight: '600' },
});

