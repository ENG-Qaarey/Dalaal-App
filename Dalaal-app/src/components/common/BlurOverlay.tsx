import React from 'react';
import { Animated, ViewStyle } from 'react-native';

type Props = {
  intensity?: number;
  tint?: 'light' | 'dark' | string;
  style?: ViewStyle | any;
};

export default function BlurOverlay({ intensity = 30, tint = 'light', style }: Props) {
  let BlurView: any = null;
  try {
    // runtime require so bundle doesn't fail if package missing
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-blur');
    BlurView = mod?.BlurView ?? null;
  } catch (e) {
    BlurView = null;
  }

  if (BlurView) {
    return <BlurView intensity={intensity} tint={tint} style={style} />;
  }

  // fallback: translucent Animated.View to simulate blur
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        { backgroundColor: tint === 'light' ? 'rgba(231,241,255,0.6)' : 'rgba(16,24,37,0.36)' },
      ]}
    />
  );
}
