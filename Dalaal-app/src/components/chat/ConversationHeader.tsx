import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

type Props = {
  colors: any;
  userName: string;
  userRole?: string;
  isOnline: boolean;
  onBack: () => void;
};

export default function ConversationHeader({ colors, userName, userRole, isOnline, onBack }: Props) {
  const [isCallMenuOpen, setIsCallMenuOpen] = React.useState(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const buildAvatar = async () => {
      const normalized = `${userName}@dalaal.chat`.toLowerCase();
      try {
        const md5 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, normalized);
        if (mounted) {
          setAvatarUrl(`https://www.gravatar.com/avatar/${md5}?s=120&d=identicon`);
        }
      } catch {
        if (mounted) setAvatarUrl(null);
      }
    };
    buildAvatar();
    return () => {
      mounted = false;
    };
  }, [userName]);

  return (
    <View style={[styles.header, { borderBottomColor: colors.brandBorder }]}>
      <TouchableOpacity onPress={onBack} style={[styles.backBtn, { backgroundColor: colors.tableRow }]}>
        <Ionicons name="arrow-back" size={16} color={colors.textMain} />
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <View style={styles.avatarWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.tableRow }]}>
              <Text style={[styles.avatarFallbackText, { color: colors.textMain }]}>{userName.slice(0, 1).toUpperCase()}</Text>
            </View>
          )}
          <View style={[styles.onlineDot, { backgroundColor: isOnline ? '#1cc96c' : colors.textMuted }]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.userName, { color: colors.textMain }]} numberOfLines={1}>
            {userName}
          </Text>
          <Text style={[styles.userMeta, { color: colors.textMuted }]} numberOfLines={1}>
            {isOnline ? 'Online' : 'Offline'}
            {userRole ? ` • ${userRole}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.callArea}>
        <TouchableOpacity
          onPress={() => setIsCallMenuOpen((v) => !v)}
          style={[styles.callBtn, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}
        >
          <Ionicons name="call-outline" size={15} color={colors.textMain} />
          <Text style={[styles.callBtnText, { color: colors.textMain }]}>Call</Text>
          <Ionicons name={isCallMenuOpen ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMain} />
        </TouchableOpacity>
        {isCallMenuOpen ? (
          <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.brandBorder }]}>
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => {
                setIsCallMenuOpen(false);
                Alert.alert('Audio Call', `Starting audio call with ${userName}...`);
              }}
            >
              <Ionicons name="call" size={14} color={colors.brandBlue} />
              <Text style={[styles.dropdownText, { color: colors.textMain }]}>Audio Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownRow}
              onPress={() => {
                setIsCallMenuOpen(false);
                Alert.alert('Video Call', `Starting video call with ${userName}...`);
              }}
            >
              <Ionicons name="videocam" size={14} color={colors.brandBlue} />
              <Text style={[styles.dropdownText, { color: colors.textMain }]}>Video Call</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 68, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8 },
  backBtn: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 2 },
  avatarWrap: { width: 38, height: 38, borderRadius: 13, overflow: 'hidden', marginRight: 9, position: 'relative' },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  avatarFallbackText: { fontSize: 14, fontWeight: '900' },
  onlineDot: { position: 'absolute', right: 2, bottom: 2, width: 8, height: 8, borderRadius: 999, borderWidth: 1.5, borderColor: '#fff' },
  userName: { fontSize: 13, fontWeight: '900' },
  userMeta: { fontSize: 10, marginTop: 1 },
  callArea: { position: 'relative' },
  callBtn: {
    minWidth: 84,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  callBtnText: { marginHorizontal: 6, fontSize: 12, fontWeight: '800' },
  dropdown: {
    position: 'absolute',
    top: 38,
    right: 0,
    width: 144,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    zIndex: 10,
    shadowOpacity: 0.12,
    elevation: 3,
  },
  dropdownRow: { height: 36, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' },
  dropdownText: { marginLeft: 8, fontSize: 12, fontWeight: '700' },
});
