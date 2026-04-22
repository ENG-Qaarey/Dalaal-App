import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = Math.round(width * 0.72) + 16;

const categories = [
  { key: 'houses', label: 'Houses', icon: 'home' },
  { key: 'cars', label: 'Cars', icon: 'car' },
  { key: 'apts', label: 'Apts', icon: 'business' },
  { key: 'land', label: 'Land', icon: 'planet' },
  { key: 'comm', label: 'Comm', icon: 'cube' },
  { key: 'vehi', label: 'Vehi', icon: 'car-sport' },
];

const featured = [
  { id: '1', price: '$150,000', title: 'Modern Villa', location: 'Hodan', beds: 4, baths: 3, agent: 'Ahmed' },
  { id: '2', price: '$35,000', title: 'Toyota Land', location: 'Waberi', year: 2020, agent: 'Fatima' },
  { id: '3', price: '$80,000', title: 'Prime Land', location: 'Yaqshid', agent: 'Omar' },
];

const nearby = [
  { id: 'n1', title: '4BR Villa, Secure Compound', location: 'Hodan', price: '$120,000', beds: 4, baths: 3, time: '2 days ago' },
  { id: 'n2', title: '3BR Apt, New Building', location: 'Waberi', price: '$85,000', beds: 3, baths: 2, time: '5 hours ago' },
];

export default function HomeScreen() {
  const [activeIdx, setActiveIdx] = useState(0);
  const featuredRef = useRef<ScrollView | null>(null);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color="#FF8C00" />
          <Text style={styles.locationText}>Mogadishu ▼</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={20} color="#222" style={{ marginRight: 12 }} />
          <Ionicons name="person-circle-outline" size={22} color="#222" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
          <Text style={styles.searchPlaceholder}>Search properties, vehicles...</Text>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <TouchableOpacity key={c.key} style={styles.categoryItem} onPress={() => router.push(`/search?category=${c.key}`)}>
              <View style={styles.categoryIcon}><Ionicons name={c.icon as any} size={22} color="#fff" /></View>
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <TouchableOpacity onPress={() => router.push('/featured')}><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <ScrollView
          ref={(r) => (featuredRef.current = r)}
          horizontal
          pagingEnabled
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH}
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: 8 }}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
            setActiveIdx(idx);
          }}
        >
          {featured.map((f) => (
            <View key={f.id} style={styles.featuredCard}>
              <View style={styles.cardImage} />
              <View style={styles.cardRow}>
                <Text style={styles.cardPrice}>{f.price}</Text>
                <Text style={styles.cardMetaRight}>{f.location}</Text>
              </View>
              <Text style={styles.cardTitle}>{f.title}</Text>
              <Text style={styles.cardMeta}>{f.beds ? `${f.beds} bd • ${f.baths} ba` : f.year ?? ''}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.agentText}>👤 {f.agent} ✓</Text>
                <TouchableOpacity onPress={() => router.push(`/listings/${f.id}`)}>
                  <Text style={styles.msgText}>💬</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotsRow}>
          {featured.map((_, i) => (
            <View key={i} style={[styles.dot, activeIdx === i && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Properties</Text>
          <TouchableOpacity onPress={() => router.push('/nearby')}><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <FlatList
          data={nearby}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.nearbyItem}>
              <View style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.nearbyTitle}>{item.title}</Text>
                <Text style={styles.nearbyMeta}>{item.location} • {item.beds}bd • {item.time}</Text>
                <Text style={styles.nearbyPrice}>{item.price}</Text>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Vehicles</Text>
          <TouchableOpacity onPress={() => router.push('/vehicles')}><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 8 }}>
          <View style={styles.vehicleCard}><View style={styles.smallThumb} /><Text style={styles.vehicleTitle}>Hilux</Text><Text style={styles.vehiclePrice}>$28K</Text></View>
          <View style={styles.vehicleCard}><View style={styles.smallThumb} /><Text style={styles.vehicleTitle}>Patrol</Text><Text style={styles.vehiclePrice}>$42K</Text></View>
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Brokers</Text>
          <TouchableOpacity onPress={() => router.push('/brokers')}><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>

        <View style={styles.brokersRow}>
          <View style={styles.broker}><View style={styles.avatar} /><Text style={styles.brokerName}>Ahmed</Text><Text style={styles.brokerStat}>4.9⭐ • 47</Text></View>
          <View style={styles.broker}><View style={styles.avatar} /><Text style={styles.brokerName}>Fatima</Text><Text style={styles.brokerStat}>4.8⭐ • 32</Text></View>
          <View style={styles.broker}><View style={styles.avatar} /><Text style={styles.brokerName}>Omar</Text><Text style={styles.brokerStat}>4.7⭐ • 28</Text></View>
        </View>

        <View style={styles.howRow}>
          <Text style={styles.howTitle}>How It Works</Text>
          <View style={styles.howSteps}><Text style={styles.step}>🔍</Text><Text style={styles.chev}>──▶</Text><Text style={styles.step}>💬</Text><Text style={styles.chev}>──▶</Text><Text style={styles.step}>🤝</Text></View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { paddingBottom: 80 },
  headerRow: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 8, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  searchRow: { margin: 16, backgroundColor: '#f2f2f2', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  searchPlaceholder: { color: '#888' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },
  categoryItem: { width: '30%', marginVertical: 10, alignItems: 'center' },
  categoryIcon: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#FF8C00', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryLabel: { fontSize: 12, fontWeight: '600' },
  sectionHeader: { marginTop: 8, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  seeAll: { color: '#007aff', fontWeight: '600' },
  featuredCard: { width: Math.round(width * 0.72), marginLeft: 16, backgroundColor: '#fff', borderRadius: 14, padding: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08 },
  cardImage: { height: 140, backgroundColor: '#e9e9f0', borderRadius: 10, marginBottom: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontWeight: '900', fontSize: 16 },
  cardMetaRight: { color: '#777', fontSize: 12 },
  cardTitle: { color: '#222', fontSize: 16, fontWeight: '800', marginTop: 6 },
  cardMeta: { color: '#888', fontSize: 12, marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  agentText: { color: '#666' },
  msgText: { fontSize: 18 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', marginHorizontal: 6 },
  dotActive: { backgroundColor: '#FF8C00', width: 18 },
  nearbyItem: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
  thumb: { width: 84, height: 64, backgroundColor: '#eee', borderRadius: 8, marginRight: 12 },
  nearbyTitle: { fontWeight: '700' },
  nearbyMeta: { color: '#777', fontSize: 12 },
  nearbyPrice: { marginTop: 6, fontWeight: '800' },
  vehicleCard: { width: 140, height: 120, backgroundColor: '#fff', borderRadius: 12, marginLeft: 16, padding: 8, alignItems: 'center', justifyContent: 'center' },
  smallThumb: { width: 100, height: 60, backgroundColor: '#ddd', borderRadius: 8, marginBottom: 8 },
  vehicleTitle: { fontWeight: '700' },
  vehiclePrice: { color: '#777' },
  brokersRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, marginTop: 8 },
  broker: { alignItems: 'center' },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ddd', marginBottom: 6 },
  brokerName: { fontWeight: '700' },
  brokerStat: { color: '#777', fontSize: 12 },
  howRow: { padding: 16 },
  howTitle: { fontWeight: '800', marginBottom: 8 },
  howSteps: { flexDirection: 'row', alignItems: 'center' },
  step: { fontSize: 22 },
  chev: { marginHorizontal: 8, color: '#aaa' },
});
