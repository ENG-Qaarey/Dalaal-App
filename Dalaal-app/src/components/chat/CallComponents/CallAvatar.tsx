import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  userImageUri?: string;
  status: 'ringing' | 'ongoing';
  label: string;
  timerColor: string;
  isLightTheme: boolean;
};

export default function CallAvatar({
  userImageUri,
  status,
  label,
  timerColor,
  isLightTheme,
}: Props) {
  return (
    <View style={styles.center}>
      <View style={styles.avatarCircle}>
        {userImageUri ? (
          <Image source={{ uri: userImageUri }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={62} color={isLightTheme ? '#EEF2FF' : '#D8D4F8'} />
        )}
      </View>
      {status === 'ongoing' ? (
        <Text style={[styles.timer, { color: timerColor }]}>{label}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center' },
  avatarCircle: {
    width: 214,
    height: 214,
    borderRadius: 107,
    backgroundColor: '#4C3F9A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  timer: { marginTop: 12, fontSize: 16, fontWeight: '700' },
});
