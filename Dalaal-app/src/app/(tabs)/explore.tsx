import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import { useChatStore } from '../../store/chatStore';

type User = {
  id: string;
  name: string;
  role: string;
  online: boolean;
  imageUri?: string;
};

const PEOPLE: User[] = [
  { id: 'u101', name: 'Abdi Jama', role: 'Broker', online: true, imageUri: 'https://i.pravatar.cc/120?img=33' },
  { id: 'u102', name: 'Muna Ali', role: 'Owner', online: false, imageUri: 'https://i.pravatar.cc/120?img=45' },
  { id: 'u103', name: 'Hassan Nur', role: 'Dealer', online: true, imageUri: 'https://i.pravatar.cc/120?img=18' },
  { id: 'u104', name: 'Asha Warsame', role: 'Agent', online: true, imageUri: 'https://i.pravatar.cc/120?img=54' },
  { id: 'u105', name: 'Yusuf Mohamud', role: 'Broker', online: false, imageUri: 'https://i.pravatar.cc/120?img=29' },
];

export default function ExploreTab() {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const startChatWithUser = useChatStore((s) => s.startChatWithUser);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PEOPLE;
    return PEOPLE.filter((p) => `${p.name} ${p.role}`.toLowerCase().includes(q));
  }, [query]);

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
          placeholder="Search someone to chat"
          placeholderTextColor={C.textMuted}
          style={[styles.searchInput, { color: C.textMain }]}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 + insets.bottom, gap: 8 }}
        ListEmptyComponent={
          <View style={[styles.emptyBox, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
            <Ionicons name="search-outline" size={18} color={C.textMuted} />
            <Text style={[styles.emptyTitle, { color: C.textMain }]}>Not found</Text>
            <Text style={[styles.emptyText, { color: C.textMuted }]}>No user matches "{query.trim()}".</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.userCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
            <View style={[styles.avatar, { backgroundColor: C.tableRow }]}>
              <Text style={[styles.avatarText, { color: C.textMain }]}>{item.name.slice(0, 1).toUpperCase()}</Text>
              <View style={[styles.onlineDot, { backgroundColor: item.online ? C.brandOrange : C.textMuted }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: C.textMain }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.role, { color: C.textMuted }]}>{item.role}</Text>
            </View>
            <TouchableOpacity
              style={[styles.chatBtn, { backgroundColor: C.brandBlue }]}
              onPress={() => {
                const chat = startChatWithUser(item);
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
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={14} color={C.surface} />
              <Text style={[styles.chatBtnText, { color: C.surface }]}>Chat</Text>
            </TouchableOpacity>
          </View>
        )}
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

