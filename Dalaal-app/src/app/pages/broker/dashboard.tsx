import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router/react-navigation';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/theme';
import OnboardingBackground from '../../../components/common/OnboardingBackground';
import { useAppTheme } from '../../../context/theme-context';
import ScreenSkeleton from '../../../components/ui/ScreenSkeleton';
import useAuth from '../../../hooks/useAuth';
import {
  analyticsService,
  ANALYTICS_ROLES,
  formatChangePercent,
  formatCompactNumber,
} from '../../../services/analytics';
import type { AgentStats, AnalyticsPeriod } from '../../../types/analytics';

export const options = { headerShown: false };

const PERIODS: AnalyticsPeriod[] = ['7d', '30d', '90d', '1y'];

const STAT_CONFIG = [
  { id: 'views', title: 'Profile & Listing Views', key: 'views' as const, icon: 'eye', color: '#3b82f6' },
  { id: 'favorites', title: 'Total Favorites', key: 'favorites' as const, icon: 'heart', color: '#ef4444' },
  { id: 'leads', title: 'Active Leads', key: 'leads' as const, icon: 'people', color: '#10b981' },
  { id: 'conversion', title: 'Conversion Rate', key: 'conversion' as const, icon: 'trending-up', color: '#f59e0b' },
];

function formatStatValue(key: keyof AgentStats, stats: AgentStats): string {
  if (key === 'views') return formatCompactNumber(stats.views.total);
  if (key === 'favorites') return formatCompactNumber(stats.favorites.total);
  if (key === 'leads') return String(stats.leads.total);
  return `${stats.conversion.rate}%`;
}

function formatStatChange(key: keyof AgentStats, stats: AgentStats): string {
  if (key === 'conversion') return formatChangePercent(stats.conversion.changePercent);
  if (key === 'views') return formatChangePercent(stats.views.changePercent);
  if (key === 'favorites') return formatChangePercent(stats.favorites.changePercent);
  return formatChangePercent(stats.leads.changePercent);
}

export default function BrokerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const { user } = useAuth();
  const C = Colors[scheme];
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');
  const [stats, setStats] = useState<AgentStats | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getAgentStats(period);
      setStats(data);
    } catch (error: any) {
      Alert.alert('Analytics unavailable', error?.message || 'Could not load analytics data.');
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.role || !ANALYTICS_ROLES.includes(user.role as any)) {
        router.replace('/(tabs)');
        return;
      }
      loadStats();
    }, [user?.role, loadStats, router])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top']}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="profile" />
      </SafeAreaView>
    );
  }

  const recentLeads = stats?.recentLeads ?? [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="chevron-back" size={18} color={C.textMain} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: C.textMain }]}>Analyse</Text>
          <Text style={[styles.headerSubtitle, { color: C.textMuted }]}>Overview & Performance</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/pages/broker/create-listing')} activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandOrange, backgroundColor: C.brandOrange + '20' }]}>
          <Ionicons name="add" size={20} color={C.brandOrange} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.periodRow}>
          {PERIODS.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.85}
              onPress={() => setPeriod(item)}
              style={[
                styles.periodBtn,
                {
                  backgroundColor: period === item ? C.brandBlue : C.tableRow,
                  borderColor: period === item ? C.brandBlue : C.brandBorder,
                },
              ]}
            >
              <Text style={[styles.periodText, { color: period === item ? C.surface : C.textMuted }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          {STAT_CONFIG.map((stat) => {
            const change = stats ? formatStatChange(stat.key, stats) : '0%';
            return (
              <View key={stat.id} style={[styles.statCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIconWrap, { backgroundColor: stat.color + '20' }]}>
                    <Ionicons name={stat.icon as any} size={16} color={stat.color} />
                  </View>
                  <Text style={[styles.statChange, { color: change.startsWith('+') ? '#10b981' : change.startsWith('-') ? '#ef4444' : C.textMuted }]}>
                    {change}
                  </Text>
                </View>
                <Text style={[styles.statValue, { color: C.textMain }]}>
                  {stats ? formatStatValue(stat.key, stats) : '—'}
                </Text>
                <Text style={[styles.statTitle, { color: C.textMuted }]}>{stat.title}</Text>
              </View>
            );
          })}
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
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Recent Leads</Text>
          <Text style={[styles.seeAll, { color: C.textMuted }]}>
            {stats?.activeListings ?? 0} active listings
          </Text>
        </View>

        <View style={[styles.leadsContainer, { backgroundColor: C.surface, borderColor: C.brandBorder }]}>
          {recentLeads.length === 0 ? (
            <View style={styles.emptyLeads}>
              <Text style={[styles.emptyLeadsText, { color: C.textMuted }]}>
                No leads yet. Publish listings to start receiving inquiries.
              </Text>
            </View>
          ) : (
            recentLeads.map((lead, index) => (
              <TouchableOpacity
                key={lead.id}
                activeOpacity={0.85}
                style={[
                  styles.leadItem,
                  index !== recentLeads.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.brandBorder },
                ]}
              >
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
            ))
          )}
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
  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  periodBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  periodText: { fontSize: 12, fontWeight: '800' },
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
  emptyLeads: { paddingVertical: 24, paddingHorizontal: 8 },
  emptyLeadsText: { textAlign: 'center', fontSize: 13, lineHeight: 20 },
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
