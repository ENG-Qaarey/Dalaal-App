import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  text: string;
  mine: boolean;
  time?: string;
  status?: string;
  colors: any;
  renderText: (text: string, isMine: boolean) => React.ReactNode;
};

export default function MessageText({ text, mine, time, status, colors, renderText }: Props) {
  return (
    <View style={styles.inlineTextMetaRow}>
      <View style={styles.textWrapper}>
        <Text style={[styles.messageText, { color: mine ? colors.surface : colors.textMain }]}>
          {renderText(text, mine)}
        </Text>
      </View>
      <View style={styles.inlineMeta}>
        {time ? (
          <Text style={[styles.timeText, { color: mine ? colors.surface + 'CC' : colors.textMuted }]}>{time}</Text>
        ) : null}
        {mine ? (
          <Ionicons
            name={status === 'read' ? 'checkmark-done' : status === 'delivered' ? 'checkmark-done' : 'checkmark'}
            size={13}
            color={status === 'read' ? '#7DD3FC' : colors.surface + 'CC'}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageText: { fontSize: 13, fontWeight: '700', flexWrap: 'wrap', includeFontPadding: false },
  textWrapper: { flexShrink: 1, maxWidth: '100%' },
  inlineTextMetaRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 6,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  inlineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingBottom: 1,
  },
  timeText: { fontSize: 10, marginRight: 3, lineHeight: 12 },
});
