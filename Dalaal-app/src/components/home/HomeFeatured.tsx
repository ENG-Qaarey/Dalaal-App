import React from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { sectionStyles } from './sectionStyles';
import { spacing, radius, fontSize } from '../../constants/tokens';
import { useWebLayout } from '../../hooks/useWebLayout';

const { width: windowWidth } = Dimensions.get('window');
const MOBILE_CARD_WIDTH = Math.round(windowWidth * 0.58) + 10;

type FeaturedItem = {
  id: string;
  price: string;
  title: string;
  location: string;
  agent: string;
  posterRole: string;
  posterVerified: boolean;
  posterRating: string;
  image: string;
  year?: number;
  beds?: number;
  baths?: number;
};

type Props = {
  items: FeaturedItem[];
  activeIdx: number;
  onScrollEnd: (index: number) => void;
  onPress: (item: FeaturedItem) => void;
  onChatPress: () => void;
  onSeeAll: () => void;
  colors: ThemePalette;
  scheme: 'light' | 'dark';
};

export default function HomeFeatured({
  items,
  activeIdx,
  onScrollEnd,
  onPress,
  onChatPress,
  onSeeAll,
  colors,
}: Props) {
  const { isWideScreen } = useWebLayout();
  const cardWidth = isWideScreen ? 320 : MOBILE_CARD_WIDTH;
  const imageHeight = isWideScreen ? 168 : 110;

  return (
    <>
      <View style={sectionStyles.sectionHeader}>
        <Text style={[sectionStyles.sectionTitle, { color: colors.textMain }]}>Featured</Text>
        <TouchableOpacity onPress={onSeeAll} accessibilityRole="button">
          <Text style={[sectionStyles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        pagingEnabled={!isWideScreen}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: spacing.xs }}
        contentContainerStyle={isWideScreen ? { paddingRight: spacing.lg } : undefined}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
          onScrollEnd(idx);
        }}
      >
        {items.map((f) => (
          <View
            key={f.id}
            style={[
              styles.featuredCard,
              {
                width: cardWidth,
                backgroundColor: colors.cardBg,
                borderColor: colors.brandBorder,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => onPress(f)}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${f.title}`}
              style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : undefined}
            >
              <View style={styles.imageWrap}>
                <Image source={{ uri: f.image }} style={[styles.cardImage, { height: imageHeight }]} />
                <View style={[styles.priceBadge, { backgroundColor: colors.brandBlue }]}>
                  <Text style={[styles.priceBadgeText, { color: colors.surface }]}>{f.price}</Text>
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: colors.textMain }]} numberOfLines={1}>
                {f.title}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                <Text style={[styles.cardMetaRight, { color: colors.textMuted }]} numberOfLines={1}>
                  {f.location}
                </Text>
                <Text style={[styles.cardMetaDot, { color: colors.textMuted }]}>•</Text>
                <Text style={[styles.cardMeta, { color: colors.textMuted }]}>
                  {f.beds ? `${f.beds} bd • ${f.baths} ba` : f.year ?? ''}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.cardFooter}>
              <View style={styles.agentRow}>
                <Ionicons name="person-outline" size={fontSize.caption} color={colors.textMuted} />
                <Text style={[styles.agentText, { color: colors.textMuted }]} numberOfLines={1}>
                  {f.agent}
                </Text>
                {f.posterVerified && (
                  <Ionicons name="checkmark-circle" size={fontSize.caption} color={colors.brandBlue} />
                )}
              </View>
              <TouchableOpacity
                onPress={onChatPress}
                activeOpacity={0.9}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="chatbubble-outline" size={fontSize.small} color={colors.brandBlue} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onPress(f)}
              style={[
                styles.viewDetailsBtn,
                {
                  backgroundColor: colors.brandBlue,
                  ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : null),
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`View details for ${f.title}`}
            >
              <Text style={[styles.viewDetailsText, { color: colors.surface }]}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.surface} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {!isWideScreen && (
        <View style={styles.dotsRow}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: activeIdx === i ? colors.brandOrange : colors.brandBorder,
                  width: activeIdx === i ? spacing.xl : spacing.sm,
                },
              ]}
            />
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  featuredCard: {
    marginLeft: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.sm,
    elevation: 3,
    shadowColor: '#16223a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
  },
  imageWrap: {
    position: 'relative',
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  cardImage: { borderRadius: radius.md, width: '100%' },
  priceBadge: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  priceBadgeText: { fontWeight: '900', fontSize: fontSize.caption },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  cardMetaRight: { fontSize: fontSize.caption, flexShrink: 1 },
  cardMetaDot: { fontSize: fontSize.caption },
  cardTitle: { fontSize: fontSize.small, fontWeight: '800' },
  cardMeta: { fontSize: fontSize.caption },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  agentText: { fontSize: fontSize.caption },
  viewDetailsBtn: {
    marginTop: spacing.sm,
    height: 36,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  viewDetailsText: { fontSize: fontSize.caption, fontWeight: '800' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  dot: { height: spacing.sm, borderRadius: radius.sm, marginHorizontal: spacing.xs + 1 },
});
