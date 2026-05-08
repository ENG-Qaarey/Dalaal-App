import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Category = {
  key: string;
  label: string;
  icon: string;
};

type Props = {
  categories: Category[];
  onPress: (key: string) => void;
  colors: any;
};

export default function HomeCategories({ categories, onPress, colors }: Props) {
  return (
    <View style={styles.categoryGrid}>
      {categories.map((c) => (
        <TouchableOpacity
          key={c.key}
          style={styles.categoryItem}
          onPress={() => onPress(c.key)}
        >
          <View style={[styles.categoryIcon, { backgroundColor: colors.brandOrange }]}>
            <Ionicons name={c.icon as any} size={18} color={colors.surface} />
          </View>
          <Text style={[styles.categoryLabel, { color: colors.textMain }]}>{c.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 14 },
  categoryItem: { width: '23%', marginVertical: 6, alignItems: 'center' },
  categoryIcon: { width: 40, height: 40, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  categoryLabel: { fontSize: 10, fontWeight: '600' },
});
