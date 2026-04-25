import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SectionItem = {
  id: string;
  label: string;
  icon: string;
  value?: string;
  onPress: () => void;
  showToggle?: boolean;
  toggleOn?: boolean;
};

type Props = {
  title: string;
  items: SectionItem[];
  colors: any;
};

export default function ProfileSectionCard({ title, items, colors }: Props) {
  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.brandBorder }]}>
      <Text style={[styles.sectionTitle, { color: colors.textMain }]}>{title}</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          onPress={item.onPress}
          style={[styles.rowItem, { borderBottomColor: colors.brandBorder }]}
        >
          <View style={styles.rowLeft}>
            <View style={[styles.rowIcon, { backgroundColor: colors.tableRow }]}>
              <Ionicons name={item.icon as any} size={15} color={colors.textMain} />
            </View>
            <Text style={[styles.rowLabel, { color: colors.textMain }]}>{item.label}</Text>
          </View>
          <View style={styles.rowRight}>
            {item.value ? <Text style={[styles.rowValue, { color: colors.textMuted }]}>{item.value}</Text> : null}
            {item.showToggle ? (
              <View style={[styles.toggle, { backgroundColor: item.toggleOn ? colors.brandBlue : colors.brandBorder }]}>
                <View
                  style={[
                    styles.toggleKnob,
                    { backgroundColor: colors.surface, alignSelf: item.toggleOn ? 'flex-end' : 'flex-start' },
                  ]}
                />
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: { marginTop: 10, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingTop: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '900', marginBottom: 4 },
  rowItem: { paddingVertical: 12, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  rowLabel: { fontSize: 12, fontWeight: '800', flex: 1 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 10, fontWeight: '700', marginRight: 8 },
  toggle: { width: 34, height: 20, borderRadius: 999, padding: 2, justifyContent: 'center' },
  toggleKnob: { width: 16, height: 16, borderRadius: 999 },
});
