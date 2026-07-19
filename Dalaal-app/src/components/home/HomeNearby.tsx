import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { sectionStyles } from './sectionStyles';
import { spacing, radius, fontSize } from '../../constants/tokens';

type NearbyItem = {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  time: string;
  image: string;
  agent: string;
  posterRole: string;
  posterVerified: boolean;
  posterRating: string;
};

type Props = {
  items: NearbyItem[];
  onPress: (item: NearbyItem) => void;
  onSeeAll: () => void;
  colors: ThemePalette;
};

export default function HomeNearby({ items, onPress, onSeeAll, colors }: Props) {
  return (
    <>
      <View style={sectionStyles.sectionHeader}>
        <Text style={[sectionStyles.sectionTitle, { color: colors.textMain }]}>Nearby Properties</Text>
        <TouchableOpacity onPress={onSeeAll} accessibilityRole="button">
          <Text style={[sectionStyles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          onPress={() => onPress(item)}
          accessibilityRole="button"
          accessibilityLabel={`View details for ${item.title}`}
          style={[
            styles.nearbyItem,
            {
              borderColor: colors.brandBorder,
              backgroundColor: colors.cardBg,
              ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null),
            },
          ]}
        >
          <Image source={{ uri: item.image }} style={styles.thumb} />
          <View style={styles.body}>
            <Text style={[styles.nearbyTitle, { color: colors.textMain }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.nearbyMeta, { color: colors.textMuted }]}>
              {item.location} • {item.beds}bd • {item.time}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={[styles.nearbyPrice, { color: colors.textMain }]}>{item.price}</Text>
              <View style={[styles.viewPill, { backgroundColor: colors.brandBlueSoft }]}>
                <Text style={[styles.viewPillText, { color: colors.brandBlue }]}>View Details</Text>
                <Ionicons name="arrow-forward" size={12} color={colors.brandBlue} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  nearbyItem: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  thumb: { width: 88, height: 72, borderRadius: radius.md, marginRight: spacing.sm },
  body: { flex: 1 },
  nearbyTitle: { fontWeight: '700', fontSize: fontSize.small },
  nearbyMeta: { fontSize: fontSize.caption, marginTop: 2 },
  bottomRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  nearbyPrice: { fontWeight: '800', fontSize: fontSize.small },
  viewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  viewPillText: { fontSize: 11, fontWeight: '800' },
});
