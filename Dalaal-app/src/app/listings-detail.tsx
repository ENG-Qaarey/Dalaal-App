import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/theme';
import OnboardingBackground from '../components/OnboardingBackground';
import { useFavorites } from '../context/favorites-context';
import { useAppTheme } from '../context/theme-context';
import ScreenSkeleton from '../components/ui/ScreenSkeleton';

export const options = { headerShown: false };

type DetailParams = {
  id?: string;
  type?: 'property' | 'vehicle' | string;
  image?: string;
  title?: string;
  location?: string;
  price?: string;
  category?: string;
  posterName?: string;
  posterRole?: string;
  posterPhone?: string;
  posterEmail?: string;
  posterVerified?: string;
  posterRating?: string;
};

export default function ListingsDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<DetailParams>();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Calculator State
  const [downPaymentPct, setDownPaymentPct] = useState('20');
  const [interestRate, setInterestRate] = useState('5.5');
  const [years, setYears] = useState('30');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;

  const detail = useMemo(() => {
    const type = (params.type === 'vehicle' || params.type === 'property') ? params.type : undefined;
    const posterVerified = params.posterVerified === '1' || params.posterVerified === 'true';
    const rating = (params.posterRating ?? '').trim();

    return {
      id: params.id ?? '',
      type,
      title: params.title ?? 'Listing',
      location: params.location ?? '—',
      price: params.price ?? '—',
      category: params.category ?? '—',
      image: params.image ?? '',
      poster: {
        name: (params.posterName ?? '').trim(),
        role: (params.posterRole ?? '').trim(),
        phone: (params.posterPhone ?? '').trim(),
        email: (params.posterEmail ?? '').trim(),
        verified: posterVerified,
        rating,
      },
    };
  }, [
    params.category,
    params.id,
    params.location,
    params.posterEmail,
    params.posterName,
    params.posterPhone,
    params.posterRating,
    params.posterRole,
    params.posterVerified,
    params.price,
    params.title,
    params.type,
  ]);

  const badgeLabel = detail.type ? (detail.type === 'vehicle' ? 'Vehicle' : 'Property') : 'Listing';
  const badgeBg = detail.type === 'vehicle' ? C.brandOrange : C.brandBlue;
  const favorite = isFavorite(detail.id);

  const mediaItems = useMemo(() => {
    const mainImg = detail.image || (detail.type === 'vehicle' 
      ? 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' 
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80');
    
    // Add extra mock images for realistic UX
    const extra1 = detail.type === 'vehicle' 
      ? 'https://images.unsplash.com/photo-1502877338535-3425a819f727?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
    const extra2 = detail.type === 'vehicle'
      ? 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1502672260266-1c1e5250ff51?auto=format&fit=crop&w=800&q=80';
      
    return [
      { id: '1', type: 'image', uri: mainImg },
      { id: '2', type: 'image', uri: extra1 },
      { id: '3', type: 'image', uri: extra2 },
    ];
  }, [detail.image, detail.type]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="detail" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={[styles.backBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="chevron-back" size={18} color={C.textMain} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: C.textMain }]} numberOfLines={1}>
            {detail.title}
          </Text>
          <View style={styles.headerSubRow}>
            <Ionicons name="location-outline" size={14} color={C.textMuted} style={{ marginRight: 6 }} />
            <Text style={[styles.headerSubtitle, { color: C.textMuted }]} numberOfLines={1}>
              {detail.location}
            </Text>
          </View>
        </View>

          <TouchableOpacity
            onPress={() =>
              toggleFavorite({
                id: detail.id,
                  type: detail.type === 'property' || detail.type === 'vehicle' ? detail.type : undefined,
                title: detail.title,
                location: detail.location,
                price: detail.price,
                category: detail.category,
                posterName: detail.poster.name,
                posterRole: detail.poster.role,
                posterPhone: detail.poster.phone,
                posterEmail: detail.poster.email,
                posterVerified: detail.poster.verified,
                posterRating: detail.poster.rating,
              })
            }
            activeOpacity={0.85}
            style={[
              styles.favoriteBtn,
              {
                backgroundColor: favorite ? C.brandOrange : C.tableRow,
                borderColor: favorite ? C.brandOrange : C.brandBorder,
              },
            ]}
          >
            <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={18} color={favorite ? C.surface : C.textMain} />
          </TouchableOpacity>

          {favorite ? (
            <TouchableOpacity
              onPress={() =>
                toggleFavorite({
                  id: detail.id,
                  type: detail.type === 'property' || detail.type === 'vehicle' ? detail.type : undefined,
                  title: detail.title,
                  location: detail.location,
                  price: detail.price,
                  category: detail.category,
                  posterName: detail.poster.name,
                  posterRole: detail.poster.role,
                  posterPhone: detail.poster.phone,
                  posterEmail: detail.poster.email,
                  posterVerified: detail.poster.verified,
                  posterRating: detail.poster.rating,
                })
              }
              activeOpacity={0.85}
              style={[styles.deleteBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}
            >
              <Ionicons name="trash-outline" size={14} color={C.textMain} />
              <Text style={[styles.deleteText, { color: C.textMain }]}>Delete</Text>
            </TouchableOpacity>
          ) : null}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 22 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        
        {/* Media Header */}
        <TouchableOpacity activeOpacity={0.9} style={styles.mediaContainer} onPress={() => setIsViewerOpen(true)}>
          <Image 
            source={{ uri: mediaItems[0].uri }} 
            style={styles.mediaImage}
            resizeMode="cover"
          />
          <View style={styles.mediaPill}>
            <Ionicons name="images-outline" size={14} color="#fff" />
            <Text style={styles.mediaPillText}>View Media</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.hero, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: C.surface }]}>{badgeLabel}</Text>
          </View>
          <Text style={[styles.price, { color: C.textMain }]}>{detail.price}</Text>
          <Text style={[styles.meta, { color: C.textMuted }]}>Category: {detail.category}</Text>
          {detail.id ? <Text style={[styles.meta, { color: C.textMuted }]}>ID: {detail.id}</Text> : null}
        </View>

        <View style={[styles.section, { borderColor: C.brandBorder, backgroundColor: C.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Details</Text>
          <View style={[styles.row, { borderBottomColor: C.brandBorder }]}>
            <Text style={[styles.k, { color: C.textMuted }]}>Title</Text>
            <Text style={[styles.v, { color: C.textMain }]} numberOfLines={2}>{detail.title}</Text>
          </View>
          <View style={[styles.row, { borderBottomColor: C.brandBorder }]}>
            <Text style={[styles.k, { color: C.textMuted }]}>Location</Text>
            <Text style={[styles.v, { color: C.textMain }]} numberOfLines={2}>{detail.location}</Text>
          </View>
          <View style={[styles.row, { borderBottomColor: C.brandBorder }]}>
            <Text style={[styles.k, { color: C.textMuted }]}>Price</Text>
            <Text style={[styles.v, { color: C.textMain }]}>{detail.price}</Text>
          </View>
          <View style={[styles.row, { borderBottomColor: C.brandBorder }]}
          >
            <Text style={[styles.k, { color: C.textMuted }]}>Type</Text>
            <Text style={[styles.v, { color: C.textMain }]}>{badgeLabel}</Text>
          </View>
        </View>

        {(detail.poster.name || detail.poster.role || detail.poster.phone || detail.poster.email) ? (
          <View style={[styles.section, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
            <Text style={[styles.sectionTitle, { color: C.textMain }]}>Posted by</Text>

            <View style={[styles.posterTopRow, { borderBottomColor: C.brandBorder }]}>
              <View style={[styles.avatar, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                <Ionicons name="person" size={18} color={C.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.posterNameRow}>
                  <Text style={[styles.posterName, { color: C.textMain }]} numberOfLines={1}>
                    {detail.poster.name || 'Unknown'}
                  </Text>
                  {detail.poster.verified ? (
                    <View style={[styles.verifiedPill, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                      <Ionicons name="checkmark-circle" size={14} color={C.brandBlue} style={{ marginRight: 6 }} />
                      <Text style={[styles.verifiedText, { color: C.textMuted }]}>Verified</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.posterMetaRow}>
                  {detail.poster.role ? (
                    <View style={[styles.rolePill, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                      <Text style={[styles.roleText, { color: C.textMuted }]} numberOfLines={1}>
                        {detail.poster.role}
                      </Text>
                    </View>
                  ) : null}
                  {detail.poster.rating ? (
                    <Text style={[styles.ratingText, { color: C.textMuted }]} numberOfLines={1}>
                      {detail.poster.rating}★
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>

            {detail.poster.phone ? (
              <View style={[styles.contactRow, { borderBottomColor: C.brandBorder }]}>
                <Ionicons name="call-outline" size={16} color={C.textMuted} style={{ marginRight: 10 }} />
                <Text style={[styles.contactText, { color: C.textMain }]}>{detail.poster.phone}</Text>
              </View>
            ) : null}

            {detail.poster.email ? (
              <View style={[styles.contactRow, { borderBottomColor: C.brandBorder }]}>
                <Ionicons name="mail-outline" size={16} color={C.textMuted} style={{ marginRight: 10 }} />
                <Text style={[styles.contactText, { color: C.textMain }]}>{detail.poster.email}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Financial Calculator */}
        {detail.type === 'property' && (
          <View style={[styles.section, { borderColor: C.brandBorder, backgroundColor: C.surface }]}>
            <Text style={[styles.sectionTitle, { color: C.textMain }]}>Mortgage Calculator</Text>
            
            <View style={styles.calcRow}>
              <View style={styles.calcInputWrap}>
                <Text style={[styles.k, { color: C.textMuted }]}>Down Pay (%)</Text>
                <TextInput 
                  style={[styles.calcInput, { backgroundColor: C.tableRow, borderColor: C.brandBorder, color: C.textMain }]}
                  keyboardType="numeric"
                  value={downPaymentPct}
                  onChangeText={setDownPaymentPct}
                />
              </View>
              <View style={styles.calcInputWrap}>
                <Text style={[styles.k, { color: C.textMuted }]}>Interest (%)</Text>
                <TextInput 
                  style={[styles.calcInput, { backgroundColor: C.tableRow, borderColor: C.brandBorder, color: C.textMain }]}
                  keyboardType="numeric"
                  value={interestRate}
                  onChangeText={setInterestRate}
                />
              </View>
              <View style={styles.calcInputWrap}>
                <Text style={[styles.k, { color: C.textMuted }]}>Years</Text>
                <TextInput 
                  style={[styles.calcInput, { backgroundColor: C.tableRow, borderColor: C.brandBorder, color: C.textMain }]}
                  keyboardType="numeric"
                  value={years}
                  onChangeText={setYears}
                />
              </View>
            </View>

            <View style={[styles.calcResult, { backgroundColor: C.brandBlue + '15', borderColor: C.brandBlue }]}>
              <Text style={[styles.k, { color: C.textMuted }]}>Estimated Monthly Payment</Text>
              <Text style={[styles.calcPrice, { color: C.brandBlue }]}>
                {(() => {
                  const price = parseInt(detail.price.replace(/[^0-9]/g, '')) || 0;
                  const dp = parseFloat(downPaymentPct) || 0;
                  const ir = parseFloat(interestRate) || 0;
                  const y = parseInt(years) || 0;
                  if (price === 0 || y === 0) return '$0 / mo';
                  
                  const principal = price * (1 - dp / 100);
                  const r = ir / 100 / 12;
                  const n = y * 12;
                  if (r === 0) return '$' + (principal / n).toFixed(0) + ' / mo';
                  
                  const payment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                  return '$' + payment.toFixed(0) + ' / mo';
                })()}
              </Text>
            </View>
          </View>
        )}

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => router.push(`/booking/${detail.id}?title=${encodeURIComponent(detail.title)}`)}
            style={[styles.gridBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
          >
            <Ionicons name="calendar-outline" size={24} color={C.brandBlue} style={{ marginBottom: 6 }} />
            <Text style={[styles.gridBtnText, { color: C.textMain }]}>Book Tour</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => router.push(`/contract/${detail.id}?title=${encodeURIComponent(detail.title)}`)}
            style={[styles.gridBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
          >
            <Ionicons name="document-text-outline" size={24} color={C.brandOrange} style={{ marginBottom: 6 }} />
            <Text style={[styles.gridBtnText, { color: C.textMain }]}>E-Sign</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => {
            const chatId = detail.poster.email 
              ? detail.poster.email.replace(/[^a-zA-Z0-9]/g, '') 
              : `agent_${detail.id}`;
            const name = detail.poster.name || 'Property Agent';
            const role = detail.poster.role || 'Agent';
            const cleanTitle = detail.title.replace(/[^a-zA-Z0-9]/g, '');
            const initialText = `I am interested in #${cleanTitle}`;
            router.push(`/chat/${chatId}?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&online=1&initialText=${encodeURIComponent(initialText)}&listingId=${detail.id}&listingTitle=${encodeURIComponent(cleanTitle)}`);
          }}
          style={[styles.primaryBtn, { backgroundColor: C.brandBlue }]}
        >
          <Ionicons name="chatbubbles" size={18} color={C.surface} style={{ marginRight: 10 }} />
          <Text style={[styles.primaryText, { color: C.surface }]}>Contact in Chat</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Fullscreen Media Viewer */}
      <Modal visible={isViewerOpen} transparent animationType="fade" onRequestClose={() => setIsViewerOpen(false)}>
        <View style={styles.viewerRoot}>
          <TouchableOpacity style={styles.viewerClose} onPress={() => setIsViewerOpen(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.viewerCount}>
            {mediaItems.length > 0 ? `${viewerIndex + 1}/${mediaItems.length}` : '0/0'}
          </Text>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const width = event.nativeEvent.layoutMeasurement.width || 1;
              const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setViewerIndex(nextIndex);
            }}
          >
            {mediaItems.map((item) => (
              <View key={item.id} style={[styles.viewerSlide, { width: windowWidth }]}>
                <ScrollView
                  style={styles.zoomWrap}
                  contentContainerStyle={styles.zoomContent}
                  minimumZoomScale={1}
                  maximumZoomScale={4}
                  bouncesZoom={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  centerContent
                >
                  <Image source={{ uri: item.uri }} style={styles.viewerImage} resizeMode="contain" />
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: 12, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' },
  backBtn: { height: 34, width: 34, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '900' },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  headerSubtitle: { fontSize: 12, flex: 1 },
  favoriteBtn: { height: 34, width: 34, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  deleteBtn: { height: 34, paddingHorizontal: 10, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 8, flexDirection: 'row' },
  deleteText: { marginLeft: 6, fontSize: 11, fontWeight: '800' },
  content: { paddingHorizontal: 12 },
  mediaContainer: { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', marginBottom: 12, position: 'relative' },
  mediaImage: { width: '100%', height: '100%' },
  mediaPill: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' },
  mediaPillText: { color: '#fff', fontSize: 11, fontWeight: '800', marginLeft: 6 },
  hero: { borderWidth: 1, borderRadius: 12, padding: 12 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginBottom: 10 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  price: { fontSize: 18, fontWeight: '900' },
  meta: { marginTop: 6, fontSize: 12 },
  section: { marginTop: 10, borderRadius: 12, borderWidth: 1, padding: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '900', marginBottom: 8 },
  row: { paddingVertical: 10, borderBottomWidth: 1 },
  k: { fontSize: 11, fontWeight: '800' },
  v: { marginTop: 4, fontSize: 13, fontWeight: '700' },
  posterTopRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1 },
  avatar: { height: 40, width: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  posterNameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  posterName: { fontSize: 13, fontWeight: '900', flex: 1, marginRight: 8 },
  verifiedPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 26, borderRadius: 999, borderWidth: 1 },
  verifiedText: { fontSize: 10, fontWeight: '900' },
  posterMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rolePill: { paddingHorizontal: 10, height: 24, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  roleText: { fontSize: 10, fontWeight: '900' },
  ratingText: { marginLeft: 10, fontSize: 11, fontWeight: '900' },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  contactText: { fontSize: 12, fontWeight: '800', flex: 1 },
  primaryBtn: { marginTop: 12, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primaryText: { fontSize: 14, fontWeight: '900' },
  calcRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  calcInputWrap: { flex: 1 },
  calcInput: { borderWidth: 1, borderRadius: 8, height: 36, marginTop: 4, paddingHorizontal: 8, fontSize: 12, fontWeight: '700' },
  calcResult: { marginTop: 12, borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center' },
  calcPrice: { fontSize: 20, fontWeight: '900', marginTop: 4 },
  actionGrid: { flexDirection: 'row', gap: 10, marginTop: 10 },
  gridBtn: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  gridBtnText: { fontSize: 12, fontWeight: '800' },
  viewerRoot: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerClose: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111AA',
  },
  viewerImage: { width: '100%', height: '100%' },
  viewerSlide: { height: '100%' },
  zoomWrap: { width: '100%', height: '100%' },
  zoomContent: { flexGrow: 1, justifyContent: 'center' },
  viewerCount: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    zIndex: 1,
    backgroundColor: '#111111AA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
