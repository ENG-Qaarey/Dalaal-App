import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

const { width } = Dimensions.get('window');

type Slide = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function Features() {
  const router = useRouter();
  const colorScheme = useColorScheme() as 'light' | 'dark' | null;
  const C = Colors[colorScheme ?? 'light'];

  const slides: Slide[] = useMemo(
    () => [
      { title: 'Search', subtitle: 'Find properties, vehicles and services fast.', icon: 'search' },
      { title: 'Chat', subtitle: 'Message agents and sellers instantly.', icon: 'chatbubbles' },
      { title: 'Escrow', subtitle: 'Safer payments with guided steps.', icon: 'shield-checkmark' },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    if (i !== index) setIndex(i);
  };

  const goNext = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    } else {
      router.push('/role-selection');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <FadeIn>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {slides.map((s) => (
            <View key={s.title} style={[styles.slide, { width }]}
              >
              <View style={[styles.iconBox, { backgroundColor: C.brandBlue }]}
                >
                <Ionicons name={s.icon} size={34} color={C.surface} />
              </View>
              <Text style={[styles.title, { color: C.textMain }]}>{s.title}</Text>
              <Text style={[styles.subtitle, { color: C.textMuted }]}>{s.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
      </FadeIn>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === index ? C.brandBlue : C.brandBorder },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={goNext} style={[styles.primaryBtn, { backgroundColor: C.brandBlue }]}>
          <Text style={[styles.primaryText, { color: C.surface }]}>
            {index === slides.length - 1 ? 'Continue' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconBox: { width: 84, height: 84, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 38, fontWeight: '900', marginBottom: 10 },
  subtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 280 },
  footer: { paddingHorizontal: 24, paddingBottom: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  primaryBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '900' },
});
