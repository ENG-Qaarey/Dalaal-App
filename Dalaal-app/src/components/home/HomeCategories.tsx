import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { spacing, radius, fontSize } from '../../constants/tokens';

const CATEGORY_ACCENTS: Record<string, string> = {
  houses: '#2F7CF6',
  cars: '#F28C28',
  apts: '#8B5CF6',
  land: '#16A34A',
  comm: '#EC4899',
  vehi: '#0EA5E9',
};

type Category = {
  key: string;
  label: string;
  icon: string;
};

type Props = {
  categories: Category[];
  onPress: (key: string) => void;
  colors: ThemePalette;
};

export default function HomeCategories({ categories, onPress, colors }: Props) {
  return (
    <View style={styles.categoryGrid}>
      {categories.map((c) => {
        const accent = CATEGORY_ACCENTS[c.key] || colors.brandOrange;
        return (
          <TouchableOpacity
            key={c.key}
            style={styles.categoryItem}
            onPress={() => onPress(c.key)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: accent }]}>
              <Ionicons name={c.icon as any} size={fontSize.body} color={colors.surface} />
            </View>
            <Text style={[styles.categoryLabel, { color: colors.textMain }]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: spacing.lg },
  categoryItem: { width: '23%', marginVertical: spacing.sm, alignItems: 'center' },
  categoryIcon: { width: spacing.huge, height: spacing.huge, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  categoryLabel: { fontSize: fontSize.caption, fontWeight: '600' },
});
