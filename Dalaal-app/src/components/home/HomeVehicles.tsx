import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  colors: any;
  scheme: 'light' | 'dark';
};

export default function HomeVehicles({ items, onPress, onSeeAll, colors, scheme }: Props) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textMain }]}>Popular Vehicles</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.brandBlue }]}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 4 }}>
        {items.map((v) => (
          <TouchableOpacity
            key={v.id}
            activeOpacity={0.92}
            onPress={() => onPress(v)}
            style={[
              styles.vehicleCard,
              {
                backgroundColor: scheme === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.85)',
                borderColor: colors.brandBorder
              }
            ]}
          >
            <Image source={{ uri: v.image }} style={styles.smallThumb} />
            <Text style={[styles.vehicleTitle, { color: colors.textMain }]}>{v.title}</Text>
            <Text style={[styles.vehiclePrice, { color: colors.textMuted }]}>{v.price}</Text>
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
  vehicleCard: { width: 110, height: 96, borderRadius: 10, marginLeft: 14, padding: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  smallThumb: { width: 80, height: 46, borderRadius: 8, marginBottom: 4 },
  vehicleTitle: { fontWeight: '700', fontSize: 11 },
  vehiclePrice: { fontSize: 10 },
});
