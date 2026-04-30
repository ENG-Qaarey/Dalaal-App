import React, { useEffect, useMemo, useState } from 'react';
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
  Keyboard,
  Modal,
  Share,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import Skeleton from '../../components/ui/Skeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import useAuth from '../../hooks/useAuth';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.58) + 10;

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
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top', 'left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      <View style={[styles.headerRow, { height: 50 }]}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color={C.brandOrange} />
          <Text style={[styles.locationText, { color: C.textMain }]}>Dalaal-Prime</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => router.push('/profile/favorites')}
            activeOpacity={0.8}
            style={{ marginRight: 12 }}
          >
            <Ionicons name="notifications-outline" size={20} color={C.textMain} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')} activeOpacity={0.85} style={styles.profileBtn}>
            <Image
              source={{ uri: user?.profile?.avatar || 'https://i.pravatar.cc/160?img=14' }}
              style={[styles.profileAvatar, { borderColor: C.brandBorder }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 84 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.skeletonWrap}>
            <View style={styles.skeletonHeader}>
              <Skeleton width="44%" height={22} />
              <Skeleton width={42} height={42} borderRadius={14} />
            </View>
            <Skeleton height={46} borderRadius={12} style={styles.skeletonSearch} />
            <View style={styles.skeletonCategoryGrid}>
              {Array.from({ length: 6 }).map((_, index) => (
                <View key={index} style={styles.skeletonCategoryItem}>
                  <Skeleton width={48} height={48} borderRadius={14} />
                  <Skeleton width="72%" height={10} style={styles.skeletonLabel} />
                </View>
              ))}
            </View>
            <View style={styles.skeletonSectionRow}>
              <Skeleton width="32%" height={18} />
              <Skeleton width={44} height={14} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.skeletonCardRow}>
              {Array.from({ length: 3 }).map((_, index) => (
                <View key={index} style={styles.skeletonCard}>
                  <Skeleton height={118} borderRadius={10} />
                  <Skeleton width="58%" height={14} style={styles.skeletonCardLine} />
                  <Skeleton width="86%" height={12} style={styles.skeletonCardLine} />
                  <Skeleton width="42%" height={12} style={styles.skeletonCardLine} />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {!isLoading && (
        <>
        <View style={[styles.searchRow, { backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', borderColor: C.brandBorder }]}>
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

        <View style={styles.clipSectionHeader}>
          <View style={[styles.clipIconBox, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
            <Ionicons name="play-circle-outline" size={24} color={C.textMain} />
          </View>
          <View>
            <Text style={[styles.clipTitle, { color: C.textMain }]}>Clips</Text>
            <Text style={[styles.clipSubtitle, { color: C.textMuted }]}>Autoplay in-view preview</Text>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.clipsScroll}
          contentContainerStyle={{ paddingLeft: 14, paddingRight: 4 }}
        >
          {clips.map((clip) => (
            <TouchableOpacity 
              key={clip.id} 
              activeOpacity={0.9} 
              style={styles.clipCard}
              onPress={() => setSelectedClip(clip)}
            >
              <Video
                source={{ uri: clip.video }}
                style={styles.clipVideo}
                isLooping
                isMuted={true}
                shouldPlay={playingClipId === clip.id}
                resizeMode={ResizeMode.COVER}
              />
              
              <View style={styles.clipTagTopLeft}>
                <View style={styles.liveDot} />
                <Text style={styles.clipTagText}>LIVE</Text>
              </View>

              <View style={styles.clipTagTopRight}>
                <Ionicons 
                  name={playingClipId === clip.id ? "pause" : "play"} 
                  size={12} 
                  color="#fff" 
                />
                <Text style={[styles.clipTagText, { marginLeft: 4 }]}>
                  {playingClipId === clip.id ? "Playing" : "Paused"}
                </Text>
              </View>
              
              <LinearGradient 
                colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']} 
                style={styles.clipInfoGradient}
              >
                <View style={styles.clipMetaRow}>
                  <Text style={styles.clipPrice}>{clip.price}</Text>
                  <View style={styles.clipViews}>
                    <Ionicons name="eye-outline" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.clipViewsText}>{Math.floor(Math.random() * 50) + 10}k</Text>
                  </View>
                </View>
                <Text style={styles.clipName} numberOfLines={1}>{clip.title}</Text>
                <Text style={styles.clipLoc} numberOfLines={1}>{clip.location}</Text>
              </LinearGradient>

              {playingClipId !== clip.id && (
                <View style={styles.clipPlayOverlay}>
                  <View style={styles.clipPlayBtnInner}>
                    <Ionicons name="play" size={32} color="#fff" style={{ marginLeft: 4 }} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

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
                  backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)',
                  shadowColor: C.textMain,
                  borderColor: C.brandBorder,
                },
              ]}
            >
              <Image source={{ uri: f.image }} style={styles.cardImage} />
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
                  <Image source={{ uri: item.image }} style={styles.thumb} />
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
                  style={[styles.vehicleCard, { backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)', borderColor: C.brandBorder }]}
                >
                  <Image source={{ uri: v.image }} style={styles.smallThumb} />
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
                      backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)',
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

        <View style={[styles.howRow, { backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)', borderColor: C.brandBorder }]}>
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
        </>
      )}
      </ScrollView>

      {/* Full Screen Clips Player Modal */}
      <Modal
        visible={!!selectedClip}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setSelectedClip(null);
          setIsModalPaused(false);
        }}
      >
        {selectedClip && (
          <View style={styles.modalFull}>
            <LinearGradient colors={[C.brandBlue, C.brandOrange]} style={StyleSheet.absoluteFill} />
            <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
            
            <FlatList
              data={clips}
              keyExtractor={(item) => item.id}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              initialScrollIndex={clips.findIndex(c => c.id === selectedClip.id)}
              getItemLayout={(_, index) => ({
                length: Dimensions.get('window').height,
                offset: Dimensions.get('window').height * index,
                index,
              })}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.y / Dimensions.get('window').height);
                setSelectedClip(clips[index]);
              }}
              renderItem={({ item }) => (
                <View style={{ height: Dimensions.get('window').height, width: Dimensions.get('window').width }}>
                  <Video
                    source={{ uri: item.video }}
                    style={StyleSheet.absoluteFill}
                    isLooping
                    shouldPlay={selectedClip.id === item.id && !isModalPaused}
                    isMuted={isFullMuted}
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={(status) => {
                      if (selectedClip.id === item.id) setPlaybackStatus(status);
                    }}
                  />
                  
                  <LinearGradient 
                    colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.7)']} 
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                  />

                  <TouchableOpacity 
                    activeOpacity={1} 
                    style={StyleSheet.absoluteFill} 
                    onPress={() => setIsModalPaused(!isModalPaused)}
                  >
                    {isModalPaused && selectedClip.id === item.id && (
                      <View style={styles.modalCenterPlay}>
                        <View style={styles.modalCenterPlayInner}>
                          <Ionicons name="play" size={48} color="#fff" style={{ marginLeft: 6 }} />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Right Actions - Compact sizes */}
                  <View style={[styles.modalRightActions, { bottom: 80 + insets.bottom, right: 12 + insets.right }]}>
                    <TouchableOpacity 
                      style={[styles.modalActionItem, { marginBottom: 12 }]} 
                      activeOpacity={0.7}
                      onPress={() => setIsLiked(!isLiked)}
                    >
                      <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                        <Ionicons 
                          name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
                          size={18} 
                          color={isLiked ? "#ff3b30" : "#fff"} 
                        />
                      </View>
                      <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalActionItem, { marginBottom: 12 }]} 
                      activeOpacity={0.7}
                      onPress={() => setIsSaved(!isSaved)}
                    >
                      <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                        <Ionicons 
                          name={isSaved ? "bookmark" : "bookmark-outline"} 
                          size={18} 
                          color={isSaved ? "#2F7CF6" : "#fff"} 
                        />
                      </View>
                      <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalActionItem, { marginBottom: 12 }]} 
                      activeOpacity={0.7}
                      onPress={async () => {
                        try {
                          await Share.share({
                            message: `Check out this amazing property tour: ${item.title} in ${item.location}!`,
                            url: item.video,
                          });
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    >
                      <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                        <Ionicons name="share-social-outline" size={18} color="#fff" />
                      </View>
                      <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalActionItem, { marginBottom: 12 }]} 
                      activeOpacity={0.7}
                      onPress={() => setIsFullMuted(!isFullMuted)}
                    >
                      <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                        <Ionicons 
                          name={isFullMuted ? "volume-mute-outline" : "volume-medium-outline"} 
                          size={18} 
                          color="#fff" 
                        />
                      </View>
                      <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>{isFullMuted ? "Muted" : "Sound"}</Text>
                    </TouchableOpacity>
                    <Image 
                      source={{ uri: user?.profile?.avatar || 'https://i.pravatar.cc/160?img=12' }} 
                      style={[styles.modalSmallAvatar, { width: 34, height: 34, borderRadius: 10 }]} 
                    />
                  </View>

                  {/* Bottom Content - Compact sizes */}
                  <View style={[styles.modalBottomContent, { paddingBottom: Math.max(insets.bottom, 20), left: 16 + insets.left, right: 70 + insets.right, bottom: 0 }]}>
                    <View style={[styles.modalProfileRow, { marginBottom: 8 }]}>
                      <Image 
                        source={{ uri: 'https://i.pravatar.cc/160?img=32' }} 
                        style={[styles.modalAvatar, { width: 28, height: 28 }]} 
                      />
                      <Text style={[styles.modalProfileName, { fontSize: 13 }]}>Kiro Haaye Real Estate</Text>
                    </View>
                    <Text style={[styles.modalClipTitle, { fontSize: 16, marginBottom: 2 }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.modalClipMeta, { fontSize: 12, marginBottom: 12 }]}>
                      {item.location} • {item.price}
                    </Text>
                    
                    <View style={styles.modalActionRow}>
                      <TouchableOpacity style={[styles.modalViewBtn, { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 }]} activeOpacity={0.8}>
                        <Ionicons name="home" size={14} color="#fff" />
                        <Text style={[styles.modalViewBtnText, { fontSize: 12 }]}>View</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => setIsModalPaused(!isModalPaused)}
                        style={[styles.modalMiniPlay, { width: 30, height: 30 }]}
                      >
                        <Ionicons name={isModalPaused ? "play" : "pause"} size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {selectedClip.id === item.id && (
                      <View style={[styles.modalProgressWrap, { marginTop: 12 }]}>
                        <View style={styles.modalProgressBar}>
                          <View style={[
                            styles.modalProgressFill, 
                            { 
                              width: playbackStatus.isLoaded && playbackStatus.durationMillis 
                                ? `${(playbackStatus.positionMillis / playbackStatus.durationMillis) * 100}%` 
                                : '0%' 
                            }
                          ]} />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}
            />
            
            {/* Top Nav - Persistent over the scroll */}
            <View style={[styles.modalTopNav, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: Math.max(insets.top, 10) }]}>
              <TouchableOpacity 
                onPress={() => {
                  setSelectedClip(null);
                  setIsModalPaused(false);
                }} 
                style={styles.modalBackBtn}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.modalBackText}>Back</Text>
              </TouchableOpacity>
              <View style={styles.modalTopRight}>
                <Ionicons name="search" size={22} color="#fff" style={{ marginRight: 20 }} />
                <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
              </View>
            </View>
          </View>
        )}
      </Modal>
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
  profileBtn: { width: 30, height: 30, borderRadius: 999, overflow: 'hidden' },
  profileAvatar: { width: '100%', height: '100%', borderRadius: 999, borderWidth: 1 },
  searchRow: { marginHorizontal: 14, marginTop: 7, marginBottom: 8, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 11 },
  searchGo: { height: 22, width: 22, alignItems: 'center', justifyContent: 'center' },
  skeletonWrap: { paddingHorizontal: 14, paddingTop: 4 },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skeletonSearch: { marginTop: 12 },
  skeletonCategoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12 },
  skeletonCategoryItem: { width: '30%', alignItems: 'center', marginVertical: 8 },
  skeletonLabel: { marginTop: 8 },
  skeletonSectionRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skeletonCardRow: { marginTop: 8 },
  skeletonCard: { width: CARD_WIDTH, marginLeft: 0, marginRight: 14 },
  skeletonCardLine: { marginTop: 8 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 14 },
  categoryItem: { width: '23%', marginVertical: 6, alignItems: 'center' },
  categoryIcon: { width: 40, height: 40, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  categoryLabel: { fontSize: 10, fontWeight: '600' },
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
  cardImage: { height: 100, borderRadius: 10, marginBottom: 6, width: '100%' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontWeight: '900', fontSize: 13 },
  cardMetaRight: { fontSize: 10 },
  cardTitle: { fontSize: 13, fontWeight: '800', marginTop: 4 },
  cardMeta: { fontSize: 10, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  agentText: {},
  msgText: { fontSize: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  dot: { height: 7, borderRadius: 4, marginHorizontal: 5 },
  nearbyItem: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, alignItems: 'center' },
  thumb: { width: 72, height: 56, borderRadius: 8, marginRight: 10 },
  nearbyTitle: { fontWeight: '700', fontSize: 12 },
  nearbyMeta: { fontSize: 10 },
  nearbyPrice: { marginTop: 2, fontWeight: '800', fontSize: 11 },
  vehicleCard: { width: 110, height: 96, borderRadius: 10, marginLeft: 14, padding: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  smallThumb: { width: 80, height: 46, borderRadius: 8, marginBottom: 4 },
  vehicleTitle: { fontWeight: '700', fontSize: 11 },
  vehiclePrice: { fontSize: 10 },
  brokersStack: { paddingHorizontal: 12, marginTop: 4 },
  brokerCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 11,
    marginTop: 8,
    marginRight: 10,
    shadowOpacity: 0.09,
    elevation: 3,
    width: 140,
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
  gradient: { flex: 1 },
  video: { width: '100%', height: 200, borderRadius: 12, marginVertical: 8 },
  clipSectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginTop: 12, marginBottom: 12 },
  clipIconBox: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  clipTitle: { fontSize: 18, fontWeight: '800' },
  clipSubtitle: { fontSize: 12, fontWeight: '500' },
  clipsScroll: { marginBottom: 16 },
  clipCard: { width: 140, height: 220, borderRadius: 16, marginRight: 12, overflow: 'hidden', position: 'relative' },
  clipVideo: { width: '100%', height: '100%' },
  clipTagTopLeft: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  clipTagTopRight: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  clipTagText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#ff3b30', marginRight: 4 },
  clipInfoGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', justifyContent: 'flex-end', padding: 10 },
  clipMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  clipPrice: { color: '#fff', fontSize: 14, fontWeight: '900' },
  clipViews: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  clipViewsText: { color: '#fff', fontSize: 10, fontWeight: '600', marginLeft: 3 },
  clipName: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 0 },
  clipLoc: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500', marginTop: 1 },
  clipPlayOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  clipPlayBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
  modalFull: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000', zIndex: 9999 },
  modalTopNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  modalBackBtn: { flexDirection: 'row', alignItems: 'center' },
  modalBackText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 10 },
  modalTopRight: { flexDirection: 'row', alignItems: 'center' },
  modalRightActions: { position: 'absolute', right: 15, bottom: 100, alignItems: 'center' },
  modalActionItem: { alignItems: 'center', marginBottom: 20 },
  modalActionIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  modalActionText: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 4 },
  modalSmallAvatar: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#fff', marginTop: 10 },
  modalBottomContent: { position: 'absolute', bottom: 0, left: 20, right: 80 },
  modalProfileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10, borderWidth: 1, borderColor: '#fff' },
  modalProfileName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalClipTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 5 },
  modalClipMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500', marginBottom: 15 },
  modalViewBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  modalViewBtnText: { color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 8 },
  modalProgressWrap: { marginTop: 25, width: '100%' },
  modalProgressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  modalProgressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  modalCenterPlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' },
  modalCenterPlayInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  modalActionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  modalMiniPlay: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
});
