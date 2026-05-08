import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  type: 'date' | 'call';
  content: string;
  time?: string;
  colors: any;
};

export default function MessageSystem({ type, content, time, colors }: Props) {
  if (type === 'date') {
    return (
      <View style={styles.dateRow}>
        <View style={[styles.dateBadge, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}>
          <Text style={[styles.dateText, { color: colors.textMuted }]}>{content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.systemRow}>
      <View style={[styles.callLog, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}>
        <Ionicons name="call" size={14} color={colors.textMain} />
        <Text style={[styles.callLogText, { color: colors.textMain }]}>{content}</Text>
      </View>
      {time ? <Text style={[styles.callLogTime, { color: colors.textMuted }]}>{time}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  systemRow: { alignItems: 'center', marginVertical: 6 },
  dateRow: { alignItems: 'center', marginVertical: 6 },
  dateBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  dateText: { fontSize: 10, fontWeight: '700' },
  callLog: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  callLogText: { fontSize: 12, fontWeight: '700' },
  callLogTime: { marginTop: 4, fontSize: 10, fontWeight: '600' },
});
