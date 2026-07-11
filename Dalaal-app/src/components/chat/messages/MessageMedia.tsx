import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  msgId: string;
  imageUri?: string;
  videoUri?: string;
  mine: boolean;
  colors: any;
  onOpenViewer: (id: string) => void;
};

export default function MessageMedia({
  msgId,
  imageUri,
  videoUri,
  mine,
  colors,
  onOpenViewer,
}: Props) {
  return (
    <>
      {imageUri ? (
        <TouchableOpacity activeOpacity={0.9} onPress={() => onOpenViewer(msgId)}>
          <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
        </TouchableOpacity>
      ) : null}
      {videoUri ? (
        <TouchableOpacity
          style={[styles.videoChip, { borderColor: mine ? colors.surface + '55' : colors.brandBorder }]}
          activeOpacity={0.9}
          onPress={() => onOpenViewer(msgId)}
        >
          <Ionicons name="play-circle" size={20} color={mine ? colors.surface : colors.textMain} />
          <Text style={[styles.videoChipText, { color: mine ? colors.surface : colors.textMain }]}>Video</Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  photo: { width: 180, height: 180, borderRadius: 10, marginBottom: 6 },
  videoChip: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoChipText: { fontSize: 12, fontWeight: '700' },
});
