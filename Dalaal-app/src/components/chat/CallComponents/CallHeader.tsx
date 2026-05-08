import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  userName: string;
  status: 'ringing' | 'ongoing';
  direction: 'incoming' | 'outgoing';
  isOnline: boolean;
  isSignaling: boolean;
  headingColor: string;
  subTextColor: string;
};

export default function CallHeader({
  userName,
  status,
  direction,
  isOnline,
  isSignaling,
  headingColor,
  subTextColor,
}: Props) {
  return (
    <View style={styles.topMeta}>
      <Text style={[styles.nameSmall, { color: headingColor }]}>{userName}</Text>
      <Text style={[styles.state, { color: subTextColor }]}>
        {status === 'ringing'
          ? direction === 'incoming'
            ? 'Incoming call...'
            : (isOnline && !isSignaling)
            ? 'Ringing...'
            : 'Calling...'
          : 'On call'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topMeta: { alignItems: 'center' },
  nameSmall: { fontSize: 32, fontWeight: '800' },
  state: { marginTop: 6, fontSize: 18, fontWeight: '600' },
});
