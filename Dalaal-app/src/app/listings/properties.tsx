import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';
import { listingDetailHref } from '../../utils/listing-nav';

const MOCK_PROPERTIES = [
  { id: '1', price: '$150,000', title: 'Modern Villa', location: 'Hodan', beds: 4, baths: 3, agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { id: 'n1', price: '$120,000', title: '4BR Villa, Secure Compound', location: 'Hodan', beds: 4, baths: 3, agent: 'Ahmed', posterRole: 'Broker', posterVerified: true, posterRating: '4.9', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80' },
  { id: 'n2', price: '$85,000', title: '3BR Apt, New Building', location: 'Waberi', beds: 3, baths: 2, agent: 'Fatima', posterRole: 'Broker', posterVerified: true, posterRating: '4.8', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
];

export default function PropertiesList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
        <ScreenSkeleton variant="list" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['left', 'right']}>
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: C.brandBorder }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={[styles.backBtn, { backgroundColor: C.tableRow }]}>
          <Ionicons name="arrow-back" size={16} color={C.textMain} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: C.textMain }]}>Properties</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 18 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {MOCK_PROPERTIES.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() =>
              router.push(
                listingDetailHref({
                  id: item.id,
                  type: 'property',
                  title: item.title,
                  location: item.location,
                  price: item.price,
                  posterName: item.agent,
                  posterRole: item.posterRole,
                  posterVerified: item.posterVerified,
                  posterRating: item.posterRating,
                  image: item.image,
                  category: 'houses',
                }) as any
              )
            }
            style={[styles.card, { backgroundColor: C.surface, borderColor: C.brandBorder }]}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <Text style={[styles.cardPrice, { color: C.textMain }]}>{item.price}</Text>
              <Text style={[styles.cardTitle, { color: C.textMain }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.cardMeta, { color: C.textMuted }]}>
                {item.location} • {item.beds}bd • {item.baths}ba
              </Text>
              <View style={styles.agentRow}>
                <Text style={[styles.agentText, { color: C.textMuted }]} numberOfLines={1}>
                  {item.agent} • {item.posterRole}
                </Text>
                {item.posterVerified && <Ionicons name="checkmark-circle" size={12} color={C.brandBlue} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { borderBottomWidth: 1, paddingBottom: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { width: 32, height: 32, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '900' },
  content: { paddingHorizontal: 12 },
  card: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, marginTop: 10, padding: 8 },
  cardImage: { width: 90, height: 80, borderRadius: 10, marginRight: 10 },
  cardBody: { flex: 1 },
  cardPrice: { fontSize: 14, fontWeight: '900' },
  cardTitle: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  cardMeta: { fontSize: 10, marginTop: 2 },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  agentText: { fontSize: 10 },
});
