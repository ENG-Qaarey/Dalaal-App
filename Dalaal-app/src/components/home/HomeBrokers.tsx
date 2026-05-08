import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  colors: any;
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
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Top Brokers</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 4 }}>
        {items.map((b) => (
          <TouchableOpacity
            key={b.id}
            activeOpacity={0.9}
            onPress={() => onPress(b.name)}
            style={[
              styles.brokerCard,
              {
                backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)',
                borderColor: colors.brandBorder,
                shadowColor: b.accent,
              },
            ]}
          >
            <View style={styles.brokerTopRow}>
              <View style={styles.brokerAvatarWrap}>
                <Image source={{ uri: b.avatar }} style={styles.brokerAvatar} />
                <View style={[styles.brokerStatusDot, { backgroundColor: b.accent }]} />
              </View>
              <View style={[styles.brokerRankPill, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}>
                <Ionicons name="star" size={11} color={b.accent} />
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
              <Ionicons name="chatbubbles" size={12} color={colors.surface} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { marginTop: 6, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  seeAll: { fontWeight: '600' },
  brokerCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 11,
    marginTop: 8,
    marginRight: 10,
    shadowOpacity: 0.09,
    elevation: 3,
    width: 140,
  },
  brokerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  brokerAvatarWrap: { width: 42, height: 42, borderRadius: 13, overflow: 'hidden', position: 'relative' },
  brokerAvatar: { width: '100%', height: '100%' },
  brokerStatusDot: { position: 'absolute', right: 2, bottom: 2, width: 9, height: 9, borderRadius: 999, borderWidth: 2, borderColor: '#fff' },
  brokerRankPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 999, borderWidth: 1, paddingHorizontal: 7, height: 22 },
  brokerRankText: { marginLeft: 4, fontSize: 10, fontWeight: '900' },
  brokerName: { fontWeight: '900', fontSize: 14, marginTop: 2 },
  brokerRole: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  brokerMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  brokerMetaText: { fontSize: 10, fontWeight: '600', flexShrink: 1 },
  brokerMetaDot: { marginHorizontal: 5, fontSize: 10 },
  brokerAction: { marginTop: 10, height: 28, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  brokerActionText: { fontSize: 10, fontWeight: '900', marginRight: 6 },
});
