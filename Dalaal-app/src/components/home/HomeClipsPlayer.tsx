import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ThemePalette } from '../../constants/theme';

type Clip = {
  id: string;
  price: string;
  title: string;
  location: string;
  tag?: string;
  video: string;
  poster?: string;
};

type Props = {
  visible: boolean;
  clips: Clip[];
  selectedClip: Clip | null;
  setSelectedClip: (clip: Clip) => void;
  onClose: () => void;
  colors: ThemePalette;
  userAvatar?: string;
};

function ClipVideo({
  uri,
  isPaused,
  isMuted,
  onProgress,
}: {
  uri: string;
  isPaused: boolean;
  isMuted: boolean;
  onProgress: (current: number, duration: number) => void;
}) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = isMuted;
    p.timeUpdateEventInterval = 0.25;
    p.play();
  });

  useEffect(() => {
    if (isPaused) player.pause();
    else player.play();
  }, [isPaused, player]);

  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  useEventListener(player, 'timeUpdate', (payload) => {
    if (!payload) return;
    const current = typeof payload.currentTime === 'number' ? payload.currentTime : 0;
    const duration = typeof player.duration === 'number' ? player.duration : 0;
    onProgress(current, duration);
  });

  return (
    <VideoView
      style={StyleSheet.absoluteFill}
      player={player}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

export default function HomeClipsPlayer({
  visible,
  clips,
  selectedClip,
  setSelectedClip,
  onClose,
  colors,
  userAvatar,
}: Props) {
  const insets = useSafeAreaInsets();
  const window = Dimensions.get('window');
  const FALLBACK_AVATAR = 'https://i.pravatar.cc/160?img=14';

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });

  const currentIndex = useMemo(() => {
    if (!selectedClip) return 0;
    const idx = clips.findIndex((c) => c.id === selectedClip.id);
    return idx >= 0 ? idx : 0;
  }, [clips, selectedClip]);

  useEffect(() => {
    if (!visible) return;
    setIsPaused(false);
    setProgress({ current: 0, duration: 0 });
    setIsLiked(false);
    setIsSaved(false);
  }, [visible, selectedClip?.id]);

  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dy) > 24 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderRelease: (_, g) => {
          if (g.dy < -48) {
            if (currentIndex < clips.length - 1) setSelectedClip(clips[currentIndex + 1]);
          } else if (g.dy > 48) {
            if (currentIndex > 0) setSelectedClip(clips[currentIndex - 1]);
          }
        },
      }).panHandlers,
    [clips, currentIndex, setSelectedClip]
  );

  if (!selectedClip) return null;

  const progressPct =
    progress.duration > 0 ? Math.min(100, (progress.current / progress.duration) * 100) : 0;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.root, { width: window.width, height: window.height }]} {...panHandlers}>
        {selectedClip.poster ? (
          <Image source={{ uri: selectedClip.poster }} style={StyleSheet.absoluteFillObject} blurRadius={2} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0b1220' }]} />
        )}

        {visible ? (
          <ClipVideo
            key={selectedClip.id}
            uri={selectedClip.video}
            isPaused={isPaused}
            isMuted={isMuted}
            onProgress={(current, duration) => setProgress({ current, duration })}
          />
        ) : null}

        <View style={styles.scrimTop} pointerEvents="none" />
        <View style={styles.scrimBottom} pointerEvents="none" />

        <TouchableOpacity
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
          onPress={() => setIsPaused((p) => !p)}
        >
          {isPaused ? (
            <View style={styles.centerPlay}>
              <View style={styles.centerPlayInner}>
                <Ionicons name="play" size={42} color="#fff" style={{ marginLeft: 4 }} />
              </View>
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 12) }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentIndex + 1}/{clips.length}
            </Text>
          </View>
        </View>

        <View style={[styles.sideActions, { bottom: 120 + insets.bottom }]}>
          <Image source={{ uri: userAvatar || FALLBACK_AVATAR }} style={styles.sideAvatar} />
          <Action
            icon={isLiked ? 'heart' : 'heart-outline'}
            label="Like"
            color={isLiked ? '#ff3b30' : '#fff'}
            onPress={() => setIsLiked((v) => !v)}
          />
          <Action
            icon={isSaved ? 'bookmark' : 'bookmark-outline'}
            label="Save"
            color={isSaved ? colors.brandOrange : '#fff'}
            onPress={() => setIsSaved((v) => !v)}
          />
          <Action
            icon="share-social-outline"
            label="Share"
            onPress={async () => {
              try {
                await Share.share({
                  message: `${selectedClip.title} · ${selectedClip.location} · ${selectedClip.price}`,
                  url: selectedClip.video,
                });
              } catch {
                // ignore
              }
            }}
          />
          <Action
            icon={isMuted ? 'volume-mute' : 'volume-high'}
            label={isMuted ? 'Muted' : 'Sound'}
            onPress={() => setIsMuted((v) => !v)}
          />
        </View>

        <View
          style={[
            styles.bottom,
            {
              paddingBottom: Math.max(insets.bottom, 20),
              paddingLeft: 16 + insets.left,
              paddingRight: 78 + insets.right,
            },
          ]}
        >
          <Text style={styles.broker}>Dalaal · Property Tour</Text>
          <Text style={styles.title}>{selectedClip.title}</Text>
          <Text style={styles.meta}>
            {selectedClip.location} · {selectedClip.price}
          </Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: colors.brandOrange }]} />
          </View>

          <Text style={styles.hint}>Swipe up for next clip</Text>
        </View>
      </View>
    </Modal>
  );
}

function Action({
  icon,
  label,
  onPress,
  color = '#fff',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity style={styles.action} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  scrimTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  counter: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  counterText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  sideActions: {
    position: 'absolute',
    right: 12,
    alignItems: 'center',
    zIndex: 20,
    gap: 14,
  },
  sideAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 4,
  },
  action: { alignItems: 'center' },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 4 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20 },
  broker: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  meta: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500', marginBottom: 14 },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  hint: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '500',
  },
  centerPlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlayInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
