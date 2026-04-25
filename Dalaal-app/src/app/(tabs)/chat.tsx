import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import OnboardingBackground from '../../components/OnboardingBackground';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';
import ChatList from '../../components/chat/ChatList';

type FilterKey = 'all' | 'unread' | 'active';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'active', label: 'Active' },
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

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Recent chats</Text>
          <Text style={[styles.sectionHint, { color: C.textMuted }]}>{filteredChats.length} conversations</Text>
        </View>
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
});

