import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/theme';
import OnboardingBackground from '../../../components/common/OnboardingBackground';
import { useAppTheme } from '../../../context/theme-context';
import useAuth from '../../../hooks/useAuth';

export const options = { headerShown: false };

const STAT_CARDS = [
  { id: 'properties', title: 'My Properties', subtitle: 'Listed properties', icon: 'home', color: '#3b82f6', value: '0' },
  { id: 'vehicles', title: 'My Vehicles', subtitle: 'Listed vehicles', icon: 'car', color: '#8b5cf6', value: '0' },
  { id: 'messages', title: 'Messages', subtitle: 'Active conversations', icon: 'chatbubbles', color: '#10b981', value: '0' },
  { id: 'earnings', title: 'Earnings', subtitle: 'Total revenue', icon: 'wallet', color: '#f59e0b', value: '$0' },
];

export default function OwnerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const { user } = useAuth();
  const C = Colors[scheme];

  const name = user?.profile?.firstName || user?.email?.split('@')[0] || 'Owner';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="chevron-back" size={18} color={C.textMain} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: C.textMain }]}>Owner Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: C.textMuted }]}>Welcome back, {name}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="notifications-outline" size={18} color={C.textMain} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat) => (
            <TouchableOpacity key={stat.id} activeOpacity={0.85} style={[styles.statCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: C.textMain }]}>{stat.value}</Text>
              <Text style={[styles.statTitle, { color: C.textMain }]}>{stat.title}</Text>
              <Text style={[styles.statSubtitle, { color: C.textMuted }]}>{stat.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Quick Actions</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.actionBtn, { backgroundColor: C.brandBlue }]} onPress={() => router.push('/pages/broker/create-listing')}>
            <Ionicons name="add-circle" size={24} color={C.surface} />
            <Text style={[styles.actionText, { color: C.surface }]}>New Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.actionBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder, borderWidth: 1 }]} onPress={() => router.push('/profile/my-listings')}>
            <Ionicons name="list" size={24} color={C.textMain} />
            <Text style={[styles.actionText, { color: C.textMain }]}>My Listings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Recent Activity</Text>
        </View>

        <View style={[styles.activityCard, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={32} color={C.textMuted} />
            <Text style={[styles.emptyText, { color: C.textMuted }]}>No recent activity to display.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  headerTextWrap: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  content: { paddingHorizontal: 16, paddingTop: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  statCard: { width: '48%', borderWidth: 1, borderRadius: 16, padding: 16 },
  statIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 22, fontWeight: '900', marginBottom: 2 },
  statTitle: { fontSize: 13, fontWeight: '800' },
  statSubtitle: { fontSize: 11, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionText: { marginTop: 8, fontSize: 14, fontWeight: '800' },
  activityCard: { borderWidth: 1, borderRadius: 16 },
  emptyState: { paddingVertical: 32, alignItems: 'center' },
  emptyText: { marginTop: 8, fontSize: 13, fontWeight: '600' },
});
