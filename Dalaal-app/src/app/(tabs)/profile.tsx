import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';

const languageOptions = ['English', 'Somali'];

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(colorScheme === 'dark' ? 'dark' : 'light');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('Dalaal User');
  const [profileEmail, setProfileEmail] = useState('user@dalaal.so');
  const [profileBio, setProfileBio] = useState('Find homes, cars, and land faster. Save favorites and contact sellers directly.');

  const C = Colors[themeMode];
  const isDark = themeMode === 'dark';
  const currentLanguage = languageOptions[languageIndex];

  const stats = useMemo(
    () => [
      { label: 'Saved', value: '12' },
      { label: 'Deals', value: '8' },
      { label: 'Rating', value: '4.9' },
    ],
    []
  );

  const rows = {
    account: [
      {
        id: 'edit',
        label: isEditing ? 'Close Editor' : 'Edit Profile',
        icon: 'create-outline',
        value: '',
        onPress: () => setIsEditing((current) => !current),
      },
      {
        id: 'privacy',
        label: 'Privacy & Security',
        icon: 'shield-checkmark-outline',
        value: '',
        onPress: () => Alert.alert('Privacy & Security', 'Your account uses secure sign-in and protected data settings.'),
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
        onPress: () => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark')),
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
              onPress={() => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))}
              style={[styles.topIconBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
            >
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={14} color={isDark ? C.brandOrange : C.brandBlue} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/favorites')}
              style={[styles.topIconBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
            >
              <Ionicons name="heart" size={14} color={C.brandOrange} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.heroCard, { backgroundColor: C.surface, borderColor: C.brandBorder, shadowColor: C.textMain }]}>
          <View style={styles.heroHeader}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: 'https://i.pravatar.cc/180?img=14' }} style={styles.avatar} />
              <View style={[styles.statusDot, { backgroundColor: C.brandOrange }]} />
            </View>
            <View style={styles.heroMeta}>
              <Text style={[styles.name, { color: C.textMain }]} numberOfLines={1}>{profileName}</Text>
              <Text style={[styles.email, { color: C.textMuted }]} numberOfLines={1}>{profileEmail}</Text>
              <View style={[styles.statusPill, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                <View style={[styles.onlinePillDot, { backgroundColor: notificationsEnabled ? '#1cc96c' : C.textMuted }]} />
                <Text style={[styles.statusText, { color: C.textMain }]}>{notificationsEnabled ? 'Online' : 'Quiet mode'}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.bio, { color: C.textMuted }]}>{profileBio}</Text>

          {isEditing ? (
            <View style={styles.editorBox}>
              <TextInput
                value={profileName}
                onChangeText={setProfileName}
                placeholder="Full name"
                placeholderTextColor={C.textMuted}
                style={[styles.input, { color: C.textMain, backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              />
              <TextInput
                value={profileEmail}
                onChangeText={setProfileEmail}
                placeholder="Email"
                placeholderTextColor={C.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[styles.input, { color: C.textMain, backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              />
              <TextInput
                value={profileBio}
                onChangeText={setProfileBio}
                placeholder="Bio"
                placeholderTextColor={C.textMuted}
                multiline
                style={[styles.textArea, { color: C.textMain, backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
              />
              <View style={styles.editorActions}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setIsEditing(false)}
                  style={[styles.editorBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
                >
                  <Text style={[styles.editorBtnText, { color: C.textMain }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setIsEditing(false);
                    Alert.alert('Profile Saved', 'Your profile details were updated on this screen.');
                  }}
                  style={[styles.editorBtn, { backgroundColor: C.brandBlue }]}
                >
                  <Text style={[styles.editorBtnText, { color: C.surface }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={[styles.statCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                <Text style={[styles.statValue, { color: C.textMain }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: C.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Account</Text>
          {rows.account.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={item.onPress}
              style={[styles.rowItem, { borderBottomColor: C.brandBorder }]}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: C.tableRow }]}>
                  <Ionicons name={item.icon as any} size={15} color={C.textMain} />
                </View>
                <Text style={[styles.rowLabel, { color: C.textMain }]}>{item.label}</Text>
              </View>
              <View style={styles.rowRight}>
                {item.value ? <Text style={[styles.rowValue, { color: C.textMuted }]}>{item.value}</Text> : null}
                <Ionicons name="chevron-forward" size={14} color={C.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Preferences</Text>
          {rows.preferences.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={item.onPress}
              style={[styles.rowItem, { borderBottomColor: C.brandBorder }]}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: C.tableRow }]}>
                  <Ionicons name={item.icon as any} size={15} color={C.textMain} />
                </View>
                <Text style={[styles.rowLabel, { color: C.textMain }]}>{item.label}</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={[styles.rowValue, { color: C.textMuted }]}>{item.value}</Text>
                {item.id === 'dark-mode' ? (
                  <View style={[styles.toggle, { backgroundColor: isDark ? C.brandBlue : C.brandBorder }]}>
                    <View style={[styles.toggleKnob, { backgroundColor: C.surface, alignSelf: isDark ? 'flex-end' : 'flex-start' }]} />
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={14} color={C.textMuted} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.sectionCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Support</Text>
          {rows.support.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={item.onPress}
              style={[styles.rowItem, { borderBottomColor: C.brandBorder }]}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: C.tableRow }]}>
                  <Ionicons name={item.icon as any} size={15} color={C.textMain} />
                </View>
                <Text style={[styles.rowLabel, { color: C.textMain }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.replace('/login')}
          style={[styles.logoutBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}
        >
          <Ionicons name="log-out-outline" size={16} color={C.brandOrange} />
          <Text style={[styles.logoutText, { color: C.textMain }]}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  statusDot: { position: 'absolute', right: 4, bottom: 4, width: 12, height: 12, borderRadius: 999, borderWidth: 2, borderColor: '#fff' },
  heroMeta: { flex: 1, marginLeft: 12 },
  name: { fontSize: 18, fontWeight: '900' },
  email: { marginTop: 2, fontSize: 11 },
  statusPill: { marginTop: 8, alignSelf: 'flex-start', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, height: 28, flexDirection: 'row', alignItems: 'center' },
  onlinePillDot: { width: 8, height: 8, borderRadius: 999 },
  statusText: { marginLeft: 6, fontSize: 10, fontWeight: '800' },
  bio: { marginTop: 10, fontSize: 11, lineHeight: 16 },
  editorBox: { marginTop: 10, gap: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 40, fontSize: 12 },
  textArea: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingTop: 10, minHeight: 72, fontSize: 12, textAlignVertical: 'top' },
  editorActions: { flexDirection: 'row', gap: 8, marginTop: 2 },
  editorBtn: { flex: 1, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  editorBtnText: { fontSize: 11, fontWeight: '900' },
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
});
