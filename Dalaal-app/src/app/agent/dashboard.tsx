import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';
import { useAppTheme } from '../../context/theme-context';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

export const options = { headerShown: false };

const MOCK_STATS = [
  { id: 'views', title: 'Profile & Listing Views', value: '14.2K', change: '+12%', icon: 'eye', color: '#3b82f6' },
  { id: 'favorites', title: 'Total Favorites', value: '843', change: '+5%', icon: 'heart', color: '#ef4444' },
  { id: 'leads', title: 'Active Leads', value: '56', change: '+18%', icon: 'people', color: '#10b981' },
  { id: 'conversion', title: 'Conversion Rate', value: '4.2%', change: '-1%', icon: 'trending-up', color: '#f59e0b' },
];

const MOCK_RECENT_LEADS = [
  { id: '1', name: 'Ahmed Ali', property: 'Villa in Hodan', time: '2 hours ago', status: 'New' },
  { id: '2', name: 'Sarah Hassan', property: 'Apartment in Waberi', time: '5 hours ago', status: 'Contacted' },
  { id: '3', name: 'Mohamed Osman', property: 'Commercial Space', time: '1 day ago', status: 'In Progress' },
];

export default function AgentDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="profile" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="chevron-back" size={18} color={C.textMain} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: C.textMain }]}>Agent Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: C.textMuted }]}>Overview & Performance</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/agent/create-listing')} activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandOrange, backgroundColor: C.brandOrange + '20' }]}>
          <Ionicons name="add" size={20} color={C.brandOrange} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {MOCK_STATS.map((stat) => (
            <View key={stat.id} style={[styles.statCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconWrap, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={16} color={stat.color} />
                </View>
                <Text style={[
                  styles.statChange,
                  { color: stat.change.startsWith('+') ? '#10b981' : '#ef4444' }
                ]}>
                  {stat.change}
                </Text>
              </View>
              <Text style={[styles.statValue, { color: C.textMain }]}>{stat.value}</Text>
              <Text style={[styles.statTitle, { color: C.textMuted }]}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Quick Actions</Text>
        </View>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.actionBtn, { backgroundColor: C.brandBlue }]} onPress={() => router.push('/agent/create-listing')}>
            <Ionicons name="add-circle" size={24} color={C.surface} />
            <Text style={[styles.actionText, { color: C.surface }]}>New Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.actionBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder, borderWidth: 1 }]} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="list" size={24} color={C.textMain} />
            <Text style={[styles.actionText, { color: C.textMain }]}>My Listings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Recent Leads</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: C.brandBlue }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.leadsContainer, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
          {MOCK_RECENT_LEADS.map((lead, index) => (
            <TouchableOpacity key={lead.id} activeOpacity={0.85} style={[
              styles.leadItem,
              index !== MOCK_RECENT_LEADS.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.brandBorder }
            ]}>
              <View style={[styles.leadAvatar, { backgroundColor: C.tableRow }]}>
                <Ionicons name="person" size={16} color={C.textMuted} />
              </View>
              <View style={styles.leadInfo}>
                <Text style={[styles.leadName, { color: C.textMain }]}>{lead.name}</Text>
                <Text style={[styles.leadProperty, { color: C.textMuted }]}>{lead.property}</Text>
              </View>
              <View style={styles.leadRight}>
                <Text style={[styles.leadTime, { color: C.textMuted }]}>{lead.time}</Text>
                <View style={[styles.leadStatusPill, { backgroundColor: lead.status === 'New' ? '#3b82f620' : C.tableRow }]}>
                  <Text style={[styles.leadStatusText, { color: lead.status === 'New' ? '#3b82f6' : C.textMuted }]}>
                    {lead.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statChange: { fontSize: 12, fontWeight: '800' },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  statTitle: { fontSize: 11, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900' },
  seeAll: { fontSize: 13, fontWeight: '800' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionText: { marginTop: 8, fontSize: 14, fontWeight: '800' },
  leadsContainer: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 12 },
  leadItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  leadAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  leadInfo: { flex: 1 },
  leadName: { fontSize: 14, fontWeight: '900', marginBottom: 4 },
  leadProperty: { fontSize: 12 },
  leadRight: { alignItems: 'flex-end' },
  leadTime: { fontSize: 10, marginBottom: 6 },
  leadStatusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  leadStatusText: { fontSize: 10, fontWeight: '800' },
});
