import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { spacing, radius, fontSize } from '../../constants/tokens';

type Props = {
  userAvatar?: string;
  onProfilePress: () => void;
  onNotificationsPress: () => void;
  colors: ThemePalette;
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
          style={{ marginRight: spacing.md }}
        >
          <Ionicons name="notifications-outline" size={fontSize.body} color={colors.textMain} />
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
  headerRow: { height: spacing.massive, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: spacing.sm, fontWeight: '700', fontSize: fontSize.small },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileBtn: { width: spacing.massive, height: spacing.massive, borderRadius: radius.full, overflow: 'hidden' },
  profileAvatar: { width: '100%', height: '100%', borderRadius: radius.full, borderWidth: 1 },
});
