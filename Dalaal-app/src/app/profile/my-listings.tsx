import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

const MOCK_MY_LISTINGS = [
  { id: 'm1', price: '$95,000', title: '3BR House, Hodan', location: 'Hodan', type: 'property' as const, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { id: 'm2', price: '$22,000', title: 'Nissan Patrol', location: 'Waberi', type: 'vehicle' as const, image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80' },
];

export default function MyListings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
        <ScreenSkeleton variant="list" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: C.brandBorder }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={[styles.backBtn, { backgroundColor: C.tableRow }]}>
          <Ionicons name="arrow-back" size={16} color={C.textMain} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.textMain }]}>My Listings</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 18 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {MOCK_MY_LISTINGS.length === 0 ? (
          <View style={[styles.empty, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
            <Ionicons name="list-outline" size={24} color={C.textMuted} />
            <Text style={[styles.emptyTitle, { color: C.textMain }]}>No listings yet</Text>
            <Text style={[styles.emptyText, { color: C.textMuted }]}>Create your first listing to get started.</Text>
          </View>
        ) : (
          MOCK_MY_LISTINGS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: '/listings/detail',
                  params: {
                    id: item.id,
                    type: item.type,
                    title: item.title,
                    location: item.location,
                    price: item.price,
                    image: item.image,
                  },
                })
              }
              style={[styles.card, { backgroundColor: C.surface, borderColor: C.brandBorder }]}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.badge, { backgroundColor: item.type === 'vehicle' ? C.brandOrange : C.brandBlue }]}>
                    <Text style={[styles.badgeText, { color: C.surface }]}>{item.type === 'vehicle' ? 'Vehicle' : 'Property'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={C.textMuted} />
                </View>
                <Text style={[styles.cardPrice, { color: C.textMain }]}>{item.price}</Text>
                <Text style={[styles.cardTitle, { color: C.textMain }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.cardMeta, { color: C.textMuted }]}>{item.location}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { borderBottomWidth: 1, paddingBottom: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '900' },
  content: { paddingHorizontal: 12 },
  empty: { borderWidth: 1, borderRadius: 11, paddingVertical: 24, alignItems: 'center', marginTop: 12 },
  emptyTitle: { fontSize: 14, fontWeight: '900', marginTop: 8 },
  emptyText: { fontSize: 10, marginTop: 4 },
  card: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, marginTop: 10, padding: 8 },
  cardImage: { width: 90, height: 80, borderRadius: 10, marginRight: 10 },
  cardBody: { flex: 1 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 9, fontWeight: '900' },
  cardPrice: { fontSize: 14, fontWeight: '900', marginTop: 4 },
  cardTitle: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  cardMeta: { fontSize: 10, marginTop: 2 },
});
