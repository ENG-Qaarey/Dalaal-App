import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  query: string;
  setQuery: (q: string) => void;
  onClear: () => void;
  colors: any;
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
      <Ionicons name="search" size={15} color={colors.textMuted} style={{ marginRight: 7 }} />
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
          <Ionicons name="close" size={14} color={colors.brandBlue} />
        </TouchableOpacity>
      ) : (
        <View style={styles.searchGo} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { marginHorizontal: 14, marginTop: 7, marginBottom: 8, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 11 },
  searchGo: { height: 22, width: 22, alignItems: 'center', justifyContent: 'center' },
});
