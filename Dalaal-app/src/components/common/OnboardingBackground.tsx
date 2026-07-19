import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

type Props = {
  primary?: string;
  secondary?: string;
  soft?: string;
};

const { width, height } = Dimensions.get('window');

function hexToRgb(hex: string) {
  if (!hex) return { r: 30, g: 95, b: 184 }; // Default brandBlue
  const cleaned = hex.replace('#', '').trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return { r, g, b };
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export default function OnboardingBackground({ 
  primary = '#1e5fb8', 
  secondary = '#f28c28', 
  soft = '#e7f1ff' 
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 12000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 12000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const particles = useMemo(() => {
    const rand = lcg(42);
    const colors = [
      rgba(primary, 0.18),
      rgba(secondary, 0.14),
      rgba(primary, 0.12),
      rgba(secondary, 0.12),
    ];

    return Array.from({ length: 26 }).map((_, i) => {
      const size = 6 + Math.round(rand() * 10);
      return {
        key: `p-${i}`,
        left: rand(),
        top: rand() * 0.65,
        size,
        color: colors[Math.floor(rand() * colors.length)],
        dx: 6 + rand() * 14,
        dy: 5 + rand() * 12,
      };
    });
  }, [primary, secondary]);

  const blob1x = anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 18] });
  const blob1y = anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 10] });
  const blob2x = anim.interpolate({ inputRange: [0, 1], outputRange: [14, -12] });
  const blob2y = anim.interpolate({ inputRange: [0, 1], outputRange: [8, -10] });

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: rgba(primary, 0.16),
            left: -width * 0.35,
            top: -width * 0.25,
            width: width * 1.2,
            height: width * 1.2,
            borderRadius: width,
            transform: [{ translateX: blob1x }, { translateY: blob1y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: rgba(secondary, 0.12),
            right: -width * 0.4,
            top: -width * 0.1,
            width: width * 1.15,
            height: width * 1.15,
            borderRadius: width,
            transform: [{ translateX: blob2x }, { translateY: blob2y }],
          },
        ]}
      />

      <View style={[styles.softWash, { backgroundColor: rgba(soft, 0.75) }]} />

      {particles.map((p) => {
        const px = anim.interpolate({ inputRange: [0, 1], outputRange: [-p.dx, p.dx] });
        const py = anim.interpolate({ inputRange: [0, 1], outputRange: [-p.dy, p.dy] });
        return (
          <Animated.View
            key={p.key}
            style={[
              styles.particle,
              {
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                backgroundColor: p.color,
                left: Math.round(width * p.left),
                top: Math.round(height * p.top),
                transform: [{ translateX: px }, { translateY: py }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
  },
  softWash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    opacity: 0.9,
  },
});
