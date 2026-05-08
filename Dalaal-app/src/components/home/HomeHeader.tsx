import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  userAvatar?: string;
  onProfilePress: () => void;
  onNotificationsPress: () => void;
  colors: any;
};

export default function HomeHeader({
  userAvatar,
  onProfilePress,
  onNotificationsPress,
  colors,
}: Props) {
  const FALLBACK_AVATAR = 'https://i.pravatar.cc/160?img=14';

  return (
    <View style={styles.headerRow}>
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={18} color={colors.brandOrange} />
        <Text style={[styles.locationText, { color: colors.textMain }]}>Dalaal-Prime</Text>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity
          onPress={onNotificationsPress}
          activeOpacity={0.8}
          style={{ marginRight: 12 }}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.textMain} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.85} style={styles.profileBtn}>
          <Image
            source={{ uri: userAvatar || FALLBACK_AVATAR }}
            style={[styles.profileAvatar, { borderColor: colors.brandBorder }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { height: 50, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 7, fontWeight: '700', fontSize: 13 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileBtn: { width: 30, height: 30, borderRadius: 999, overflow: 'hidden' },
  profileAvatar: { width: '100%', height: '100%', borderRadius: 999, borderWidth: 1 },
});
