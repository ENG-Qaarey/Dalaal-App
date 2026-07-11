import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  fileName: string;
  mine: boolean;
  colors: any;
};

export default function MessageFile({ fileName, mine, colors }: Props) {
  return (
    <View
      style={[
        styles.fileBubble,
        {
          borderColor: mine ? colors.surface + '55' : colors.brandBorder,
          backgroundColor: mine ? colors.brandBlueDark : colors.surface,
        },
      ]}
    >
      <Ionicons name="document-outline" size={16} color={mine ? colors.surface : colors.textMain} />
      <Text style={[styles.fileText, { color: mine ? colors.surface : colors.textMain }]} numberOfLines={1}>
        {fileName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fileBubble: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileText: { flex: 1, fontSize: 12, fontWeight: '700' },
});
