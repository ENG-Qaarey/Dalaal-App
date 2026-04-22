import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

export default function Splash() {
  const router = useRouter();
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const C = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/welcome');
    }, 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      <View style={styles.center}>
        <View style={[styles.logoBox, { backgroundColor: C.brandBlue }]}>
          <Ionicons name="home" size={42} color={C.surface} />
        </View>
        <Text style={[styles.brand, { color: C.brandBlueDark }]}>Dalaal-Prime</Text>
        <View style={[styles.loader, { backgroundColor: C.brandBorder }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBox: { width: 88, height: 88, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  brand: { marginTop: 16, fontSize: 30, fontWeight: '900' },
  loader: { marginTop: 18, width: 96, height: 6, borderRadius: 6, opacity: 0.55 },
});
