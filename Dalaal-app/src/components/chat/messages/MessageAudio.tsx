import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  msgId: string;
  audioDurationSeconds?: number;
  isPlaying: boolean;
  mine: boolean;
  colors: any;
  onTogglePlay: () => void;
  formatSeconds: (s?: number) => string;
};

export default function MessageAudio({
  msgId,
  audioDurationSeconds,
  isPlaying,
  mine,
  colors,
  onTogglePlay,
  formatSeconds,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.audioBubble,
        {
          borderColor: mine ? colors.surface + '55' : colors.brandBorder,
          backgroundColor: mine ? colors.brandBlueDark : colors.surface,
        },
      ]}
      onPress={onTogglePlay}
      activeOpacity={0.75}
    >
      <Ionicons
        name={isPlaying ? 'pause' : 'play'}
        size={16}
        color={mine ? colors.surface : colors.textMain}
      />
      <Text style={[styles.audioText, { color: mine ? colors.surface : colors.textMain }]}>
        Voice message {formatSeconds(audioDurationSeconds)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  audioBubble: {
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioText: { fontSize: 12, fontWeight: '700' },
});
