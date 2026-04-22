import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';

type Props = ViewProps & {
  delay?: number;
  duration?: number;
  fromY?: number;
};

export default function FadeIn({ children, delay = 0, duration = 360, fromY = 8, style, ...rest }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(fromY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]).start();
  }, [anim, delay, duration, translate]);

  return (
    <Animated.View
      {...rest}
      style={[
        style,
        { opacity: anim, transform: [{ translateY: translate }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}
