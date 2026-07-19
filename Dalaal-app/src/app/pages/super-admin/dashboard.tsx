import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/theme';
import OnboardingBackground from '../../../components/common/OnboardingBackground';
import { useAppTheme } from '../../../context/theme-context';
import ScreenSkeleton from '../../../components/ui/ScreenSkeleton';
import useAuth from '../../../hooks/useAuth';

export const options = { headerShown: false };

const KPI_STATS = [
  { id: 'users', title: 'Total Users', value: '8,340', change: '+12.1%', icon: 'people', color: '#3b82f6' },
  { id: 'listings', title: 'Active Listings', value: '3,215', change: '+5.7%', icon: 'home', color: '#8b5cf6' },
  { id: 'escrow', title: 'Escrow Transactions', value: '1,048', change: '+22.3%', icon: 'shield-checkmark', color: '#f59e0b' },
  { id: 'revenue', title: 'Total Revenue', value: '$124,750', change: '+18.4%', icon: 'cash', color: '#10b981' },
];

const QUICK_ACTIONS = [
  { id: 'users', label: 'Manage Users', icon: 'people-outline', color: '#3b82f6' },
  { id: 'properties', label: 'Properties', icon: 'home-outline', color: '#8b5cf6' },
  { id: 'vehicles', label: 'Vehicles', icon: 'car-outline', color: '#f59e0b' },
  { id: 'payments', label: 'Payments', icon: 'wallet-outline', color: '#10b981' },
  { id: 'reports', label: 'Reports', icon: 'document-text-outline', color: '#ef4444' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', color: '#6b7280' },
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scheme } = useAppTheme();
  const { user } = useAuth();
  const C = Colors[scheme];
  const [isLoading, setIsLoading] = useState(false);

  const name = user?.profile?.firstName || user?.email?.split('@')[0] || 'Admin';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]} edges={['top']}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="chevron-back" size={18} color={C.textMain} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={[styles.headerTitle, { color: C.textMain }]}>Admin Dashboard</Text>
          <Text style={[styles.headerSubtitle, { color: C.textMuted }]}>Welcome back, {name}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} style={[styles.iconBtn, { borderColor: C.brandBorder, backgroundColor: C.tableRow }]}>
          <Ionicons name="notifications-outline" size={18} color={C.textMain} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {KPI_STATS.map((stat) => (
            <View key={stat.id} style={[styles.statCard, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconWrap, { backgroundColor: stat.color + '20' }]}>
                  <Ionicons name={stat.icon as any} size={16} color={stat.color} />
                </View>
                <Text style={[styles.statChange, { color: '#10b981' }]}>{stat.change}</Text>
              </View>
              <Text style={[styles.statValue, { color: C.textMain }]}>{stat.value}</Text>
              <Text style={[styles.statTitle, { color: C.textMuted }]}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: C.textMain }]}>Quick Actions</Text>
        </View>

        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity key={action.id} activeOpacity={0.85} style={[styles.actionBtn, { backgroundColor: C.tableRow, borderColor: C.brandBorder }]}>
              <View style={[styles.actionIconWrap, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={20} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: C.textMain }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
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
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  statChange: { fontSize: 12, fontWeight: '800' },
  statValue: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  statTitle: { fontSize: 11, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '900' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  actionBtn: { width: '31%', borderWidth: 1, borderRadius: 14, padding: 12, alignItems: 'center' },
  actionIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 11, fontWeight: '800', textAlign: 'center' },
  activityCard: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 12 },
  emptyState: { paddingVertical: 32, alignItems: 'center' },
  emptyText: { marginTop: 8, fontSize: 13, fontWeight: '600' },
});
