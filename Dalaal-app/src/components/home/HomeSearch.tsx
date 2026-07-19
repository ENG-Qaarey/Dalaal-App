import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { spacing, radius, fontSize } from '../../constants/tokens';

type Props = {
  query: string;
  setQuery: (q: string) => void;
  onClear: () => void;
  colors: ThemePalette;
  scheme: 'light' | 'dark';
};

export default function HomeSearch({ query, setQuery, onClear, colors, scheme }: Props) {
  return (
    <View style={[
      styles.searchRow,
      {
        backgroundColor: scheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
        borderColor: colors.brandBorder
      }
    ]}>
      <Ionicons name="search" size={fontSize.small} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search properties, vehicles..."
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        style={[styles.searchInput, { color: colors.textMain }]}
      />
      {query.length > 0 ? (
        <TouchableOpacity onPress={onClear} activeOpacity={0.85} style={styles.searchGo}>
          <Ionicons name="close" size={fontSize.caption} color={colors.brandBlue} />
        </TouchableOpacity>
      ) : (
        <View style={styles.searchGo} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { marginHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.sm, borderRadius: radius.input, flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: fontSize.small },
  searchGo: { height: spacing.xl, width: spacing.xl, alignItems: 'center', justifyContent: 'center' },
});
