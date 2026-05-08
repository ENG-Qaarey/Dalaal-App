import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  colors: any;
};

export default function HomeNearby({ items, onPress, onSeeAll, colors }: Props) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Nearby Properties</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress(item)}
            style={[styles.nearbyItem, { borderBottomColor: colors.brandBorder }]}
          >
            <Image source={{ uri: item.image }} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.nearbyTitle, { color: colors.textMain }]}>{item.title}</Text>
              <Text style={[styles.nearbyMeta, { color: colors.textMuted }]}>
                {item.location} • {item.beds}bd • {item.time}
              </Text>
              <Text style={[styles.nearbyPrice, { color: colors.textMain }]}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { marginTop: 6, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  seeAll: { fontWeight: '600' },
  nearbyItem: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, alignItems: 'center' },
  thumb: { width: 72, height: 56, borderRadius: 8, marginRight: 10 },
  nearbyTitle: { fontWeight: '700', fontSize: 12 },
  nearbyMeta: { fontSize: 10 },
  nearbyPrice: { marginTop: 2, fontWeight: '800', fontSize: 11 },
});
