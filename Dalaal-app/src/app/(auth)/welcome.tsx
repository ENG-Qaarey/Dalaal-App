import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

type Language = 'English' | 'Somali';

export default function Welcome() {
  const router = useRouter();
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const C = Colors[colorScheme ?? 'light'];
  const [language, setLanguage] = useState<Language>('English');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={styles.content}>
        <FadeIn>
          <View style={styles.brandRow}>
            <View style={[styles.logoBox, { backgroundColor: C.brandBlue }]}>
              <Ionicons name="home" size={28} color={C.surface} />
            </View>
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
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  logoBox: { width: 56, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  brand: { fontSize: 24, fontWeight: '900' },
  title: { fontSize: 36, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  langRow: { flexDirection: 'row', gap: 12, marginTop: 18 },
  langPill: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1 },
  bigInfo: { marginTop: 18, fontSize: 18, fontWeight: '900' },
  infoLine: { marginTop: 10, fontSize: 15, lineHeight: 22 },
  actions: { paddingHorizontal: 24, paddingBottom: 22 },
  primaryBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '900' },
});
