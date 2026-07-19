import React, { memo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';
import { spacing, radius, fontSize } from '../../constants/tokens';

type Clip = {
  id: string;
  price: string;
  title: string;
  location: string;
  tag: string;
  video: string;
  poster?: string;
};

type Props = {
  clips: Clip[];
  playingClipId: string | null;
  onClipPress: (clip: Clip) => void;
  colors: ThemePalette;
};

const ClipThumb = memo(function ClipThumb({ poster, title }: { poster?: string; title: string }) {
  if (poster) {
    return <Image source={{ uri: poster }} style={styles.thumb} />;
  }
  return (
    <View style={[styles.thumb, styles.thumbFallback]}>
      <Ionicons name="videocam" size={26} color="rgba(255,255,255,0.5)" />
      <Text style={styles.thumbFallbackText} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
});

/** Web strip — thumbnails only; playback is handled by HomeClipsPlayer.web */
export default function HomeClips({ clips, playingClipId, onClipPress, colors }: Props) {
  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textMain }]}>Clips</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Swipe through property tours</Text>
        </View>
        <View style={[styles.livePill, { backgroundColor: colors.brandBlueSoft }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.brandOrange }]} />
          <Text style={[styles.liveText, { color: colors.brandBlue }]}>{clips.length} tours</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {clips.map((clip) => {
          const active = playingClipId === clip.id;
          return (
            <TouchableOpacity
              key={clip.id}
              activeOpacity={0.9}
              onPress={() => onClipPress(clip)}
              style={[styles.card, { borderColor: active ? colors.brandOrange : 'transparent', cursor: 'pointer' } as object]}
              accessibilityRole="button"
              accessibilityLabel={`Play clip ${clip.title}`}
            >
              <ClipThumb poster={clip.poster} title={clip.title} />
              <View style={styles.overlay} />
              <View style={styles.tag}>
                <Ionicons name="play" size={11} color="#fff" />
                <Text style={styles.tagText}>{clip.tag || 'Tour'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.price}>{clip.price}</Text>
                <Text style={styles.name} numberOfLines={1}>{clip.title}</Text>
                <Text style={styles.loc} numberOfLines={1}>{clip.location}</Text>
              </View>
              <View style={styles.playCircle}>
                <Ionicons name="play" size={18} color="#fff" style={{ marginLeft: 2 }} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: fontSize.subtitle, fontWeight: '800' },
  subtitle: { fontSize: fontSize.caption, fontWeight: '500', marginTop: 2 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 11, fontWeight: '700' },
  scroll: { marginBottom: spacing.lg },
  scrollContent: { paddingLeft: spacing.lg, paddingRight: spacing.sm },
  card: {
    width: 148,
    height: 232,
    borderRadius: radius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    backgroundColor: '#111827',
    borderWidth: 2,
  },
  thumb: { width: '100%', height: '100%' },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2333',
    padding: spacing.sm,
  },
  thumbFallbackText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
  tag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.sm },
  price: { color: '#fff', fontSize: fontSize.small, fontWeight: '900' },
  name: { color: '#fff', fontSize: fontSize.caption, fontWeight: '700', marginTop: 2 },
  loc: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '500', marginTop: 2 },
  playCircle: {
    position: 'absolute',
    top: '42%',
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
