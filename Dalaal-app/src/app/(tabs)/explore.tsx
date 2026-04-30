import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import { useChatStore } from '../../store/chatStore';
import { userService } from '../../services/users';
import { useAuthStore } from '../../store/authStore';

type User = {
  id: string;
  email?: string;
  username?: string;
  role: string;
  status?: string;
  lastLoginAt?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
};

export default function ExploreTab() {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);
  loadingMoreRef.current = loadingMore;
  const usersRef = useRef(users);
  usersRef.current = users;
  const startChatWithUser = useChatStore((s) => s.startChatWithUser);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const fetchUsers = useCallback(async (loadMore: boolean = false) => {
    const currentPage = loadMore ? page + 1 : 1;
    
    if (loadMore) {
      if (loadingMoreRef.current || !hasMore) return;
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await userService.searchUsers(query, currentPage, 20);
      const newUsers = Array.isArray(response) ? response : (response.data || []);
      const filteredUsers = currentUserId
        ? newUsers.filter((item: User) => item.id !== currentUserId)
        : newUsers;
      
      const combinedUsers = loadMore
        ? [...usersRef.current, ...filteredUsers]
        : filteredUsers;
      
      // Ensure unique IDs to prevent key errors
      const finalUsers = Array.from(new Map(combinedUsers.map(u => [u.id, u])).values());
      
      setUsers(finalUsers);
      setHasMore(newUsers.length === 20);
      setPage(currentPage);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, page, hasMore, currentUserId]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchUsers(false);
  }, [query]);

  const getDisplayName = (user: User) => {
    if (user.username) return `@${user.username}`;
    const firstName = user.profile?.firstName || '';
    const lastName = user.profile?.lastName || '';
    const name = `${firstName} ${lastName}`.trim();
    return name || user.email || 'User';
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={[styles.title, { color: C.textMain }]}>Explore People</Text>
        <Text style={[styles.subtitle, { color: C.textMuted }]}>Search and start a chat quickly</Text>
      </View>

      <View style={[styles.searchRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
        <Ionicons name="search" size={15} color={C.textMuted} style={{ marginRight: 7 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by username, name or email"
          placeholderTextColor={C.textMuted}
          style={[styles.searchInput, { color: C.textMain }]}
        />
        {loading && <ActivityIndicator size="small" color={C.brandBlue} />}
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 + insets.bottom, gap: 8 }}
        onEndReached={() => hasMore && !loadingMore && fetchUsers(true)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 10 }} /> : null}
        ListEmptyComponent={
          !loading ? (
            <View style={[styles.emptyBox, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <Ionicons name="search-outline" size={18} color={C.textMuted} />
              <Text style={[styles.emptyTitle, { color: C.textMain }]}>Not found</Text>
              <Text style={[styles.emptyText, { color: C.textMuted }]}>No user matches "{query.trim()}".</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const name = getDisplayName(item);
          const isOnline = !!item.lastLoginAt && (new Date().getTime() - new Date(item.lastLoginAt).getTime() < 10 * 60 * 1000);

          return (
            <View style={[styles.userCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
              <View style={[styles.avatar, { backgroundColor: C.tableRow }]}>
                <Text style={[styles.avatarText, { color: C.textMain }]}>{name.slice(0, 1).toUpperCase()}</Text>
                <View style={[styles.onlineDot, { backgroundColor: isOnline ? C.brandOrange : C.textMuted }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: C.textMain }]} numberOfLines={1}>
                  {name}
                </Text>
                <Text style={[styles.role, { color: C.textMuted }]}>{item.role}</Text>
              </View>
              <TouchableOpacity
                style={[styles.chatBtn, { backgroundColor: C.brandBlue }]}
                onPress={async () => {
                  const chatUser = {
                    id: item.id,
                    name: name,
                    role: item.role,
                    online: isOnline,
                    imageUri: item.profile?.avatar,
                  };
                  try {
                    const chat = await startChatWithUser(chatUser);
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
                  } catch (error: any) {
                    Alert.alert('Chat error', error?.message || 'Unable to start chat.');
                  }
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={14} color={C.surface} />
                <Text style={[styles.chatBtnText, { color: C.surface }]}>Chat</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 14, paddingBottom: 10 },
  title: { fontSize: 18, fontWeight: '900' },
  subtitle: { marginTop: 3, fontSize: 11 },
  searchRow: {
    marginHorizontal: 12,
    marginBottom: 10,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, fontSize: 12 },
  userCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '900' },
  onlineDot: { position: 'absolute', right: 5, top: 5, width: 8, height: 8, borderRadius: 99 },
  name: { fontSize: 13, fontWeight: '900' },
  role: { marginTop: 2, fontSize: 10, fontWeight: '700' },
  chatBtn: {
    borderRadius: 10,
    height: 34,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chatBtnText: { fontSize: 11, fontWeight: '800' },
  emptyBox: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyTitle: { fontSize: 13, fontWeight: '900' },
  emptyText: { fontSize: 10, fontWeight: '700' },
});

