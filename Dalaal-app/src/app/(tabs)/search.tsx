import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

type SearchItem = {
  id: string;
  type: 'property' | 'vehicle';
  title: string;
  location: string;
  price: string;
  category: string;
  posterName?: string;
  posterRole?: string;
  posterPhone?: string;
  posterEmail?: string;
  posterVerified?: boolean;
  posterRating?: string;
};

const ITEMS: SearchItem[] = [
  {
    id: 'p1',
    type: 'property',
    title: 'Modern Villa',
    location: 'Hodan',
    price: '$150,000',
    category: 'houses',
    posterName: 'Ahmed',
    posterRole: 'Broker',
    posterPhone: '+252 61 000 0000',
    posterEmail: 'ahmed@dalaal.so',
    posterVerified: true,
    posterRating: '4.9',
  },
  {
    id: 'p2',
    type: 'property',
    title: '3BR Apartment',
    location: 'Waberi',
    price: '$85,000',
    category: 'apts',
    posterName: 'Fatima',
    posterRole: 'Owner',
    posterPhone: '+252 61 111 1111',
    posterEmail: 'fatima@dalaal.so',
    posterVerified: false,
    posterRating: '4.7',
  },
  {
    id: 'p3',
    type: 'property',
    title: 'Prime Land Plot',
    location: 'Yaqshid',
    price: '$80,000',
    category: 'land',
    posterName: 'Omar',
    posterRole: 'Broker',
    posterPhone: '+252 61 222 2222',
    posterEmail: 'omar@dalaal.so',
    posterVerified: true,
    posterRating: '4.8',
  },
  {
    id: 'v1',
    type: 'vehicle',
    title: 'Toyota Land Cruiser',
    location: 'Waberi',
    price: '$35,000',
    category: 'cars',
    posterName: 'Ali',
    posterRole: 'Dealer',
    posterPhone: '+252 61 333 3333',
    posterEmail: 'ali@dalaal.so',
    posterVerified: true,
    posterRating: '4.8',
  },
  {
    id: 'v2',
    type: 'vehicle',
    title: 'Hilux Pickup',
    location: 'Hodan',
    price: '$28,000',
    category: 'vehi',
    posterName: 'Amina',
    posterRole: 'Dealer',
    posterPhone: '+252 61 444 4444',
    posterEmail: 'amina@dalaal.so',
    posterVerified: false,
    posterRating: '4.6',
  },
  {
    id: 'p4',
    type: 'property',
    title: 'Family House',
    location: 'Hamarweyne',
    price: '$110,000',
    category: 'houses',
    posterName: 'Hassan',
    posterRole: 'Broker',
    posterPhone: '+252 61 555 5555',
    posterEmail: 'hassan@dalaal.so',
    posterVerified: true,
    posterRating: '4.9',
  },
  {
    id: 'p5',
    type: 'property',
    title: 'City Apartment',
    location: 'Banaadir',
    price: '$92,000',
    category: 'apts',
    posterName: 'Muna',
    posterRole: 'Owner',
    posterPhone: '+252 61 666 6666',
    posterEmail: 'muna@dalaal.so',
    posterVerified: false,
    posterRating: '4.5',
  },
  {
    id: 'v3',
    type: 'vehicle',
    title: 'Toyota Prado',
    location: 'Hodan',
    price: '$48,000',
    category: 'cars',
    posterName: 'Yusuf',
    posterRole: 'Dealer',
    posterPhone: '+252 61 777 7777',
    posterEmail: 'yusuf@dalaal.so',
    posterVerified: true,
    posterRating: '4.8',
  },
  {
    id: 'v4',
    type: 'vehicle',
    title: 'Corolla',
    location: 'Waberi',
    price: '$18,500',
    category: 'cars',
    posterName: 'Sahra',
    posterRole: 'Dealer',
    posterPhone: '+252 61 888 8888',
    posterEmail: 'sahra@dalaal.so',
    posterVerified: false,
    posterRating: '4.4',
  },
  {
    id: 'v5',
    type: 'vehicle',
    title: 'Hilux Double Cab',
    location: 'Yaqshid',
    price: '$32,000',
    category: 'vehi',
    posterName: 'Khadar',
    posterRole: 'Dealer',
    posterPhone: '+252 61 999 9999',
    posterEmail: 'khadar@dalaal.so',
    posterVerified: true,
    posterRating: '4.7',
  },
];

const PAGE_SIZE = 4;

export default function Search() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [query, setQuery] = useState(params.q ?? '');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cat = (params.category ?? '').trim();

    return ITEMS.filter((it) => {
      if (cat && it.category !== cat) return false;
      if (!q) return true;
      const hay = `${it.title} ${it.location} ${it.posterName ?? ''} ${it.posterRole ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [params.category, query]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
  }, [query, params.category]);

  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const loadMore = () => {
    if (isLoadingMore || visibleCount >= filtered.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((current) => Math.min(current + PAGE_SIZE, filtered.length));
      setIsLoadingMore(false);
    }, 650);
  };

  const openItem = (it: SearchItem) => {
    router.push({
      pathname: '/listings-detail',
      params: {
        id: it.id,
        type: it.type,
        title: it.title,
        location: it.location,
        price: it.price,
        category: it.category,
        posterName: it.posterName ?? '',
        posterRole: it.posterRole ?? '',
        posterPhone: it.posterPhone ?? '',
        posterEmail: it.posterEmail ?? '',
        posterVerified: it.posterVerified ? '1' : '0',
        posterRating: it.posterRating ?? '',
      },
    });
  };

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="list" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.brandDot, { backgroundColor: C.brandOrange }]} />
            <Text style={[styles.title, { color: C.textMain }]}>Search</Text>
          </View>
          <View style={[styles.countPill, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
            <Text style={[styles.countText, { color: C.textMuted }]}>{filtered.length}</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: C.textMuted }]}> {params.category ? `Browsing: ${params.category}` : 'Find listings fast'} </Text>
      </View>

      <View style={[styles.searchRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
        <Ionicons name="search" size={15} color={C.textMuted} style={{ marginRight: 7 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by title or location"
          placeholderTextColor={C.textMuted}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          style={[styles.searchInput, { color: C.textMain }]}
        />
        {query.length > 0 ? (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.85} style={styles.clearBtn}>
            <Ionicons name="close" size={13} color={C.textMuted} />
          </TouchableOpacity>
        ) : (
          <View style={styles.clearBtn} />
        )}
      </View>

      <FlatList
        data={visibleItems}
        keyExtractor={(i) => i.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 18 + insets.bottom, paddingHorizontal: 10, paddingTop: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 9 }} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.35}
        ListHeaderComponent={
          isLoadingMore ? (
            <View style={styles.loadingTop}>
              <ActivityIndicator size="small" color={C.brandBlue} />
              <Text style={[styles.loadingText, { color: C.textMuted }]}>Loading more results</Text>
            </View>
          ) : visibleCount < filtered.length ? (
            <View style={styles.loadingTop}>
              <Ionicons name="cloud-download-outline" size={14} color={C.textMuted} />
              <Text style={[styles.loadingText, { color: C.textMuted }]}>Scroll to fetch more</Text>
            </View>
          ) : filtered.length > 0 ? (
            <View style={styles.loadingTop}>
              <Ionicons name="checkmark-circle-outline" size={14} color={C.brandBlue} />
              <Text style={[styles.loadingText, { color: C.textMuted }]}>All results loaded</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={[styles.empty, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
            <View style={[styles.emptyIcon, { backgroundColor: C.brandBorder }]}>
              <Ionicons name="search" size={16} color={C.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: C.textMain }]}>No matches</Text>
            <Text style={[styles.emptyText, { color: C.textMuted }]}>Try a shorter keyword or a location.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => openItem(item)}
            style={[styles.card, { backgroundColor: C.surface, borderColor: C.brandBorder, shadowColor: C.textMain }]}
          >
            <View style={styles.cardTopRow}>
              <View style={[styles.badge, { backgroundColor: item.type === 'vehicle' ? C.brandOrange : C.brandBlue }]}>
                <Text style={[styles.badgeText, { color: C.surface }]}>
                  {item.type === 'vehicle' ? 'Vehicle' : 'Property'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color={C.textMuted} />
            </View>
            <Text style={[styles.cardTitle, { color: C.textMain }]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.cardMetaRow}>
              <Ionicons name="location-outline" size={13} color={C.textMuted} style={{ marginRight: 6 }} />
              <Text style={[styles.cardMeta, { color: C.textMuted }]} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
            <Text style={[styles.cardPrice, { color: C.textMain }]}>{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: 12, paddingBottom: 4 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  brandDot: { width: 7, height: 7, borderRadius: 999, marginRight: 8 },
  title: { fontSize: 18, fontWeight: '900' },
  subtitle: { marginTop: 3, fontSize: 10 },
  countPill: { paddingHorizontal: 7, height: 22, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  countText: { fontSize: 10, fontWeight: '800' },
  searchRow: {
    marginHorizontal: 12,
    marginTop: 7,
    marginBottom: 8,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 11 },
  clearBtn: { height: 22, width: 22, alignItems: 'center', justifyContent: 'center' },
  loadingTop: { marginBottom: 8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', gap: 6, flexDirection: 'row' },
  loadingText: { fontSize: 10, fontWeight: '700' },
  card: { padding: 9, borderRadius: 10, borderWidth: 1, elevation: 3, shadowOpacity: 0.06 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  cardTitle: { fontSize: 14, fontWeight: '900' },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardMeta: { fontSize: 11, flex: 1 },
  cardPrice: { marginTop: 7, fontSize: 12, fontWeight: '900' },
  empty: { padding: 11, borderRadius: 10, borderWidth: 1, marginTop: 7, alignItems: 'center' },
  emptyIcon: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  emptyTitle: { fontSize: 14, fontWeight: '900' },
  emptyText: { marginTop: 5, fontSize: 11, textAlign: 'center' },
});
