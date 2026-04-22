import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

export const options = { headerShown: false };

type Role = 'Buyer' | 'Seller' | 'Agent';

export default function RoleSelection() {
  const router = useRouter();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const roles = useMemo(
    () =>
      [
        { role: 'Buyer' as const, title: 'I’m buying', subtitle: 'Search and contact sellers.', icon: 'bag-handle' as const },
        { role: 'Seller' as const, title: 'I’m selling', subtitle: 'List and manage offers.', icon: 'pricetag' as const },
        { role: 'Agent' as const, title: 'I’m an agent', subtitle: 'Close deals faster.', icon: 'briefcase' as const },
      ] satisfies Array<{ role: Role; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }>,
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
        <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
        <ScreenSkeleton variant="form" />
      </SafeAreaView>
    );
  }

  const choose = (role: Role) => {
    router.push({ pathname: '/phone-verification', params: { role } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <FadeIn>
        <View style={styles.header}>
          <Text style={[styles.title, { color: C.textMain }]}>Choose your role</Text>
          <Text style={[styles.subtitle, { color: C.textMuted }]}>Tap one to continue.</Text>
        </View>

        <View style={styles.cards}>
          {roles.map((r) => (
            <TouchableOpacity
              key={r.role}
              onPress={() => choose(r.role)}
              activeOpacity={0.92}
              style={[styles.card, { borderColor: C.brandBorder, backgroundColor: C.surface }]}
            >
              <View style={[styles.cardIcon, { backgroundColor: C.brandBlueSoft }]}>
                <Ionicons name={r.icon} size={22} color={C.brandBlue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: C.textMain }]}>{r.title}</Text>
                <Text style={[styles.cardSubtitle, { color: C.textMuted }]}>{r.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 10, paddingBottom: 18 },
  title: { fontSize: 30, fontWeight: '900' },
  subtitle: { marginTop: 8, fontSize: 14, lineHeight: 20 },
  cards: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardSubtitle: { marginTop: 4, fontSize: 13, lineHeight: 18 },
});
