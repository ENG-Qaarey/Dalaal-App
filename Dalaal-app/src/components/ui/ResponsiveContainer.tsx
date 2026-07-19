import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const MAX_WIDTH = 1200;

export default function ResponsiveContainer({ children, style }: Props) {
  if (Platform.OS !== 'web') {
    return <View style={[{ flex: 1 }, style]}>{children}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    width: '100%',
  },
});
