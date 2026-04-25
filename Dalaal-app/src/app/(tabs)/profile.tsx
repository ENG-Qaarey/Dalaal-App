import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';
import useAuth from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import ProfileSectionCard from '../../components/profile/ProfileSectionCard';

const languageOptions = ['English', 'Somali'];

function getUiAvatar(name: string, email: string, size = 200): string {
  const label = encodeURIComponent((name || email || 'Dalaal User').trim());
  return `https://ui-avatars.com/api/?name=${label}&size=${size}&background=E5E7EB&color=111827&bold=true`;
}

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme, isDark, toggleTheme } = useAppTheme();
  const { user, logout, checkAuth } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [emailAvatarUrl, setEmailAvatarUrl] = useState<string | null>(null);
  const [avatarSourceIndex, setAvatarSourceIndex] = useState(0);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarViewerOpen, setIsAvatarViewerOpen] = useState(false);

  // Read real user data from auth store
  const userEmail = user?.email || 'user@dalaal.so';
  const userPhone = user?.phone || '';
  const userRole = user?.role || 'CUSTOMER';
  const userStatus = user?.status || 'ACTIVE';
  const firstName = user?.profile?.firstName || '';
  const lastName = user?.profile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Dalaal User';
  const userBio = user?.profile?.bio || 'Find homes, cars, and land faster. Save favorites and contact sellers directly.';
  const avatarCandidates = useMemo(
    () => [user?.profile?.avatar, emailAvatarUrl, getUiAvatar(fullName, userEmail)].filter(Boolean) as string[],
    [user?.profile?.avatar, emailAvatarUrl, fullName, userEmail]
  );
  const avatarUrl = avatarCandidates[avatarSourceIndex] || null;
  const isVerified = user?.emailVerified || false;
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

  // Last login — format as relative/absolute label
  const lastLoginAt = user?.lastLoginAt ? (() => {
    const d = new Date(user.lastLoginAt);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  })() : null;

  const profileName = fullName;
  const profileEmail = userEmail;
  const profileBio = userBio;

  useEffect(() => {
    setAvatarSourceIndex(0);
  }, [fullName, userEmail, userBio]);

  useEffect(() => {
    let isMounted = true;
    const buildEmailAvatar = async () => {
      const normalizedEmail = (userEmail || '').trim().toLowerCase();
      if (!normalizedEmail) {
        if (isMounted) setEmailAvatarUrl(null);
        return;
      }
      try {
        const md5 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, normalizedEmail);
        if (isMounted) {
          // Always derive an image from email hash.
          setEmailAvatarUrl(`https://www.gravatar.com/avatar/${md5}?s=200&d=identicon`);
        }
      } catch {
        if (isMounted) setEmailAvatarUrl(null);
      }
    };

    buildEmailAvatar();
    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth])
  );

  const C = Colors[scheme];
  const currentLanguage = languageOptions[languageIndex];

  useEffect(() => {
    // Keep skeleton disabled by default for a snappier profile open.
    setIsInitialLoading(false);
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Saved', value: '12' },
      { label: 'Deals', value: '8' },
      { label: 'Rating', value: '4.9' },
      { label: 'Last Login', value: lastLoginAt || '—' },
    ],
    [lastLoginAt]
  );

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/splash');
        },
      },
    ]);
  };

  const handleUploadProfileImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow photo library access to upload your profile image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.65,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      setIsUploadingAvatar(true);
      await authService.uploadProfileImage(result.assets[0].uri);
      await checkAuth();
      Alert.alert('Profile image updated', 'Your new profile photo has been saved.');
    } catch (error: any) {
      Alert.alert('Upload failed', error?.message || 'Could not upload profile image. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top', 'left', 'right']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="profile" />
      </SafeAreaView>
    );
  }

  const rows = {
    account: [
      {
        id: 'edit',
        label: 'Edit Profile',
        icon: 'create-outline',
        value: '',
        onPress: () => router.push('/profile/edit'),
      },
      {
        id: 'privacy',
        label: 'Privacy & Security',
        icon: 'shield-checkmark-outline',
        value: '',
        onPress: () => router.push('/profile/privacy-security'),
      },
      {
        id: 'favorites',
        label: 'Favorites',
        icon: 'heart-outline',
        value: '',
        onPress: () => router.push('/profile/favorites'),
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'notifications-outline',
        value: notificationsEnabled ? 'On' : 'Off',
        onPress: () => setNotificationsEnabled((current) => !current),
      },
    ],
    preferences: [
      {
        id: 'dark-mode',
        label: 'Dark Mode',
        icon: isDark ? 'moon-outline' : 'sunny-outline',
        value: isDark ? 'On' : 'Off',
        onPress: toggleTheme,
      },
      {
        id: 'language',
        label: 'Language',
        icon: 'language-outline',
        value: currentLanguage,
        onPress: () => setLanguageIndex((current) => (current + 1) % languageOptions.length),
      },
      {
        id: 'storage',
        label: 'Data & Storage',
        icon: 'cloud-outline',
        value: '1.2 GB',
        onPress: () => Alert.alert('Data & Storage', 'You are using 1.2 GB of local app data.'),
      },
    ],
    support: [
      {
        id: 'help',
        label: 'Help Center',
        icon: 'help-circle-outline',
        value: '',
        onPress: () => router.push('/search'),
      },
      {
        id: 'contact',
        label: 'Contact Us',
        icon: 'chatbubbles-outline',
        value: '',
        onPress: () => router.push('/chat'),
      },
    ],
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top', 'left', 'right']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 20 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topBar, { paddingTop: insets.top }]}>
          <View>
            <Text style={[styles.topTitle, { color: C.textMain }]}>Profile</Text>
            <Text style={[styles.topSubtitle, { color: C.textMuted }]}>Manage account, preferences, and support</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={toggleTheme}
              style={[styles.topIconBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
            >
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={14} color={isDark ? C.brandOrange : C.brandBlue} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/profile/favorites')}
              style={[styles.topIconBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
            >
              <Ionicons name="heart" size={14} color={C.brandOrange} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.heroCard, { backgroundColor: C.surface, borderColor: C.brandBorder, shadowColor: C.textMain }]}>
          <View style={styles.heroHeader}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setIsAvatarViewerOpen(true)} style={styles.avatarWrap}>
              {!avatarUrl ? (
                <View style={[styles.avatarFallback, { backgroundColor: C.tableRow }]}>
                  <Text style={[styles.avatarFallbackText, { color: C.textMain }]}>
                    {(profileName || userEmail || 'DU')
                      .split(' ')
                      .map((p: string) => p[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
              ) : (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                  onError={() => {
                    setAvatarSourceIndex((current) => {
                      const next = current + 1;
                      return next < avatarCandidates.length ? next : current;
                    });
                  }}
                />
              )}
              {isVerified && (
                <View style={[styles.verifiedBadge, { backgroundColor: C.brandBlue }]}>
                  <Ionicons name="checkmark" size={8} color="white" />
                </View>
              )}
              <View style={[styles.statusDot, { backgroundColor: notificationsEnabled ? '#1cc96c' : C.textMuted }]} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleUploadProfileImage}
              disabled={isUploadingAvatar}
              style={[styles.avatarEditBtn, { backgroundColor: C.brandBlue, borderColor: C.surface }]}
            >
              <Ionicons name={isUploadingAvatar ? 'sync' : 'camera'} size={10} color="#fff" />
            </TouchableOpacity>
            <View style={styles.heroMeta}>
              <Text style={[styles.name, { color: C.textMain }]} numberOfLines={1}>{profileName}</Text>
              <Text style={[styles.email, { color: C.textMuted }]} numberOfLines={1}>{profileEmail}</Text>
              {userPhone ? <Text style={[styles.email, { color: C.textMuted, marginTop: 2 }]} numberOfLines={1}>{userPhone}</Text> : null}
              <View style={styles.badgeRow}>
                <View style={[styles.statusPill, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                  <View style={[styles.onlinePillDot, { backgroundColor: notificationsEnabled ? '#1cc96c' : C.textMuted }]} />
                  <Text style={[styles.statusText, { color: C.textMain }]}>{notificationsEnabled ? 'Online' : 'Quiet mode'}</Text>
                </View>
                <View style={[styles.rolePill, { backgroundColor: C.brandBlue + '15' }]}>
                  <Text style={[styles.roleText, { color: C.brandBlue }]}>{userRole}</Text>
                </View>
              </View>
              {memberSince ? <Text style={[styles.memberSince, { color: C.textMuted }]}>Member since {memberSince}</Text> : null}
              {lastLoginAt ? (
                <View style={styles.lastLoginRow}>
                  <Ionicons name="time-outline" size={11} color={C.textMuted} />
                  <Text style={[styles.lastLoginText, { color: C.textMuted }]}>Last login: {lastLoginAt}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <Text style={[styles.bio, { color: C.textMuted }]}>{profileBio}</Text>

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={[styles.statCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                <Text style={[styles.statValue, { color: C.textMain }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: C.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <ProfileSectionCard title="Account" items={rows.account as any} colors={C} />
        <ProfileSectionCard
          title="Preferences"
          items={rows.preferences.map((item) => ({
            ...item,
            showToggle: item.id === 'dark-mode',
            toggleOn: item.id === 'dark-mode' ? isDark : false,
          })) as any}
          colors={C}
        />
        <ProfileSectionCard title="Support" items={rows.support as any} colors={C} />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleLogout}
          style={[styles.logoutBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
        >
          <Ionicons name="log-out-outline" size={16} color={C.brandOrange} />
          <Text style={[styles.logoutText, { color: C.textMain }]}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isAvatarViewerOpen} animationType="fade" transparent onRequestClose={() => setIsAvatarViewerOpen(false)}>
        <View style={styles.viewerOverlay}>
          <TouchableOpacity style={styles.viewerCloseBtn} onPress={() => setIsAvatarViewerOpen(false)} activeOpacity={0.9}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.viewerImage} resizeMode="contain" />
          ) : (
            <View style={styles.viewerFallback}>
              <Text style={styles.viewerFallbackText}>
                {(profileName || userEmail || 'DU')
                  .split(' ')
                  .map((p: string) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: 12, paddingTop: 8 },
  topBar: { paddingHorizontal: 2, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topTitle: { fontSize: 20, fontWeight: '900' },
  topSubtitle: { marginTop: 2, fontSize: 11 },
  topActions: { flexDirection: 'row', alignItems: 'center' },
  topIconBtn: { width: 34, height: 34, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  heroCard: { borderWidth: 1, borderRadius: 16, padding: 12, shadowOpacity: 0.07, elevation: 2 },
  heroHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { width: 64, height: 64, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  avatar: { width: '100%', height: '100%' },
  avatarEditBtn: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
    marginRight: 6,
  },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  avatarFallbackText: { fontSize: 18, fontWeight: '900' },
  statusDot: { position: 'absolute', right: 4, bottom: 4, width: 12, height: 12, borderRadius: 999, borderWidth: 2, borderColor: '#fff' },
  verifiedBadge: { position: 'absolute', left: -2, top: -2, width: 18, height: 18, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  heroMeta: { flex: 1, marginLeft: 12 },
  name: { fontSize: 18, fontWeight: '900' },
  email: { marginTop: 2, fontSize: 11 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  statusPill: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, height: 28, flexDirection: 'row', alignItems: 'center' },
  onlinePillDot: { width: 8, height: 8, borderRadius: 999 },
  statusText: { marginLeft: 6, fontSize: 10, fontWeight: '800' },
  rolePill: { borderRadius: 999, paddingHorizontal: 10, height: 28, justifyContent: 'center', alignItems: 'center' },
  roleText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  memberSince: { marginTop: 6, fontSize: 10, fontWeight: '600' },
  lastLoginRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  lastLoginText: { fontSize: 10, fontWeight: '600' },
  bio: { marginTop: 10, fontSize: 11, lineHeight: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 10, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '900' },
  statLabel: { marginTop: 2, fontSize: 10, fontWeight: '700' },
  sectionCard: { marginTop: 10, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingTop: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '900', marginBottom: 4 },
  rowItem: { paddingVertical: 12, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  rowLabel: { fontSize: 12, fontWeight: '800', flex: 1 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 10, fontWeight: '700', marginRight: 8 },
  toggle: { width: 34, height: 20, borderRadius: 999, padding: 2, justifyContent: 'center' },
  toggleKnob: { width: 16, height: 16, borderRadius: 999 },
  logoutBtn: { marginTop: 10, borderWidth: 1, borderRadius: 16, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logoutText: { marginLeft: 8, fontSize: 12, fontWeight: '900' },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  viewerCloseBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  viewerImage: {
    width: '100%',
    height: '72%',
  },
  viewerFallback: {
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerFallbackText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#111827',
  },
});
