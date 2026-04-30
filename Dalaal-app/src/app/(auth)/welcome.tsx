import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

export const options = { headerShown: false };

type Language = 'English' | 'Somali';

export default function Welcome() {
  const router = useRouter();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [language, setLanguage] = useState<Language>('English');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={styles.content}>
        <FadeIn>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/images/AppLogo.png')}
              style={{ width: 44, height: 44, borderRadius: 12, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal-Prime</Text>
          </View>
        </FadeIn>

        <FadeIn delay={120}>
          <Text style={[styles.title, { color: C.textMain }]}>Welcome</Text>
          <Text style={[styles.subtitle, { color: C.textMuted }]}>Choose your language, then tap to continue.</Text>

          <View style={styles.langRow}>
            {(['English', 'Somali'] as const).map((l) => {
              const selected = language === l;
              return (
                <TouchableOpacity
                  key={l}
                  onPress={() => setLanguage(l)}
                  style={[
                    styles.langPill,
                    {
                      backgroundColor: selected ? C.brandBlue : C.brandBlueSoft,
                      borderColor: C.brandBorder,
                    },
                  ]}
                  activeOpacity={0.9}
                >
                  <Text style={{ color: selected ? C.surface : C.textMain, fontWeight: '800' }}>{l}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.bigInfo, { color: C.textMain }]}>How Dalaal works</Text>
          <Text style={[styles.infoLine, { color: C.textMuted }]}>• Search listings and compare options quickly</Text>
          <Text style={[styles.infoLine, { color: C.textMuted }]}>• Chat with sellers, agents, and providers</Text>
          <Text style={[styles.infoLine, { color: C.textMuted }]}>• Follow guided steps for safer deals</Text>
        </FadeIn>
      </View>

      <FadeIn delay={320}>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/features', params: { lang: language } })}
            style={[styles.primaryBtn, { backgroundColor: C.brandBlue }]}
          >
            <Text style={[styles.primaryText, { color: C.surface }]}>Continue</Text>
          </TouchableOpacity>
        </View>
      </FadeIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logoBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  brand: { fontSize: 20, fontWeight: '900' },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 20 },
  langRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  langPill: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  bigInfo: { marginTop: 16, fontSize: 16, fontWeight: '900' },
  infoLine: { marginTop: 8, fontSize: 14, lineHeight: 20 },
  actions: { paddingHorizontal: 20, paddingBottom: 20 },
  primaryBtn: { height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 15, fontWeight: '900' },
});
