import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Image,
  useColorScheme,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.65) + 12;

const categories = [
  { key: 'houses', label: 'Houses', icon: 'home' },
  { key: 'cars', label: 'Cars', icon: 'car' },
  { key: 'apts', label: 'Apts', icon: 'business' },
  { key: 'land', label: 'Land', icon: 'planet' },
  { key: 'comm', label: 'Comm', icon: 'cube' },
  { key: 'vehi', label: 'Vehi', icon: 'car-sport' },
];

const featured = [
  { id: '1', price: '$150,000', title: 'Modern Villa', location: 'Hodan', beds: 4, baths: 3, agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9' },
  { id: '2', price: '$35,000', title: 'Toyota Land', location: 'Waberi', year: 2020, agent: 'Fatima', posterRole: 'Owner', posterVerified: false, posterRating: '4.7' },
  { id: '3', price: '$80,000', title: 'Prime Land', location: 'Yaqshid', agent: 'Omar', posterRole: 'Broker', posterVerified: true, posterRating: '4.8' },
];

const nearby = [
  { id: 'n1', title: '4BR Villa, Secure Compound', location: 'Hodan', price: '$120,000', beds: 4, baths: 3, time: '2 days ago', agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9' },
  { id: 'n2', title: '3BR Apt, New Building', location: 'Waberi', price: '$85,000', beds: 3, baths: 2, time: '5 hours ago', agent: 'Fatima', posterRole: 'Broker', posterVerified: true, posterRating: '4.8' },
];

const vehicles = [
  { id: 'v1', title: 'Hilux', price: '$28K', agent: 'Ali', posterRole: 'Dealer', posterVerified: false, posterRating: '4.6' },
  { id: 'v2', title: 'Patrol', price: '$42K', agent: 'Amina', posterRole: 'Dealer', posterVerified: true, posterRating: '4.8' },
];

const brokers = [
  { id: 'b1', name: 'Ahmed', role: 'Broker', stat: '4.9', reviews: '47 reviews', listings: '18 listings', avatar: 'https://i.pravatar.cc/160?img=12', accent: '#2F7CF6' },
  { id: 'b2', name: 'Fatima', role: 'Owner', stat: '4.8', reviews: '32 reviews', listings: '11 listings', avatar: 'https://i.pravatar.cc/160?img=32', accent: '#F28C28' },
  { id: 'b3', name: 'Omar', role: 'Dealer', stat: '4.7', reviews: '28 reviews', listings: '9 listings', avatar: 'https://i.pravatar.cc/160?img=56', accent: '#16A34A' },
];

export default function HomeScreen() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const C = Colors[colorScheme ?? 'light'];

  const q = query.trim().toLowerCase();
  const matches = (text: string) => text.toLowerCase().includes(q);

  const filteredCategories = useMemo(() => {
    if (!q) return categories;
    return categories.filter((c) => matches(`${c.label} ${c.key}`));
  }, [q]);

  const filteredFeatured = useMemo(() => {
    if (!q) return featured;
    return featured.filter((f) => matches(`${f.title} ${f.location} ${f.agent} ${f.price}`));
  }, [q]);

  const filteredNearby = useMemo(() => {
    if (!q) return nearby;
    return nearby.filter((n) => matches(`${n.title} ${n.location} ${n.price}`));
  }, [q]);

  const filteredVehicles = useMemo(() => {
    if (!q) return vehicles;
    return vehicles.filter((v) => matches(`${v.title} ${v.price}`));
  }, [q]);

  const filteredBrokers = useMemo(() => {
    if (!q) return brokers;
    return brokers.filter((b) => matches(`${b.name} ${b.stat}`));
  }, [q]);

  const clearSearch = () => {
    setQuery('');
    Keyboard.dismiss();
  };

  const openListingDetail = (params: {
    id: string;
    type: 'property' | 'vehicle';
    title: string;
    location?: string;
    price?: string;
    category?: string;
    posterName?: string;
    posterRole?: string;
    posterVerified?: boolean;
    posterRating?: string;
    posterPhone?: string;
    posterEmail?: string;
  }) => {
    router.push({
      pathname: '/listings-detail',
      params: {
        id: params.id,
        type: params.type,
        title: params.title,
        location: params.location ?? '',
        price: params.price ?? '',
        category: params.category ?? '',
        posterName: params.posterName ?? '',
        posterRole: params.posterRole ?? '',
        posterVerified: params.posterVerified ? '1' : '0',
        posterRating: params.posterRating ?? '',
        posterPhone: params.posterPhone ?? '',
        posterEmail: params.posterEmail ?? '',
      },
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      <View style={[styles.headerRow, { paddingTop: insets.top, height: 50 + insets.top }]}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color={C.brandOrange} />
          <Text style={[styles.locationText, { color: C.textMain }]}>Dalaal-Prime</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => router.push('/favorites')}
            activeOpacity={0.8}
            style={{ marginRight: 12 }}
          >
            <Ionicons name="notifications-outline" size={20} color={C.textMain} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.8}>
            <Ionicons name="person-circle-outline" size={22} color={C.textMain} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 80 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.searchRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
          <Ionicons name="search" size={15} color={C.textMuted} style={{ marginRight: 7 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search properties, vehicles..."
            placeholderTextColor={C.textMuted}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            style={[styles.searchInput, { color: C.textMain }]}
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={clearSearch} activeOpacity={0.85} style={styles.searchGo}>
              <Ionicons name="close" size={14} color={C.brandBlue} />
            </TouchableOpacity>
          ) : (
            <View style={styles.searchGo} />
          )}
        </View>

        {filteredCategories.length > 0 && (
          <View style={styles.categoryGrid}>
          {filteredCategories.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={styles.categoryItem}
              onPress={() => router.push({ pathname: '/search', params: { category: c.key } })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: C.brandOrange }]}>
                <Ionicons name={c.icon as any} size={18} color={C.surface} />
              </View>
              <Text style={[styles.categoryLabel, { color: C.textMain }]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
          </View>
        )}

        {filteredFeatured.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.textMain }]}>Featured</Text>
              <TouchableOpacity onPress={() => router.push('/listings/properties')}>
                <Text style={[styles.seeAll, { color: C.brandBlue }]}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              pagingEnabled
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH}
              showsHorizontalScrollIndicator={false}
              style={{ paddingVertical: 4 }}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
                setActiveIdx(idx);
              }}
            >
              {filteredFeatured.map((f) => (
            <TouchableOpacity
              key={f.id}
              activeOpacity={0.92}
              onPress={() =>
                openListingDetail({
                  id: f.id,
                  type: typeof f.year === 'number' ? 'vehicle' : 'property',
                  title: f.title,
                  location: f.location,
                  price: f.price,
                  posterName: f.agent,
                  posterRole: f.posterRole,
                  posterVerified: f.posterVerified,
                  posterRating: f.posterRating,
                })
              }
              style={[
                styles.featuredCard,
                {
                  backgroundColor: C.surface,
                  shadowColor: C.textMain,
                  borderColor: C.brandBorder,
                },
              ]}
            >
              <View style={[styles.cardImage, { backgroundColor: C.tableRow }]} />
              <View style={styles.cardRow}>
                <Text style={[styles.cardPrice, { color: C.textMain }]}>{f.price}</Text>
                <Text style={[styles.cardMetaRight, { color: C.textMuted }]}>{f.location}</Text>
              </View>
              <Text style={[styles.cardTitle, { color: C.textMain }]}>{f.title}</Text>
              <Text style={[styles.cardMeta, { color: C.textMuted }]}>
                {f.beds ? `${f.beds} bd • ${f.baths} ba` : f.year ?? ''}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.agentText, { color: C.textMuted }]} numberOfLines={1}>
                  👤 {f.agent} ✓
                </Text>
                <TouchableOpacity onPress={() => router.push('/chat')} activeOpacity={0.9}>
                  <Text style={styles.msgText}>💬</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.dotsRow}>
              {filteredFeatured.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: activeIdx === i ? C.brandOrange : C.brandBorder,
                      width: activeIdx === i ? 18 : 8,
                    },
                  ]}
                />
              ))}
            </View>
          </>
        )}

        {filteredNearby.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.textMain }]}>Nearby Properties</Text>
              <TouchableOpacity onPress={() => router.push('/listings/properties')}>
                <Text style={[styles.seeAll, { color: C.brandBlue }]}>See all</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredNearby}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    openListingDetail({
                      id: item.id,
                      type: 'property',
                      title: item.title,
                      location: item.location,
                      price: item.price,
                      category: 'houses',
                      posterName: item.agent,
                      posterRole: item.posterRole,
                      posterVerified: item.posterVerified,
                      posterRating: item.posterRating,
                    })
                  }
                  style={[styles.nearbyItem, { borderBottomColor: C.brandBorder }]}
                >
                  <View style={[styles.thumb, { backgroundColor: C.tableRow }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nearbyTitle, { color: C.textMain }]}>{item.title}</Text>
                    <Text style={[styles.nearbyMeta, { color: C.textMuted }]}>
                      {item.location} • {item.beds}bd • {item.time}
                    </Text>
                    <Text style={[styles.nearbyPrice, { color: C.textMain }]}>{item.price}</Text>
                  </View>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          </>
        )}

        {filteredVehicles.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.textMain }]}>Popular Vehicles</Text>
              <TouchableOpacity onPress={() => router.push('/listings/vehicles')}>
                <Text style={[styles.seeAll, { color: C.brandBlue }]}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 4 }}>
              {filteredVehicles.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  activeOpacity={0.92}
                  onPress={() =>
                    openListingDetail({
                      id: v.id,
                      type: 'vehicle',
                      title: v.title,
                      price: v.price,
                      category: 'cars',
                      posterName: v.agent,
                      posterRole: v.posterRole,
                      posterVerified: v.posterVerified,
                      posterRating: v.posterRating,
                    })
                  }
                  style={[styles.vehicleCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}
                >
                  <View style={[styles.smallThumb, { backgroundColor: C.brandBorder }]} />
                  <Text style={[styles.vehicleTitle, { color: C.textMain }]}>{v.title}</Text>
                  <Text style={[styles.vehiclePrice, { color: C.textMuted }]}>{v.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {filteredBrokers.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: C.textMain }]}>Top Brokers</Text>
              <TouchableOpacity onPress={() => router.push('/search')}>
                <Text style={[styles.seeAll, { color: C.brandBlue }]}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 4 }}>
              {filteredBrokers.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  activeOpacity={0.9}
                  onPress={() => router.push({ pathname: '/search', params: { q: b.name } })}
                  style={[
                    styles.brokerCard,
                    {
                      backgroundColor: C.surface,
                      borderColor: C.brandBorder,
                      shadowColor: b.accent,
                    },
                  ]}
                >
                  <View style={styles.brokerTopRow}>
                    <View style={styles.brokerAvatarWrap}>
                      <Image source={{ uri: b.avatar }} style={styles.brokerAvatar} />
                      <View style={[styles.brokerStatusDot, { backgroundColor: b.accent }]} />
                    </View>
                    <View style={[styles.brokerRankPill, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                      <Ionicons name="star" size={11} color={b.accent} />
                      <Text style={[styles.brokerRankText, { color: C.textMain }]}>{b.stat}</Text>
                    </View>
                  </View>
                  <Text style={[styles.brokerName, { color: C.textMain }]} numberOfLines={1}>{b.name}</Text>
                  <Text style={[styles.brokerRole, { color: C.textMuted }]} numberOfLines={1}>{b.role}</Text>
                  <View style={styles.brokerMetaRow}>
                    <Text style={[styles.brokerMetaText, { color: C.textMuted }]} numberOfLines={1}>
                      {b.reviews}
                    </Text>
                    <Text style={[styles.brokerMetaDot, { color: C.brandBorder }]}>•</Text>
                    <Text style={[styles.brokerMetaText, { color: C.textMuted }]} numberOfLines={1}>
                      {b.listings}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push('/chat')}
                    style={[styles.brokerAction, { backgroundColor: b.accent }]}
                  >
                    <Text style={[styles.brokerActionText, { color: C.surface }]}>Contact</Text>
                    <Ionicons name="chatbubbles" size={12} color={C.surface} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {q.length > 0 &&
          filteredCategories.length === 0 &&
          filteredFeatured.length === 0 &&
          filteredNearby.length === 0 &&
          filteredVehicles.length === 0 &&
          filteredBrokers.length === 0 && (
            <View style={[styles.noResults, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
              <Text style={[styles.noResultsTitle, { color: C.textMain }]}>No results on Home</Text>
              <Text style={[styles.noResultsText, { color: C.textMuted }]}>Try another word.</Text>
            </View>
          )}

        <View style={[styles.howRow, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
          <View style={styles.howHeader}>
            <Text style={[styles.howTitle, { color: C.textMain }]}>How it works</Text>
            <Text style={[styles.howSubtitle, { color: C.textMuted }]}>Fast search to contact in seconds</Text>
          </View>

          <View style={styles.howSteps}>
            <View style={[styles.howStepCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={[styles.howStepIcon, { backgroundColor: C.brandBlue }]}>
                <Ionicons name="search" size={14} color={C.surface} />
              </View>
              <Text style={[styles.howStepTitle, { color: C.textMain }]}>Search</Text>
              <Text style={[styles.howStepText, { color: C.textMuted }]}>Find listings by location, type, or broker.</Text>
            </View>

            <View style={[styles.howStepCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={[styles.howStepIcon, { backgroundColor: C.brandOrange }]}>
                <Ionicons name="eye" size={14} color={C.surface} />
              </View>
              <Text style={[styles.howStepTitle, { color: C.textMain }]}>View</Text>
              <Text style={[styles.howStepText, { color: C.textMuted }]}>Open details, save favorites, and compare info.</Text>
            </View>

            <View style={[styles.howStepCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={[styles.howStepIcon, { backgroundColor: C.brandBlue }]}> 
                <Ionicons name="chatbubbles" size={14} color={C.surface} />
              </View>
              <Text style={[styles.howStepTitle, { color: C.textMain }]}>Contact</Text>
              <Text style={[styles.howStepText, { color: C.textMuted }]}>Message the broker or owner instantly in chat.</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: { paddingBottom: 0, paddingTop: 4 },
  headerRow: { height: 50, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 7, fontWeight: '700', fontSize: 13 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  searchRow: { marginHorizontal: 12, marginTop: 7, marginBottom: 8, paddingVertical: 6, paddingHorizontal: 9, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 11 },
  searchGo: { height: 22, width: 22, alignItems: 'center', justifyContent: 'center' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 14 },
  categoryItem: { width: '30%', marginVertical: 8, alignItems: 'center' },
  categoryIcon: { width: 48, height: 48, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  categoryLabel: { fontSize: 11, fontWeight: '600' },
  sectionHeader: { marginTop: 6, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  seeAll: { fontWeight: '600' },
  featuredCard: {
    width: CARD_WIDTH,
    marginLeft: 14,
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowOpacity: 0.07,
    borderWidth: 1,
  },
  cardImage: { height: 118, borderRadius: 10, marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontWeight: '900', fontSize: 14 },
  cardMetaRight: { fontSize: 11 },
  cardTitle: { fontSize: 14, fontWeight: '800', marginTop: 5 },
  cardMeta: { fontSize: 11, marginTop: 3 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  agentText: {},
  msgText: { fontSize: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  dot: { height: 7, borderRadius: 4, marginHorizontal: 5 },
  nearbyItem: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, alignItems: 'center' },
  thumb: { width: 72, height: 56, borderRadius: 8, marginRight: 10 },
  nearbyTitle: { fontWeight: '700', fontSize: 13 },
  nearbyMeta: { fontSize: 11 },
  nearbyPrice: { marginTop: 4, fontWeight: '800', fontSize: 12 },
  vehicleCard: { width: 122, height: 104, borderRadius: 12, marginLeft: 14, padding: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  smallThumb: { width: 90, height: 52, borderRadius: 8, marginBottom: 6 },
  vehicleTitle: { fontWeight: '700', fontSize: 12 },
  vehiclePrice: {},
  brokersStack: { paddingHorizontal: 12, marginTop: 4 },
  brokerCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 11,
    marginTop: 8,
    marginRight: 10,
    shadowOpacity: 0.09,
    elevation: 3,
    width: 154,
  },
  brokerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  brokerAvatarWrap: { width: 42, height: 42, borderRadius: 13, overflow: 'hidden', position: 'relative' },
  brokerAvatar: { width: '100%', height: '100%' },
  brokerStatusDot: { position: 'absolute', right: 2, bottom: 2, width: 9, height: 9, borderRadius: 999, borderWidth: 2, borderColor: '#fff' },
  brokerRankPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 999, borderWidth: 1, paddingHorizontal: 7, height: 22 },
  brokerRankText: { marginLeft: 4, fontSize: 10, fontWeight: '900' },
  brokerName: { fontWeight: '900', fontSize: 14, marginTop: 2 },
  brokerRole: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  brokerMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  brokerMetaText: { fontSize: 10, fontWeight: '600', flexShrink: 1 },
  brokerMetaDot: { marginHorizontal: 5, fontSize: 10 },
  brokerAction: { marginTop: 10, height: 28, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  brokerActionText: { fontSize: 10, fontWeight: '900', marginRight: 6 },
  howRow: { marginHorizontal: 14, marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  howHeader: { marginBottom: 10 },
  howTitle: { fontWeight: '900', fontSize: 14 },
  howSubtitle: { marginTop: 3, fontSize: 11 },
  howSteps: { flexDirection: 'row', gap: 8 },
  howStepCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 10, alignItems: 'flex-start' },
  howStepIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  howStepTitle: { fontSize: 12, fontWeight: '900' },
  howStepText: { marginTop: 4, fontSize: 10, lineHeight: 14 },
  noResults: { marginHorizontal: 14, marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  noResultsTitle: { fontSize: 14, fontWeight: '900' },
  noResultsText: { marginTop: 4, fontSize: 11 },
});
