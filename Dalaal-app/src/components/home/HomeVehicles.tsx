import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { sectionStyles } from './sectionStyles';
import { spacing, radius, fontSize } from '../../constants/tokens';
import { useWebLayout } from '../../hooks/useWebLayout';

type VehicleItem = {
  id: string;
  title: string;
  price: string;
  image: string;
  agent: string;
  posterRole: string;
  posterVerified: boolean;
  posterRating: string;
};

type Props = {
  items: VehicleItem[];
  onPress: (item: VehicleItem) => void;
  onSeeAll: () => void;
  colors: ThemePalette;
  scheme: 'light' | 'dark';
};

export default function HomeVehicles({ items, onPress, onSeeAll, colors }: Props) {
  const { isWideScreen } = useWebLayout();
  const cardWidth = isWideScreen ? 180 : 140;

  return (
    <>
      <View style={sectionStyles.sectionHeader}>
        <Text style={[sectionStyles.sectionTitle, { color: colors.textMain }]}>Popular Vehicles</Text>
        <TouchableOpacity onPress={onSeeAll} accessibilityRole="button">
          <Text style={[sectionStyles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: spacing.xs }}
        contentContainerStyle={isWideScreen ? { paddingRight: spacing.lg } : undefined}
      >
        {items.map((v) => (
          <TouchableOpacity
            key={v.id}
            activeOpacity={0.92}
            onPress={() => onPress(v)}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${v.title}`}
            style={[
              styles.vehicleCard,
              {
                width: cardWidth,
                backgroundColor: colors.cardBg,
                borderColor: colors.brandBorder,
                ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null),
              },
            ]}
          >
            <Image source={{ uri: v.image }} style={[styles.smallThumb, { height: isWideScreen ? 90 : 64 }]} />
            <Text style={[styles.vehicleTitle, { color: colors.textMain }]} numberOfLines={1}>
              {v.title}
            </Text>
            <Text style={[styles.vehiclePrice, { color: colors.textMuted }]}>{v.price}</Text>
            <View style={[styles.viewRow, { backgroundColor: colors.brandBlueSoft }]}>
              <Text style={[styles.viewText, { color: colors.brandBlue }]}>View Details</Text>
              <Ionicons name="arrow-forward" size={12} color={colors.brandBlue} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  vehicleCard: {
    borderRadius: radius.lg,
    marginLeft: spacing.lg,
    padding: spacing.sm,
    borderWidth: 1,
  },
  smallThumb: {
    width: '100%',
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  vehicleTitle: { fontWeight: '800', fontSize: fontSize.small },
  vehiclePrice: { fontSize: fontSize.caption, marginTop: 2 },
  viewRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  viewText: { fontSize: 11, fontWeight: '800' },
});
