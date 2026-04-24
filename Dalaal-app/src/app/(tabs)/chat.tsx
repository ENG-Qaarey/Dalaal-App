import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import OnboardingBackground from '../../components/OnboardingBackground';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

type FilterKey = 'all' | 'unread' | 'active';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'active', label: 'Active' },
];

const ACTIVE_USERS = [
  { id: 'a1', name: 'Ahmed', role: 'Broker' },
  { id: 'a2', name: 'Fatima', role: 'Owner' },
  { id: 'a3', name: 'Omar', role: 'Dealer' },
  { id: 'a4', name: 'Amina', role: 'Agent' },
  { id: 'a5', name: 'Hassan', role: 'Broker' },
];

const CHATS = [
  {
    id: 'c1',
    name: 'Ahmed Ali',
    role: 'Broker',
    message: 'I can show you the Hodan villa today. Would 6pm work?',
    time: '2m',
    unread: 2,
    online: true,
    pinned: true,
  },
  {
    id: 'c2',
    name: 'Fatima Noor',
    role: 'Owner',
    message: 'Here is the updated floor plan and pricing options.',
    time: '18m',
    unread: 0,
    online: true,
    pinned: false,
  },
  {
    id: 'c3',
    name: 'Dalaal Support',
    role: 'Support',
    message: 'Your verification is approved. Want to list today?',
    time: '1h',
    unread: 1,
    online: false,
    pinned: false,
  },
  {
    id: 'c4',
    name: 'Omar Yusuf',
    role: 'Dealer',
    message: 'The Land Cruiser has a new price and warranty.',
    time: '3h',
    unread: 0,
    online: false,
    pinned: false,
  },
  {
    id: 'c5',
    name: 'Amina Salim',
    role: 'Agent',
    message: 'Shared 5 new listings near Waberi.',
    time: 'Yesterday',
    unread: 0,
    online: true,
    pinned: false,
  },
];

const quickActions = [
  { id: 'qa1', label: 'New chat', icon: 'create-outline' },
  { id: 'qa2', label: 'Support', icon: 'help-buoy-outline' },
  { id: 'qa3', label: 'Offers', icon: 'sparkles-outline' },
];

const initialsFor = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

export default function Chat() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredChats = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHATS.filter((chat) => {
      if (activeFilter === 'unread' && chat.unread === 0) return false;
      if (activeFilter === 'active' && !chat.online) return false;
      if (!q) return true;
      const hay = `${chat.name} ${chat.role} ${chat.message}`.toLowerCase();
      return hay.includes(q);
    });
  }, [activeFilter, query]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
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
            onPress={() => router.push('/chat/new-chat')}
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

        <View style={styles.quickRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.85}
              style={[styles.quickCard, { backgroundColor: C.surface, borderColor: C.brandBorder, shadowColor: C.textMain }]}
              onPress={() => router.push('/chat/new-chat')}
            >
              <View style={[styles.quickIcon, { backgroundColor: C.brandBlueSoft }]}>
                <Ionicons name={action.icon as any} size={16} color={C.brandBlue} />
              </View>
              <Text style={[styles.quickLabel, { color: C.textMain }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Active now</Text>
          <Text style={[styles.sectionHint, { color: C.textMuted }]}>5 online</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeRow}>
          {ACTIVE_USERS.map((user, index) => (
            <View
              key={user.id}
              style={[styles.activeCard, { backgroundColor: C.surface, borderColor: C.brandBorder, shadowColor: C.textMain }]}
            >
              <View
                style={[
                  styles.activeAvatar,
                  { backgroundColor: index % 2 === 0 ? C.brandBlueSoft : C.brandBorder },
                ]}
              >
                <Text style={[styles.activeInitials, { color: C.textMain }]}>{initialsFor(user.name)}</Text>
              </View>
              <Text style={[styles.activeName, { color: C.textMain }]} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={[styles.activeRole, { color: C.textMuted }]} numberOfLines={1}>
                {user.role}
              </Text>
              <View style={[styles.activeDot, { backgroundColor: C.brandOrange }]} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Recent chats</Text>
          <Text style={[styles.sectionHint, { color: C.textMuted }]}>{filteredChats.length} conversations</Text>
        </View>

        <View style={styles.chatList}>
          {filteredChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              activeOpacity={0.9}
              onPress={() => router.push('/chat/new-chat')}
              style={[styles.chatCard, { backgroundColor: C.surface, borderColor: C.brandBorder, shadowColor: C.textMain }]}
            >
              <View style={styles.chatLeft}>
                <View style={[styles.chatAvatar, { backgroundColor: C.tableRow }]}>
                  <Text style={[styles.chatInitials, { color: C.textMain }]}>{initialsFor(chat.name)}</Text>
                  {chat.online ? <View style={[styles.onlineDot, { backgroundColor: C.brandOrange }]} /> : null}
                </View>
              </View>
              <View style={styles.chatBody}>
                <View style={styles.chatTopRow}>
                  <View style={styles.chatTitleRow}>
                    <Text style={[styles.chatName, { color: C.textMain }]} numberOfLines={1}>
                      {chat.name}
                    </Text>
                    {chat.pinned ? (
                      <Ionicons name="star" size={12} color={C.brandOrange} style={{ marginLeft: 6 }} />
                    ) : null}
                  </View>
                  <Text style={[styles.chatTime, { color: C.textMuted }]}>{chat.time}</Text>
                </View>
                <Text style={[styles.chatRole, { color: C.textMuted }]} numberOfLines={1}>
                  {chat.role}
                </Text>
                <Text style={[styles.chatMessage, { color: C.textMain }]} numberOfLines={1}>
                  {chat.message}
                </Text>
              </View>
              <View style={styles.chatMeta}>
                {chat.unread > 0 ? (
                  <View style={[styles.unreadBadge, { backgroundColor: C.brandBlue }]}>
                    <Text style={[styles.unreadText, { color: C.surface }]}>{chat.unread}</Text>
                  </View>
                ) : (
                  <Ionicons name="checkmark-done" size={14} color={C.textMuted} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.fab, { backgroundColor: C.brandBlue, bottom: 22 + insets.bottom }]}
        onPress={() => router.push('/chat/new-chat')}
      >
        <Ionicons name="add" size={20} color={C.surface} />
      </TouchableOpacity>
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
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  quickCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowOpacity: 0.08,
    elevation: 2,
  },
  quickIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: { fontSize: 10, fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: '900' },
  sectionHint: { fontSize: 10 },
  activeRow: { paddingBottom: 4 },
  activeCard: {
    width: 110,
    marginRight: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    shadowOpacity: 0.06,
    elevation: 2,
  },
  activeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeInitials: { fontSize: 14, fontWeight: '900' },
  activeName: { fontSize: 11, fontWeight: '800' },
  activeRole: { marginTop: 2, fontSize: 9 },
  activeDot: { position: 'absolute', right: 10, top: 10, width: 8, height: 8, borderRadius: 999 },
  chatList: { gap: 10, marginBottom: 10 },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    shadowOpacity: 0.06,
    elevation: 2,
  },
  chatLeft: { marginRight: 10 },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInitials: { fontSize: 14, fontWeight: '900' },
  onlineDot: { position: 'absolute', right: 6, top: 6, width: 8, height: 8, borderRadius: 999 },
  chatBody: { flex: 1 },
  chatTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatTitleRow: { flexDirection: 'row', alignItems: 'center', maxWidth: '75%' },
  chatName: { fontSize: 12, fontWeight: '900' },
  chatTime: { fontSize: 9 },
  chatRole: { marginTop: 2, fontSize: 9 },
  chatMessage: { marginTop: 4, fontSize: 10, fontWeight: '700' },
  chatMeta: { marginLeft: 8, alignItems: 'center' },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { fontSize: 10, fontWeight: '900' },
  fab: {
    position: 'absolute',
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.25,
    elevation: 6,
  },
});

