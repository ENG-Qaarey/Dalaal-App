import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../context/theme-context';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useChatStore } from '../../store/chatStore';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 190;
const AVATAR_SIZE = 70;
const THUMB_WIDTH = (width - 16 * 2 - 6 * 2) / 3;
const FALLBACK_AVATAR = 'https://i.pravatar.cc/300?img=14';
const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';

const MOCK_MEDIA = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80',
];

export default function UserContentPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const isDark = scheme === 'dark';
  const clearMessages = useChatStore((s) => s.clearMessages);

  const { userName, userRole, userImageUri, isOnline, conversationId } =
    useLocalSearchParams<{
      userId?: string;
      userName: string;
      userRole?: string;
      userImageUri?: string;
      isOnline?: string;
      conversationId?: string;
    }>();

  const online = isOnline === 'true';
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [reportModal, setReportModal] = React.useState(false);
  const [mediaFull, setMediaFull] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const pressAnims = React.useRef(Array.from({ length: 4 }, () => new Animated.Value(1))).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 50, HERO_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const stats = [
    { label: 'Listings', value: '18', icon: 'home' as const, color: C.brandBlue },
    { label: 'Rating', value: '4.9★', icon: 'star' as const, color: '#F59E0B' },
    { label: 'Response', value: '<1hr', icon: 'flash' as const, color: '#10B981' },
    { label: 'Deals', value: '63', icon: 'checkmark-circle' as const, color: '#8B5CF6' },
  ];

  const actions = [
    {
      label: 'Message', icon: 'chatbubble' as const, color: C.brandBlue,
      onPress: () => router.back(),
    },
    {
      label: 'Audio', icon: 'call' as const, color: '#16A34A',
      onPress: () => router.back(),
    },
    {
      label: 'Video', icon: 'videocam' as const, color: '#7C3AED',
      onPress: () => router.back(),
    },
    {
      label: 'Share', icon: 'share-social' as const, color: C.brandOrange,
      onPress: async () => {
        try {
          await Share.share({ message: `Check out ${userName}'s profile on Dalaal-Prime!` });
        } catch { /* ignore */ }
      },
    },
  ];

  const aboutRows = [
    { icon: 'location-outline' as const, text: 'Muqdisho, Somalia', color: C.brandBlue },
    { icon: 'language-outline' as const, text: 'Somali, Arabic, English', color: '#10B981' },
    { icon: 'time-outline' as const, text: 'Member since Jan 2023', color: C.textMuted },
    { icon: 'call-outline' as const, text: '+252 61 XXX XXXX', color: C.textMuted },
  ];

  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : '#fff';

  return (
    <View style={[styles.root, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      {/* ── Floating compact header (appears on scroll) ── */}
      <Animated.View
        style={[
          styles.floatingHeader,
          {
            paddingTop: insets.top + 6,
            backgroundColor: C.surface,
            borderBottomColor: C.brandBorder,
            opacity: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: C.tableRow }]}>
          <Ionicons name="arrow-back" size={15} color={C.textMain} />
        </TouchableOpacity>
        <Text style={[styles.floatingTitle, { color: C.textMain }]} numberOfLines={1}>
          {userName}
        </Text>
        <TouchableOpacity onPress={() => setReportModal(true)} style={[styles.iconBtn, { backgroundColor: C.tableRow }]}>
          <Ionicons name="ellipsis-horizontal" size={15} color={C.textMain} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
      >
        {/* ── HERO ── */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: FALLBACK_COVER }} style={styles.coverImg} />
          <LinearGradient
            colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.55)']}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.heroBtn, { top: insets.top + 10, left: 12 }]}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReportModal(true)}
            style={[styles.heroBtn, { top: insets.top + 10, right: 12 }]}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── IDENTITY BLOCK ── */}
        <View style={[styles.identityBlock, { backgroundColor: C.surface }]}>
          {/* Avatar overlapping hero */}
          <View style={[styles.avatarRing, { borderColor: C.surface }]}>
            <Image source={{ uri: userImageUri || FALLBACK_AVATAR }} style={styles.avatar} />
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: online ? '#22C55E' : '#9CA3AF', borderColor: C.surface },
              ]}
            />
          </View>

          {/* Name */}
          <Text style={[styles.nameText, { color: C.textMain }]}>{userName}</Text>

          {/* Badges row */}
          <View style={styles.badgeRow}>
            {userRole ? (
              <View style={[styles.badge, { backgroundColor: C.brandBlue + '22', borderColor: C.brandBlue + '44' }]}>
                <Ionicons name="briefcase-outline" size={9} color={C.brandBlue} />
                <Text style={[styles.badgeText, { color: C.brandBlue }]}>{userRole.toUpperCase()}</Text>
              </View>
            ) : null}
            <View style={[
              styles.badge,
              {
                backgroundColor: online ? '#22C55E18' : C.tableRow,
                borderColor: online ? '#22C55E44' : C.brandBorder,
              },
            ]}>
              <View style={[styles.pulseDot, { backgroundColor: online ? '#22C55E' : '#9CA3AF' }]} />
              <Text style={[styles.badgeText, { color: online ? '#16A34A' : C.textMuted }]}>
                {online ? 'Online' : 'Offline'}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#F59E0B18', borderColor: '#F59E0B44' }]}>
              <Ionicons name="shield-checkmark" size={9} color="#F59E0B" />
              <Text style={[styles.badgeText, { color: '#F59E0B' }]}>VERIFIED</Text>
            </View>
          </View>

          {/* Bio */}
          <Text style={[styles.bioText, { color: C.textMuted }]}>
            Professional broker based in Muqdisho. Specializing in residential & commercial
            properties across Somalia. Fast response guaranteed.
          </Text>
        </View>

        {/* ── STATS ROW ── */}
        <View style={[styles.statsCard, { backgroundColor: cardBg, borderColor: C.brandBorder }]}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              <View style={styles.statCol}>
                <View style={[styles.statIcon, { backgroundColor: s.color + '18' }]}>
                  <Ionicons name={s.icon} size={13} color={s.color} />
                </View>
                <Text style={[styles.statVal, { color: C.textMain }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: C.textMuted }]}>{s.label}</Text>
              </View>
              {i < stats.length - 1 && <View style={[styles.statSep, { backgroundColor: C.brandBorder }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── ACTION BUTTONS ── */}
        <View style={styles.actionsRow}>
          {actions.map((a, i) => (
            <Animated.View key={a.label} style={[styles.actionWrap, { transform: [{ scale: pressAnims[i] }] }]}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: a.color + '15', borderColor: a.color + '35' }]}
                onPress={a.onPress}
                onPressIn={() =>
                  Animated.spring(pressAnims[i], { toValue: 0.9, useNativeDriver: true }).start()
                }
                onPressOut={() =>
                  Animated.spring(pressAnims[i], { toValue: 1, useNativeDriver: true, friction: 4 }).start()
                }
                activeOpacity={1}
              >
                <View style={[styles.actionCircle, { backgroundColor: a.color }]}>
                  <Ionicons name={a.icon} size={15} color="#fff" />
                </View>
                <Text style={[styles.actionLabel, { color: C.textMain }]}>{a.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* ── ABOUT ── */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: C.brandBorder }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>About</Text>
          {aboutRows.map((r) => (
            <View key={r.text} style={styles.infoRow}>
              <View style={[styles.infoIconBox, { backgroundColor: r.color + '18' }]}>
                <Ionicons name={r.icon} size={12} color={r.color} />
              </View>
              <Text style={[styles.infoText, { color: C.textMuted }]}>{r.text}</Text>
            </View>
          ))}
        </View>

        {/* ── SHARED MEDIA ── */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: C.brandBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: C.textMain }]}>Shared Media</Text>
            <TouchableOpacity onPress={() => Alert.alert('Shared Media', 'Viewing all media...')}>
              <Text style={[styles.seeAll, { color: C.brandBlue }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaScrollContent}
          >
            {MOCK_MEDIA.map((uri, i) => (
              <TouchableOpacity key={i} onPress={() => setMediaFull(uri)} activeOpacity={0.85}>
                <Image source={{ uri }} style={[styles.mediaTile, { borderColor: C.brandBorder }]} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── CHAT OPTIONS ── */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: C.brandBorder }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Chat Options</Text>
          
          <TouchableOpacity style={styles.infoRow} onPress={() => Alert.alert('Search', 'Search in conversation...')}>
            <View style={[styles.infoIconBox, { backgroundColor: C.brandBlue + '18' }]}>
              <Ionicons name="search-outline" size={12} color={C.brandBlue} />
            </View>
            <Text style={[styles.infoText, { color: C.textMain, flex: 1 }]}>Search Conversation</Text>
            <Ionicons name="chevron-forward" size={13} color={C.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: C.brandBorder }]} />

          <TouchableOpacity style={styles.infoRow} onPress={() => setIsMuted(!isMuted)}>
            <View style={[styles.infoIconBox, { backgroundColor: '#8B5CF618' }]}>
              <Ionicons name={isMuted ? "notifications-off-outline" : "notifications-outline"} size={12} color="#8B5CF6" />
            </View>
            <Text style={[styles.infoText, { color: C.textMain, flex: 1 }]}>Mute Notifications</Text>
            <View style={[styles.toggleWrap, { backgroundColor: isMuted ? '#8B5CF6' : C.tableRow, borderColor: isMuted ? '#8B5CF6' : C.brandBorder }]}>
              <View style={[styles.toggleKnob, { transform: [{ translateX: isMuted ? 14 : 0 }] }]} />
            </View>
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: C.brandBorder }]} />

          <TouchableOpacity style={styles.infoRow} onPress={() => Alert.alert('Export', 'Exporting chat history...')}>
            <View style={[styles.infoIconBox, { backgroundColor: '#10B98118' }]}>
              <Ionicons name="download-outline" size={12} color="#10B981" />
            </View>
            <Text style={[styles.infoText, { color: C.textMain, flex: 1 }]}>Export Chat</Text>
            <Ionicons name="chevron-forward" size={13} color={C.textMuted} />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: C.brandBorder }]} />

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              Alert.alert('Clear Chat', 'Are you sure you want to clear all messages? This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => {
                    if (conversationId) {
                      clearMessages(conversationId);
                      Alert.alert('Success', 'Chat history cleared.');
                    }
                  } 
                },
              ])
            }
          >
            <View style={[styles.infoIconBox, { backgroundColor: '#EF444418' }]}>
              <Ionicons name="trash-outline" size={12} color="#EF4444" />
            </View>
            <Text style={[styles.infoText, { color: '#EF4444', flex: 1 }]}>Clear Chat History</Text>
            <Ionicons name="chevron-forward" size={13} color="#EF444480" />
          </TouchableOpacity>
        </View>

        {/* ── SAFETY ── */}
        <View style={[styles.sectionCard, { backgroundColor: cardBg, borderColor: C.brandBorder }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Safety</Text>
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              Alert.alert('Block User', `Block ${userName}?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Block', style: 'destructive', onPress: () => router.back() },
              ])
            }
          >
            <View style={[styles.infoIconBox, { backgroundColor: '#DC262618' }]}>
              <Ionicons name="ban-outline" size={12} color="#DC2626" />
            </View>
            <Text style={[styles.infoText, { color: '#DC2626', flex: 1 }]}>Block User</Text>
            <Ionicons name="chevron-forward" size={13} color="#DC262680" />
          </TouchableOpacity>
          <View style={[styles.divider, { backgroundColor: C.brandBorder }]} />
          <TouchableOpacity style={styles.infoRow} onPress={() => setReportModal(true)}>
            <View style={[styles.infoIconBox, { backgroundColor: '#F59E0B18' }]}>
              <Ionicons name="flag-outline" size={12} color="#F59E0B" />
            </View>
            <Text style={[styles.infoText, { color: '#F59E0B', flex: 1 }]}>Report User</Text>
            <Ionicons name="chevron-forward" size={13} color="#F59E0B80" />
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* ── REPORT BOTTOM SHEET ── */}
      <Modal
        visible={reportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModal(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setReportModal(false)}
        >
          <View style={[styles.sheet, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
            <View style={[styles.sheetHandle, { backgroundColor: C.brandBorder }]} />
            <Text style={[styles.sheetTitle, { color: C.textMain }]}>Report or Block</Text>
            {['Spam', 'Inappropriate content', 'Fake account', 'Harassment', 'Other'].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[styles.reportRow, { borderBottomColor: C.brandBorder }]}
                onPress={() => {
                  setReportModal(false);
                  Alert.alert('Reported', `"${reason}" has been submitted. Thank you.`);
                }}
              >
                <View style={[styles.infoIconBox, { backgroundColor: '#DC262618' }]}>
                  <Ionicons name="flag-outline" size={12} color="#DC2626" />
                </View>
                <Text style={[styles.reportText, { color: C.textMain }]}>{reason}</Text>
                <Ionicons name="chevron-forward" size={13} color={C.textMuted} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── FULL MEDIA VIEWER ── */}
      <Modal
        visible={!!mediaFull}
        transparent
        animationType="fade"
        onRequestClose={() => setMediaFull(null)}
      >
        <View style={styles.viewer}>
          <TouchableOpacity
            style={[styles.viewerClose, { top: insets.top + 10 }]}
            onPress={() => setMediaFull(null)}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
          {mediaFull ? (
            <Image source={{ uri: mediaFull }} style={styles.viewerImg} resizeMode="contain" />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Floating header ──
  floatingHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingBottom: 8, borderBottomWidth: 1,
  },
  iconBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  floatingTitle: { flex: 1, textAlign: 'center', fontSize: 14, fontWeight: '900', marginHorizontal: 8 },

  // ── Hero ──
  heroContainer: { height: HERO_HEIGHT, position: 'relative' },
  coverImg: { width: '100%', height: '100%' },
  heroBtn: {
    position: 'absolute', width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center',
  },

  // ── Identity block ──
  identityBlock: {
    marginTop: -(AVATAR_SIZE / 2),
    paddingHorizontal: 16,
    paddingBottom: 14,
    alignItems: 'flex-start',
  },
  avatarRing: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 6,
    marginBottom: 10,
  },
  avatar: { width: '100%', height: '100%' },
  onlineDot: {
    position: 'absolute', right: 3, bottom: 3,
    width: 11, height: 11, borderRadius: 6, borderWidth: 2,
  },
  nameText: { fontSize: 20, fontWeight: '900', marginBottom: 7 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1,
  },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.3 },
  pulseDot: { width: 5, height: 5, borderRadius: 3 },
  bioText: { fontSize: 12, lineHeight: 18, fontWeight: '500' },

  // ── Stats card ──
  statsCard: {
    marginHorizontal: 16, borderRadius: 14, borderWidth: 1,
    flexDirection: 'row', marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statCol: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 4 },
  statIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statVal: { fontSize: 13, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '600' },
  statSep: { width: 1, marginVertical: 10 },

  // ── Actions ──
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  actionWrap: { flex: 1 },
  actionBtn: { alignItems: 'center', paddingVertical: 10, borderRadius: 12, borderWidth: 1, gap: 5 },
  actionCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 10, fontWeight: '800' },

  // ── Section card (vertical content) ──
  sectionCard: {
    marginHorizontal: 16, borderRadius: 14, borderWidth: 1,
    padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  sectionTitle: { fontSize: 13, fontWeight: '900', marginBottom: 12 },
  sectionHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  seeAll: { fontSize: 11, fontWeight: '700' },

  // ── Info rows (vertical) ──
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 10,
  },
  infoIconBox: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, marginBottom: 10 },
  toggleWrap: { width: 34, height: 20, borderRadius: 10, borderWidth: 1, padding: 2, justifyContent: 'center' },
  toggleKnob: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },

  // ── Media scroll ──
  mediaScrollContent: { gap: 8, paddingRight: 16 },
  mediaTile: { width: 110, height: 75, borderRadius: 8, borderWidth: 1 },

  // ── Report sheet ──
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, padding: 16 },
  sheetHandle: { width: 36, height: 3, borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 15, fontWeight: '900', marginBottom: 12 },
  reportRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, borderBottomWidth: 1,
  },
  reportText: { fontSize: 13, fontWeight: '600' },

  // ── Media viewer ──
  viewer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  viewerClose: {
    position: 'absolute', right: 14, zIndex: 10,
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
  },
  viewerImg: { width: '100%', height: '80%' },
});
