import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import OnboardingBackground from '../../components/OnboardingBackground';

export const options = { headerShown: false };

export default function Splash() {
  const router = useRouter();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start progress bar animation
    Animated.timing(progress, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    const t = setTimeout(() => {
      router.replace('/welcome');
    }, 2800);
    return () => clearTimeout(t);
  }, [router]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      
      <View style={styles.center}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.brand, { color: C.textMain }]}>Dalaal Prime</Text>
          <Text style={[styles.tagline, { color: C.textMuted }]}>SOMALIA'S PREMIER MARKETPLACE</Text>
        </View>

        <View style={styles.bottomContainer}>
          <View style={[styles.progressBarContainer, { backgroundColor: C.brandBorder + '40' }]}>
            <Animated.View style={[styles.progressBar, { backgroundColor: C.brandBlue, width: progressWidth }]} />
          </View>
          
          <View style={styles.securityBadge}>
            <Ionicons name="checkmark-circle" size={16} color={C.brandBlue} />
            <Text style={[styles.securityText, { color: C.textMuted }]}>Secured by Dalaal Encryption</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 100 },
  logoContainer: { alignItems: 'center', marginTop: 100 },
  logoImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 24,
  },
  brand: { marginTop: 24, fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  tagline: { marginTop: 8, fontSize: 12, fontWeight: '700', letterSpacing: 2, opacity: 0.6 },
  bottomContainer: { width: '100%', alignItems: 'center', paddingHorizontal: 60, marginBottom: 20 },
  progressBarContainer: { width: '100%', height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 20 },
  progressBar: { height: '100%' },
  securityBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  securityText: { fontSize: 12, fontWeight: '500' },
});
