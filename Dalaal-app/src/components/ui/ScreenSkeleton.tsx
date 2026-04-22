import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/theme';
import { useAppTheme } from '../../context/theme-context';
import Skeleton from './Skeleton';

type ScreenSkeletonProps = {
  variant?: 'home' | 'list' | 'detail' | 'profile' | 'form' | 'chat';
};

export default function ScreenSkeleton({ variant = 'list' }: ScreenSkeletonProps) {
  const { scheme } = useAppTheme();
  const C = Colors[scheme];

  if (variant === 'home') {
    return (
      <View style={[styles.container, { backgroundColor: C.surface }]}>
        <Skeleton width="40%" height={22} />
        <Skeleton height={48} borderRadius={12} style={styles.spaced} />
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.gridItem}>
              <Skeleton width={48} height={48} borderRadius={14} />
              <Skeleton width="70%" height={10} style={styles.label} />
            </View>
          ))}
        </View>
        <Skeleton width="30%" height={18} style={styles.spacedLarge} />
        <View style={styles.cardStack}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.card}>
              <Skeleton height={120} borderRadius={10} />
              <Skeleton width="62%" height={14} style={styles.cardLine} />
              <Skeleton width="88%" height={12} style={styles.cardLine} />
              <Skeleton width="42%" height={12} style={styles.cardLine} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (variant === 'detail') {
    return (
      <View style={[styles.container, { backgroundColor: C.surface }]}>
        <Skeleton width="48%" height={20} />
        <Skeleton width="72%" height={12} style={styles.spaced} />
        <Skeleton height={140} borderRadius={16} style={styles.spacedLarge} />
        <Skeleton width="34%" height={18} style={styles.spacedLarge} />
        <Skeleton height={90} borderRadius={14} style={styles.spaced} />
        <Skeleton height={150} borderRadius={14} style={styles.spaced} />
      </View>
    );
  }

  if (variant === 'profile') {
    return (
      <View style={[styles.container, { backgroundColor: C.surface }]}>
        <Skeleton width="34%" height={20} />
        <View style={styles.profileHero}>
          <Skeleton width={64} height={64} borderRadius={20} />
          <View style={styles.profileLines}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="56%" height={12} style={styles.cardLine} />
            <Skeleton width="82%" height={32} borderRadius={999} style={styles.cardLine} />
          </View>
        </View>
        <View style={styles.profileGrid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.profileStat}>
              <Skeleton width="48%" height={18} />
              <Skeleton width="62%" height={10} style={styles.cardLine} />
            </View>
          ))}
        </View>
        <Skeleton height={152} borderRadius={16} style={styles.spacedLarge} />
        <Skeleton height={152} borderRadius={16} style={styles.spaced} />
      </View>
    );
  }

  if (variant === 'form') {
    return (
      <View style={[styles.container, { backgroundColor: C.surface }]}>
        <Skeleton width="46%" height={20} />
        <Skeleton width="72%" height={12} style={styles.spaced} />
        <Skeleton height={54} borderRadius={14} style={styles.spacedLarge} />
        <Skeleton height={54} borderRadius={14} style={styles.spaced} />
        <Skeleton height={54} borderRadius={14} style={styles.spaced} />
        <Skeleton height={54} borderRadius={14} style={styles.spacedLarge} />
        <Skeleton height={48} borderRadius={14} style={styles.spaced} />
      </View>
    );
  }

  if (variant === 'chat') {
    return (
      <View style={[styles.container, { backgroundColor: C.surface }]}>
        <Skeleton width="30%" height={20} />
        <View style={styles.chatStack}>
          <Skeleton width="72%" height={54} borderRadius={18} />
          <Skeleton width="58%" height={54} borderRadius={18} style={styles.chatRight} />
          <Skeleton width="66%" height={54} borderRadius={18} />
          <Skeleton width="52%" height={54} borderRadius={18} style={styles.chatRight} />
        </View>
        <Skeleton height={52} borderRadius={16} style={styles.spacedLarge} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.surface }]}>
      <Skeleton width="40%" height={20} />
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} height={18} borderRadius={10} style={index === 0 ? styles.spacedLarge : styles.spaced} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 10,
  },
  spaced: {
    marginTop: 6,
  },
  spacedLarge: {
    marginTop: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    marginTop: 10,
  },
  label: {
    marginTop: 8,
  },
  cardStack: {
    gap: 14,
  },
  card: {
    gap: 8,
  },
  cardLine: {
    marginTop: 8,
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  profileLines: {
    flex: 1,
  },
  profileGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  profileStat: {
    flex: 1,
    borderRadius: 14,
  },
  chatStack: {
    marginTop: 6,
    gap: 12,
  },
  chatRight: {
    alignSelf: 'flex-end',
  },
});