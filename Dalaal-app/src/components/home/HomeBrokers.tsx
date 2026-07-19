import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { sectionStyles } from './sectionStyles';
import { spacing, radius, fontSize } from '../../constants/tokens';

type BrokerItem = {
  id: string;
  name: string;
  role: string;
  stat: string;
  reviews: string;
  listings: string;
  avatar: string;
  accent: string;
};

type Props = {
  items: BrokerItem[];
  onPress: (name: string) => void;
  onContactPress: () => void;
  onSeeAll: () => void;
  colors: ThemePalette;
  scheme: 'light' | 'dark';
};

export default function HomeBrokers({
  items,
  onPress,
  onContactPress,
  onSeeAll,
  colors,
  scheme,
}: Props) {
  return (
    <>
      <View style={sectionStyles.sectionHeader}>
        <Text style={[sectionStyles.sectionTitle, { color: colors.textMain }]}>Top Brokers</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[sectionStyles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: spacing.xs }}>
        {items.map((b) => (
          <TouchableOpacity
            key={b.id}
            activeOpacity={0.9}
            onPress={() => onPress(b.name)}
            style={[
              styles.brokerCard,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.brandBorder,
                shadowColor: b.accent,
              },
            ]}
          >
            <View style={styles.brokerTopRow}>
              <View style={styles.brokerAvatarWrap}>
                <Image source={{ uri: b.avatar }} style={styles.brokerAvatar} />
                <View style={[styles.brokerStatusDot, { backgroundColor: b.accent, borderColor: colors.surface }]} />
              </View>
              <View style={[styles.brokerRankPill, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}>
                <Ionicons name="star" size={fontSize.caption} color={b.accent} />
                <Text style={[styles.brokerRankText, { color: colors.textMain }]}>{b.stat}</Text>
              </View>
            </View>
            <Text style={[styles.brokerName, { color: colors.textMain }]} numberOfLines={1}>{b.name}</Text>
            <Text style={[styles.brokerRole, { color: colors.textMuted }]} numberOfLines={1}>{b.role}</Text>
            <View style={styles.brokerMetaRow}>
              <Text style={[styles.brokerMetaText, { color: colors.textMuted }]} numberOfLines={1}>
                {b.reviews}
              </Text>
              <Text style={[styles.brokerMetaDot, { color: colors.brandBorder }]}>•</Text>
              <Text style={[styles.brokerMetaText, { color: colors.textMuted }]} numberOfLines={1}>
                {b.listings}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onContactPress}
              style={[styles.brokerAction, { backgroundColor: b.accent }]}
            >
              <Text style={[styles.brokerActionText, { color: colors.surface }]}>Contact</Text>
              <Ionicons name="chatbubbles" size={fontSize.caption} color={colors.surface} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  brokerCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginRight: spacing.sm,
    shadowOpacity: 0.09,
    elevation: 3,
    width: 140,
  },
  brokerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  brokerAvatarWrap: { width: spacing.massive, height: spacing.massive, borderRadius: radius.md, overflow: 'hidden', position: 'relative' },
  brokerAvatar: { width: '100%', height: '100%' },
  brokerStatusDot: { position: 'absolute', right: spacing.xs, bottom: spacing.xs, width: spacing.sm, height: spacing.sm, borderRadius: radius.full, borderWidth: 2 },
  brokerRankPill: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.full, borderWidth: 1, paddingHorizontal: spacing.sm, height: spacing.xl },
  brokerRankText: { marginLeft: spacing.xs, fontSize: fontSize.caption, fontWeight: '900' },
  brokerName: { fontWeight: '900', fontSize: fontSize.small, marginTop: spacing.xs },
  brokerRole: { fontSize: fontSize.caption, fontWeight: '700', marginTop: spacing.xs },
  brokerMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs + 1 },
  brokerMetaText: { fontSize: fontSize.caption, fontWeight: '600', flexShrink: 1 },
  brokerMetaDot: { marginHorizontal: spacing.xs + 1, fontSize: fontSize.caption },
  brokerAction: { marginTop: spacing.sm, height: spacing.md + spacing.sm + spacing.xs, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  brokerActionText: { fontSize: fontSize.caption, fontWeight: '900', marginRight: spacing.sm },
});
