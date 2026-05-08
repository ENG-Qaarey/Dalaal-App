import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.58) + 10;

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
  colors: any;
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
  scheme,
}: Props) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Featured</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        showsHorizontalScrollIndicator={false}
        style={{ paddingVertical: 4 }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
          onScrollEnd(idx);
        }}
      >
        {items.map((f) => (
          <TouchableOpacity
            key={f.id}
            activeOpacity={0.92}
            onPress={() => onPress(f)}
            style={[
              styles.featuredCard,
              {
                backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)',
                borderColor: colors.brandBorder,
              },
            ]}
          >
            <Image source={{ uri: f.image }} style={styles.cardImage} />
            <View style={styles.cardRow}>
              <Text style={[styles.cardPrice, { color: colors.textMain }]}>{f.price}</Text>
              <Text style={[styles.cardMetaRight, { color: colors.textMuted }]}>{f.location}</Text>
            </View>
            <Text style={[styles.cardTitle, { color: colors.textMain }]}>{f.title}</Text>
            <Text style={[styles.cardMeta, { color: colors.textMuted }]}>
              {f.beds ? `${f.beds} bd • ${f.baths} ba` : f.year ?? ''}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.agentText, { color: colors.textMuted }]} numberOfLines={1}>
                👤 {f.agent} ✓
              </Text>
              <TouchableOpacity onPress={onChatPress} activeOpacity={0.9}>
                <Text style={styles.msgText}>💬</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.dotsRow}>
        {items.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: activeIdx === i ? colors.brandOrange : colors.brandBorder,
                width: activeIdx === i ? 18 : 8,
              },
            ]}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { marginTop: 6, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  seeAll: { fontWeight: '600' },
  featuredCard: {
    width: CARD_WIDTH,
    marginLeft: 14,
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowOpacity: 0.07,
    borderWidth: 1,
  },
  cardImage: { height: 100, borderRadius: 10, marginBottom: 6, width: '100%' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontWeight: '900', fontSize: 13 },
  cardMetaRight: { fontSize: 10 },
  cardTitle: { fontSize: 13, fontWeight: '800', marginTop: 4 },
  cardMeta: { fontSize: 10, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  agentText: { fontSize: 11 },
  msgText: { fontSize: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  dot: { height: 7, borderRadius: 4, marginHorizontal: 5 },
});
