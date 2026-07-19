import { StyleSheet } from 'react-native';
import { spacing, fontSize } from '../../constants/tokens';

export const sectionStyles = StyleSheet.create({
  sectionHeader: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: fontSize.small, fontWeight: '800' },
  seeAll: { fontWeight: '600' },
});
