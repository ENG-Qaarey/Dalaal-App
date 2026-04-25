import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useFavorites } from '../../context/favorites-context';
import { useAppTheme } from '../../context/theme-context';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

export default function Favorites() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

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

      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: C.brandBorder }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            style={[styles.backBtn, { backgroundColor: C.tableRow }]}
          >
            <Ionicons name="arrow-back" size={16} color={C.textMain} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: C.textMain }]}>Favorites</Text>
        </View>
        {favorites.length > 0 ? (
          <TouchableOpacity
            onPress={clearFavorites}
            activeOpacity={0.85}
            style={[styles.clearBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}
          >
            <Text style={[styles.clearText, { color: C.textMain }]}>Clear</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 18 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {favorites.length === 0 ? (
          <View style={[styles.empty, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
            <View style={[styles.emptyIcon, { backgroundColor: C.brandBorder }]}>
              <Ionicons name="heart-outline" size={16} color={C.textMuted} />
            </View>
            <Text style={[styles.emptyTitle, { color: C.textMain }]}>No favorites yet</Text>
            <Text style={[styles.emptyText, { color: C.textMuted }]}>Open a listing and tap the heart to save it here.</Text>
          </View>
        ) : (
          favorites.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: '/listings-detail',
                  params: {
                    id: item.id,
                    type: item.type ?? '',
                    title: item.title,
                    location: item.location ?? '',
                    price: item.price ?? '',
                    category: item.category ?? '',
                    posterName: item.posterName ?? '',
                    posterRole: item.posterRole ?? '',
                    posterPhone: item.posterPhone ?? '',
                    posterEmail: item.posterEmail ?? '',
                    posterVerified: item.posterVerified ? '1' : '0',
                    posterRating: item.posterRating ?? '',
                  },
                })
              }
              style={[styles.card, { backgroundColor: C.surface, borderColor: C.brandBorder, shadowColor: C.textMain }]}
            >
              <View style={[styles.cardThumb, { backgroundColor: C.tableRow }]}>
                <Image
                  source={{ uri: item.posterName ? `https://i.pravatar.cc/120?u=${encodeURIComponent(item.posterName)}` : 'https://i.pravatar.cc/120?img=12' }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <View style={[styles.badge, { backgroundColor: item.type === 'vehicle' ? C.brandOrange : C.brandBlue }]}>
                    <Text style={[styles.badgeText, { color: C.surface }]}>
                      {item.type === 'vehicle' ? 'Vehicle' : 'Property'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeFavorite(item.id)} activeOpacity={0.85} style={[styles.heartBtn, { backgroundColor: C.tableRow }]}>
                    <Ionicons name="trash-outline" size={14} color={C.brandOrange} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.cardTitle, { color: C.textMain }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.cardMeta, { color: C.textMuted }]} numberOfLines={1}>
                  {item.location || '—'} • {item.price || '—'}
                </Text>
                <Text style={[styles.cardOwner, { color: C.textMuted }]} numberOfLines={1}>
                  {item.posterRole ? `${item.posterRole} • ` : ''}{item.posterName || 'Unknown'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: { borderBottomWidth: 1, paddingBottom: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '900' },
  clearBtn: { height: 26, paddingHorizontal: 9, borderRadius: 9, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  clearText: { fontSize: 10, fontWeight: '800' },
  content: { paddingHorizontal: 10 },
  empty: { borderWidth: 1, borderRadius: 11, paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', marginTop: 8 },
  emptyIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 14, fontWeight: '900' },
  emptyText: { marginTop: 5, fontSize: 10, textAlign: 'center' },
  card: {
    borderWidth: 1,
    borderRadius: 11,
    marginTop: 8,
    padding: 8,
    flexDirection: 'row',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  cardThumb: { width: 58, height: 58, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  cardBody: { flex: 1 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 9, fontWeight: '900' },
  heartBtn: { height: 24, width: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { marginTop: 5, fontSize: 13, fontWeight: '900' },
  cardMeta: { marginTop: 3, fontSize: 10 },
  cardOwner: { marginTop: 3, fontSize: 9, fontWeight: '700' },
});
