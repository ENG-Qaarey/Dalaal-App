import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import FadeIn from '../../components/FadeIn';
import OnboardingBackground from '../../components/OnboardingBackground';
import ScreenSkeleton from '../../components/ui/ScreenSkeleton';

export const options = { headerShown: false };

type Slide = {
  title: string;
  subtitle: string;
  lines: string[];
  icon: keyof typeof Ionicons.glyphMap;
};

export default function Features() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const { width, height } = useWindowDimensions();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Helps prevent a blank screen on some Android devices by ensuring
  // the horizontal pager children have a real height.
  const footerHeight = 132;
  const slideHeight = Math.max(360, height - footerHeight);

  const slides: Slide[] = useMemo(
    () => [
      {
        title: 'Search',
        subtitle: 'Explore verified listings in seconds.',
        lines: ['Properties, vehicles, land and services', 'Filter by location and price', 'Save your favorites for later'],
        icon: 'search',
      },
      {
        title: 'Browse',
        subtitle: 'Discover what you need faster.',
        lines: ['Quick categories: houses, cars, apartments', 'See featured and nearby items', 'Open details anytime'],
        icon: 'grid',
      },
      {
        title: 'Chat',
        subtitle: 'Talk directly to sellers and agents.',
        lines: ['Ask questions and negotiate quickly', 'Share details without leaving the app', 'Keep all conversations in one place'],
        icon: 'chatbubbles',
      },
      {
        title: 'Escrow',
        subtitle: 'Complete deals with clearer steps.',
        lines: ['Guided flow for safer transactions', 'Track progress from start to finish', 'Reduce risk and build trust'],
        icon: 'shield-checkmark',
      },
      {
        title: 'Secure',
        subtitle: 'Build trust for both sides.',
        lines: ['Verified profiles and clear info', 'Safer communication inside the app', 'Support when you need it'],
        icon: 'lock-closed',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

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

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    if (i !== index) setIndex(i);
  };

  const goNext = () => {
    if (index < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    } else {
      router.replace({ pathname: '/register', params: { lang: params.lang ?? 'English' } });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />

      <View style={styles.slidesArea}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { height: slideHeight }]}
          removeClippedSubviews={false}
        >
          {slides.map((s) => (
            <View key={s.title} style={[styles.slide, { width, height: slideHeight }]}>
              <FadeIn>
                <View style={[styles.iconBox, { backgroundColor: C.brandBlue }]}>
                  <Ionicons name={s.icon} size={34} color={C.surface} />
                </View>
                <Text style={[styles.title, { color: C.textMain }]}>{s.title}</Text>
                <Text style={[styles.subtitle, { color: C.textMuted }]}>{s.subtitle}</Text>

                <View style={styles.lines}>
                  {s.lines.map((line) => (
                    <Text key={line} style={[styles.line, { color: C.textMuted }]}>• {line}</Text>
                  ))}
                </View>
              </FadeIn>
            </View>
          ))}
        </ScrollView>
      </View>

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
  slidesArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { alignItems: 'stretch' },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconBox: { width: 84, height: 84, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 38, fontWeight: '900', marginBottom: 10 },
  subtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 280 },
  lines: { marginTop: 18, width: '100%', maxWidth: 340 },
  line: { fontSize: 14, lineHeight: 22, marginTop: 10 },
  footer: { paddingHorizontal: 24, paddingBottom: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12, gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  primaryBtn: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '900' },
});
