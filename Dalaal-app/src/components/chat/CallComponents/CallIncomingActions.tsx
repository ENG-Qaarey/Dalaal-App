import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onAccept?: () => void;
  onDecline?: () => void;
};

export default function CallIncomingActions({ onAccept, onDecline }: Props) {
  return (
    <View style={styles.incomingActions}>
      <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
        <Ionicons name="call" size={18} color="#fff" />
        <Text style={styles.acceptText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
        <Ionicons name="call" size={18} color="#fff" />
        <Text style={styles.declineText}>Decline</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  incomingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  acceptText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  declineBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  declineText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
