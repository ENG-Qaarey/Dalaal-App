import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View, Keyboard, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import Skeleton from '../../components/ui/Skeleton';
import useAuth from '../../hooks/useAuth';

// Sub-components
import HomeHeader from '../../components/home/HomeHeader';
import HomeSearch from '../../components/home/HomeSearch';
import HomeCategories from '../../components/home/HomeCategories';
import HomeClips from '../../components/home/HomeClips';
import HomeFeatured from '../../components/home/HomeFeatured';
import HomeNearby from '../../components/home/HomeNearby';
import HomeVehicles from '../../components/home/HomeVehicles';
import HomeBrokers from '../../components/home/HomeBrokers';
import HomeClipsPlayer from '../../components/home/HomeClipsPlayer';

const categories = [
  { key: 'houses', label: 'Houses', icon: 'home' },
  { key: 'cars', label: 'Cars', icon: 'car' },
  { key: 'apts', label: 'Apts', icon: 'business' },
  { key: 'land', label: 'Land', icon: 'planet' },
  { key: 'comm', label: 'Comm', icon: 'cube' },
  { key: 'vehi', label: 'Vehi', icon: 'car-sport' },
];

const featured = [
  { id: '1', price: '$150,000', title: 'Modern Villa', location: 'Hodan', beds: 4, baths: 3, agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { id: '2', price: '$35,000', title: 'Toyota Land', location: 'Waberi', year: 2020, agent: 'Fatima', posterRole: 'Owner', posterVerified: false, posterRating: '4.7', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b5b3f32?auto=format&fit=crop&w=1200&q=80' },
  { id: '3', price: '$80,000', title: 'Prime Land', location: 'Yaqshid', agent: 'Omar', posterRole: 'Broker', posterVerified: true, posterRating: '4.8', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
];

const nearby = [
  { id: 'n1', title: '4BR Villa, Secure Compound', location: 'Hodan', price: '$120,000', beds: 4, baths: 3, time: '2 days ago', agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80' },
  { id: 'n2', title: '3BR Apt, New Building', location: 'Waberi', price: '$85,000', beds: 3, baths: 2, time: '5 hours ago', agent: 'Fatima', posterRole: 'Broker', posterVerified: true, posterRating: '4.8', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
];

const vehicles = [
  { id: 'v1', title: 'Hilux', price: '$28K', agent: 'Ali', posterRole: 'Dealer', posterVerified: false, posterRating: '4.6', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80' },
  { id: 'v2', title: 'Patrol', price: '$42K', agent: 'Amina', posterRole: 'Dealer', posterVerified: true, posterRating: '4.8', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
];

const brokers = [
  { id: 'b1', name: 'Ahmed', role: 'Broker', stat: '4.9', reviews: '47 reviews', listings: '18 listings', avatar: 'https://i.pravatar.cc/160?img=12', accent: '#2F7CF6' },
  { id: 'b2', name: 'Fatima', role: 'Owner', stat: '4.8', reviews: '32 reviews', listings: '11 listings', avatar: 'https://i.pravatar.cc/160?img=32', accent: '#F28C28' },
  { id: 'b3', name: 'Omar', role: 'Dealer', stat: '4.7', reviews: '28 reviews', listings: '9 listings', avatar: 'https://i.pravatar.cc/160?img=56', accent: '#16A34A' },
];

const clips = [
  { id: 'c1', price: '$250k', title: 'Modern Villa Tour', location: 'Hodan, Muqdisho', tag: 'Sale', video: 'https://videos.pexels.com/video-files/34386459/14568003_1440_2560_60fps.mp4' },
  { id: 'c2', price: '$180k', title: 'Bright Interior', location: 'Garowe, Puntland', tag: 'Sale', video: 'https://cdn.pixabay.com/video/2025/01/23/254112_large.mp4' },
  { id: 'c3', price: '$420k', title: 'Luxury Night Estate', location: 'Hargeisa, SL', tag: 'Sale', video: 'https://cdn.pixabay.com/video/2025/06/13/285663_large.mp4' },
];

export default function HomeScreen() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [playingClipId, setPlayingClipId] = useState<string | null>('c1');
  const [selectedClip, setSelectedClip] = useState<any | null>(null);
  const [isFullMuted, setIsFullMuted] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState<any>({});
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalPaused, setIsModalPaused] = useState(false);
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

  const openListingDetail = (params: any) => {
    router.push({ pathname: '/listings-detail', params: { ...params, posterVerified: params.posterVerified ? '1' : '0' } });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top', 'left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      
      <HomeHeader
        userAvatar={user?.profile?.avatar}
        onProfilePress={() => router.push('/profile')}
        onNotificationsPress={() => router.push('/profile/favorites')}
        colors={C}
      />

      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 84 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.skeletonWrap}>
            <View style={styles.skeletonHeader}><Skeleton width="44%" height={22} /><Skeleton width={42} height={42} borderRadius={14} /></View>
            <Skeleton height={46} borderRadius={12} style={styles.skeletonSearch} />
            <View style={styles.skeletonCategoryGrid}>{Array.from({ length: 6 }).map((_, i) => (<View key={i} style={styles.skeletonCategoryItem}><Skeleton width={48} height={48} borderRadius={14} /><Skeleton width="72%" height={10} style={styles.skeletonLabel} /></View>))}</View>
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
                onPress={(f) => openListingDetail({ id: f.id, type: f.year ? 'vehicle' : 'property', title: f.title, location: f.location, price: f.price, posterName: f.agent, posterRole: f.posterRole, posterVerified: f.posterVerified, posterRating: f.posterRating })}
              />
            )}

            {filteredNearby.length > 0 && (
              <HomeNearby items={filteredNearby} colors={C} onSeeAll={() => router.push('/listings/properties')} onPress={(item) => openListingDetail({ id: item.id, type: 'property', title: item.title, location: item.location, price: item.price, category: 'houses', posterName: item.agent, posterRole: item.posterRole, posterVerified: item.posterVerified, posterRating: item.posterRating })} />
            )}

            {filteredVehicles.length > 0 && (
              <HomeVehicles items={filteredVehicles} colors={C} scheme={scheme} onSeeAll={() => router.push('/listings/vehicles')} onPress={(v) => openListingDetail({ id: v.id, type: 'vehicle', title: v.title, price: v.price, category: 'cars', posterName: v.agent, posterRole: v.posterRole, posterVerified: v.posterVerified, posterRating: v.posterRating })} />
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

            <View style={[styles.howRow, { backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)', borderColor: C.brandBorder }]}>
              <View style={styles.howHeader}><Text style={[styles.howTitle, { color: C.textMain }]}>How it works</Text><Text style={[styles.howSubtitle, { color: C.textMuted }]}>Fast search to contact in seconds</Text></View>
              <View style={styles.howSteps}>
                <View style={[styles.howStepCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}><View style={[styles.howStepIcon, { backgroundColor: C.brandBlue }]}><Ionicons name="search" size={14} color={C.surface} /></View><Text style={[styles.howStepTitle, { color: C.textMain }]}>Search</Text></View>
                <View style={[styles.howStepCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}><View style={[styles.howStepIcon, { backgroundColor: C.brandOrange }]}><Ionicons name="eye" size={14} color={C.surface} /></View><Text style={[styles.howStepTitle, { color: C.textMain }]}>View</Text></View>
                <View style={[styles.howStepCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}><View style={[styles.howStepIcon, { backgroundColor: C.brandBlue }]}><Ionicons name="chatbubbles" size={14} color={C.surface} /></View><Text style={[styles.howStepTitle, { color: C.textMain }]}>Contact</Text></View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <HomeClipsPlayer
        visible={!!selectedClip}
        clips={clips}
        selectedClip={selectedClip}
        setSelectedClip={setSelectedClip}
        isModalPaused={isModalPaused}
        setIsModalPaused={setIsModalPaused}
        isFullMuted={isFullMuted}
        setIsFullMuted={setIsFullMuted}
        playbackStatus={playbackStatus}
        setPlaybackStatus={setPlaybackStatus}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        isSaved={isSaved}
        setIsSaved={setIsSaved}
        onClose={() => { setSelectedClip(null); setIsModalPaused(false); }}
        colors={C}
        insets={insets}
        userAvatar={user?.profile?.avatar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: { paddingBottom: 0, paddingTop: 4 },
  skeletonWrap: { paddingHorizontal: 14, paddingTop: 4 },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skeletonSearch: { marginTop: 12 },
  skeletonCategoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
  skeletonCategoryItem: { width: '30%', alignItems: 'center', marginVertical: 8 },
  skeletonLabel: { marginTop: 8 },
  noResults: { marginHorizontal: 14, marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  noResultsTitle: { fontSize: 14, fontWeight: '900' },
  noResultsText: { marginTop: 4, fontSize: 11 },
  howRow: { marginHorizontal: 14, marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  howHeader: { marginBottom: 10 },
  howTitle: { fontWeight: '900', fontSize: 14 },
  howSubtitle: { marginTop: 3, fontSize: 11 },
  howSteps: { flexDirection: 'row', gap: 8 },
  howStepCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 10, alignItems: 'flex-start' },
  howStepIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  howStepTitle: { fontSize: 12, fontWeight: '900' },
});
