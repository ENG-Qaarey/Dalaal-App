import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View, Keyboard, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import Skeleton from '../../components/ui/Skeleton';
import ResponsiveContainer from '../../components/ui/ResponsiveContainer';
import useAuth from '../../hooks/useAuth';
import { categories, featured, nearby, vehicles, brokers, clips } from '../../constants/homeData';
import { spacing, radius, fontSize } from '../../constants/tokens';

import HomeHeader from '../../components/home/HomeHeader';
import HomeSearch from '../../components/home/HomeSearch';
import HomeCategories from '../../components/home/HomeCategories';
import HomeClips from '../../components/home/HomeClips';
import HomeFeatured from '../../components/home/HomeFeatured';
import HomeNearby from '../../components/home/HomeNearby';
import HomeVehicles from '../../components/home/HomeVehicles';
import HomeBrokers from '../../components/home/HomeBrokers';
import HomeClipsPlayer from '../../components/home/HomeClipsPlayer';
import { listingDetailHref } from '../../utils/listing-nav';

export default function HomeScreen() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [playingClipId, setPlayingClipId] = useState<string | null>('c1');
  const [selectedClip, setSelectedClip] = useState<any | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = (text: string) => text.toLowerCase().includes(q);

  const filteredCategories = useMemo(() => q ? categories.filter((c) => matches(`${c.label} ${c.key}`)) : categories, [q]);
  const filteredFeatured = useMemo(() => q ? featured.filter((f) => matches(`${f.title} ${f.location} ${f.agent} ${f.price}`)) : featured, [q]);
  const filteredNearby = useMemo(() => q ? nearby.filter((n) => matches(`${n.title} ${n.location} ${n.price}`)) : nearby, [q]);
  const filteredVehicles = useMemo(() => q ? vehicles.filter((v) => matches(`${v.title} ${v.price}`)) : vehicles, [q]);
  const filteredBrokers = useMemo(() => q ? brokers.filter((b) => matches(`${b.name} ${b.stat}`)) : brokers, [q]);

  const openListingDetail = (params: Record<string, string | number | boolean | undefined>) => {
    router.push(listingDetailHref(params) as any);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top', 'left', 'right']}>
      <ResponsiveContainer>
      <HomeHeader
        userAvatar={user?.profile?.avatar}
        onProfilePress={() => router.push('/profile')}
        onNotificationsPress={() => router.push('/profile/favorites')}
        colors={C}
      />

      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 24 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.skeletonWrap}>
            <View style={styles.skeletonHeader}><Skeleton width="44%" height={fontSize.body} /><Skeleton width={spacing.massive} height={spacing.massive} borderRadius={radius.md} /></View>
            <Skeleton height={spacing.massive} borderRadius={radius.md} style={styles.skeletonSearch} />
            <View style={styles.skeletonCategoryGrid}>{Array.from({ length: 6 }).map((_, i) => (<View key={i} style={styles.skeletonCategoryItem}><Skeleton width={spacing.massive} height={spacing.massive} borderRadius={radius.md} /><Skeleton width="72%" height={fontSize.caption} style={styles.skeletonLabel} /></View>))}</View>
          </View>
        ) : null}

        {!isLoading && (
          <>
            <HomeSearch query={query} setQuery={setQuery} onClear={() => { setQuery(''); Keyboard.dismiss(); }} colors={C} scheme={scheme} />
            {filteredCategories.length > 0 && (
              <HomeCategories categories={filteredCategories} colors={C} onPress={(key) => router.push({ pathname: '/search', params: { category: key } })} />
            )}
            
            <HomeClips clips={clips} playingClipId={playingClipId} onClipPress={setSelectedClip} colors={C} />

            {filteredFeatured.length > 0 && (
              <HomeFeatured
                items={filteredFeatured} activeIdx={activeIdx} colors={C} scheme={scheme}
                onScrollEnd={setActiveIdx}
                onSeeAll={() => router.push('/listings/properties')}
                onChatPress={() => router.push('/chat')}
                onPress={(f) =>
                  openListingDetail({
                    id: f.id,
                    type: f.year ? 'vehicle' : 'property',
                    title: f.title,
                    location: f.location,
                    price: f.price,
                    image: f.image,
                    category: f.year ? 'cars' : 'houses',
                    posterName: f.agent,
                    posterRole: f.posterRole,
                    posterVerified: f.posterVerified,
                    posterRating: f.posterRating,
                  })
                }
              />
            )}

            {filteredNearby.length > 0 && (
              <HomeNearby
                items={filteredNearby}
                colors={C}
                onSeeAll={() => router.push('/listings/properties')}
                onPress={(item) =>
                  openListingDetail({
                    id: item.id,
                    type: 'property',
                    title: item.title,
                    location: item.location,
                    price: item.price,
                    image: item.image,
                    category: 'houses',
                    posterName: item.agent,
                    posterRole: item.posterRole,
                    posterVerified: item.posterVerified,
                    posterRating: item.posterRating,
                  })
                }
              />
            )}

            {filteredVehicles.length > 0 && (
              <HomeVehicles
                items={filteredVehicles}
                colors={C}
                scheme={scheme}
                onSeeAll={() => router.push('/listings/vehicles')}
                onPress={(v) =>
                  openListingDetail({
                    id: v.id,
                    type: 'vehicle',
                    title: v.title,
                    price: v.price,
                    image: v.image,
                    category: 'cars',
                    posterName: v.agent,
                    posterRole: v.posterRole,
                    posterVerified: v.posterVerified,
                    posterRating: v.posterRating,
                  })
                }
              />
            )}

            {filteredBrokers.length > 0 && (
              <HomeBrokers items={filteredBrokers} colors={C} scheme={scheme} onSeeAll={() => router.push('/search')} onPress={(name) => router.push({ pathname: '/search', params: { q: name } })} onContactPress={() => router.push('/chat')} />
            )}

            {q.length > 0 && filteredCategories.length === 0 && filteredFeatured.length === 0 && filteredNearby.length === 0 && filteredVehicles.length === 0 && filteredBrokers.length === 0 && (
              <View style={[styles.noResults, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
                <Text style={[styles.noResultsTitle, { color: C.textMain }]}>No results on Home</Text>
                <Text style={[styles.noResultsText, { color: C.textMuted }]}>Try another word.</Text>
              </View>
            )}

            <View style={[styles.howRow, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={styles.howHeader}>
                <Text style={[styles.howTitle, { color: C.textMain }]}>How it works</Text>
                <Text style={[styles.howSubtitle, { color: C.textMuted }]}>Fast search to contact in seconds</Text>
              </View>
              <View style={styles.howSteps}>
                <View style={[styles.howStepCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
                  <View style={[styles.howStepIcon, { backgroundColor: C.brandBlue }]}><Ionicons name="search" size={fontSize.caption} color={C.surface} /></View>
                  <Text style={[styles.howStepTitle, { color: C.textMain }]}>Search</Text>
                </View>
                <View style={[styles.howStepCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
                  <View style={[styles.howStepIcon, { backgroundColor: C.brandOrange }]}><Ionicons name="eye" size={fontSize.caption} color={C.surface} /></View>
                  <Text style={[styles.howStepTitle, { color: C.textMain }]}>View</Text>
                </View>
                <View style={[styles.howStepCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
                  <View style={[styles.howStepIcon, { backgroundColor: C.brandBlue }]}><Ionicons name="chatbubbles" size={fontSize.caption} color={C.surface} /></View>
                  <Text style={[styles.howStepTitle, { color: C.textMain }]}>Contact</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      </ResponsiveContainer>

      <HomeClipsPlayer
        visible={!!selectedClip}
        clips={clips}
        selectedClip={selectedClip}
        setSelectedClip={setSelectedClip}
        onClose={() => setSelectedClip(null)}
        colors={C}
        userAvatar={user?.profile?.avatar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { paddingTop: spacing.xs },
  skeletonWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skeletonSearch: { marginTop: spacing.md },
  skeletonCategoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: spacing.md },
  skeletonCategoryItem: { width: '30%', alignItems: 'center', marginVertical: spacing.sm },
  skeletonLabel: { marginTop: spacing.sm },
  noResults: { marginHorizontal: spacing.lg, marginTop: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  noResultsTitle: { fontSize: fontSize.small, fontWeight: '900' },
  noResultsText: { marginTop: spacing.xs, fontSize: fontSize.caption },
  howRow: { marginHorizontal: spacing.lg, marginTop: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  howHeader: { marginBottom: spacing.sm },
  howTitle: { fontWeight: '900', fontSize: fontSize.small },
  howSubtitle: { marginTop: spacing.xs, fontSize: fontSize.caption },
  howSteps: { flexDirection: 'row', gap: spacing.sm },
  howStepCard: { flex: 1, borderRadius: radius.md, borderWidth: 1, padding: spacing.sm, alignItems: 'flex-start' },
  howStepIcon: { width: spacing.md + spacing.sm, height: spacing.md + spacing.sm, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  howStepTitle: { fontSize: fontSize.caption, fontWeight: '900' },
});
