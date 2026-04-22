import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../../constants/theme';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

export default function PhoneVerification() {
  const router = useRouter();
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const C = Colors[colorScheme ?? 'light'];

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const canVerify = code.every((c) => c.length === 1);

  const onChangeDigit = (i: number, v: string) => {
    const digit = v.replace(/\D+/g, '').slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKeyPress = (i: number, key: string) => {
    if (key !== 'Backspace') return;
    if (code[i]) {
      setCode((prev) => {
        const next = [...prev];
        next[i] = '';
        return next;
      });
      return;
    }
    if (i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = () => {
    if (!canVerify) return;
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={styles.content}>
        <FadeIn>
          <Text style={[styles.title, { color: C.textMain }]}>Verify your phone</Text>
          <Text style={[styles.subtitle, { color: C.textMuted }]}>Enter the 6‑digit code.</Text>
        </FadeIn>

        <View style={styles.section}>
          <Text style={[styles.label, { color: C.textMuted }]}>OTP code</Text>
          <View style={styles.otpRow}>
            {code.map((d, i) => (
              <TextInput
                key={i}
                ref={(r) => {
                  inputs.current[i] = r;
                }}
                value={d}
                onChangeText={(t) => onChangeDigit(i, t)}
                onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                style={[styles.otpBox, { color: C.textMain, borderColor: C.brandBorder, backgroundColor: C.surface }]}
                textAlign="center"
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={verify}
          disabled={!canVerify}
          style={[styles.primaryBtn, { backgroundColor: canVerify ? C.brandBlue : C.brandBorder }]}
        >
          <Text style={[styles.primaryText, { color: C.surface }]}>Verify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 18 },
  title: { fontSize: 32, fontWeight: '900' },
  subtitle: { marginTop: 10, fontSize: 14, lineHeight: 20 },
  section: { marginTop: 18 },
  label: { fontSize: 12, marginBottom: 8 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  otpBox: { flex: 1, height: 54, borderRadius: 14, borderWidth: 1, fontSize: 18, fontWeight: '900' },
  footer: { paddingHorizontal: 24, paddingBottom: 22 },
  primaryBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '900' },
});
