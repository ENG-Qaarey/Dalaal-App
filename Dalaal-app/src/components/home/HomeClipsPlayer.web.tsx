import React, { useEffect, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ThemePalette } from '../../constants/theme';

type Clip = {
  id: string;
  price: string;
  title: string;
  location: string;
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

function WebClipVideo({
  clip,
  isPlaying,
  isMuted,
  onTimeUpdate,
}: {
  clip: Clip;
  isPlaying: boolean;
  isMuted: boolean;
  onTimeUpdate: (current: number, duration: number) => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    if (isPlaying) el.play().catch(() => {});
  }, [clip.id]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) el.play().catch(() => {});
    else el.pause();
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  return (
    // @ts-expect-error web video element
    <video
      ref={videoRef}
      key={clip.id}
      src={clip.video}
      poster={clip.poster}
      loop
      playsInline
      muted={isMuted}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        backgroundColor: '#000',
      }}
      onTimeUpdate={() => {
        const el = videoRef.current;
        if (!el) return;
        onTimeUpdate(el.currentTime || 0, el.duration || 0);
      }}
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
}: Props) {
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
  }, [visible, selectedClip?.id]);

  if (!selectedClip) return null;

  const goNext = () => {
    if (currentIndex < clips.length - 1) setSelectedClip(clips[currentIndex + 1]);
  };
  const goPrev = () => {
    if (currentIndex > 0) setSelectedClip(clips[currentIndex - 1]);
  };

  const progressPct =
    progress.duration > 0 ? Math.min(100, (progress.current / progress.duration) * 100) : 0;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.root}>
        <WebClipVideo
          clip={selectedClip}
          isPlaying={!isPaused}
          isMuted={isMuted}
          onTimeUpdate={(current, duration) => setProgress({ current, duration })}
        />

        <View style={styles.scrim} pointerEvents="none" />

        <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={() => setIsPaused((p) => !p)}>
          {isPaused ? (
            <View style={styles.centerPlay}>
              <View style={styles.centerPlayInner}>
                <Ionicons name="play" size={42} color="#fff" style={{ marginLeft: 4 }} />
              </View>
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.counter}>
            {currentIndex + 1}/{clips.length}
          </Text>
        </View>

        {currentIndex > 0 ? (
          <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={goPrev}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : null}
        {currentIndex < clips.length - 1 ? (
          <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={goNext}>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        ) : null}

        <View style={styles.side}>
          <TouchableOpacity style={styles.action} onPress={() => setIsLiked((v) => !v)}>
            <View style={styles.actionIcon}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#ff3b30' : '#fff'} />
            </View>
            <Text style={styles.actionLabel}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => setIsSaved((v) => !v)}>
            <View style={styles.actionIcon}>
              <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={isSaved ? colors.brandOrange : '#fff'} />
            </View>
            <Text style={styles.actionLabel}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={() => setIsMuted((v) => !v)}>
            <View style={styles.actionIcon}>
              <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>{isMuted ? 'Muted' : 'Sound'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.broker}>Dalaal · Property Tour</Text>
          <Text style={styles.title}>{selectedClip.title}</Text>
          <Text style={styles.meta}>
            {selectedClip.location} · {selectedClip.price}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: colors.brandOrange }]} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.12)' },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  counter: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  arrowLeft: { left: 16 },
  arrowRight: { right: 16 },
  side: { position: 'absolute', right: 16, bottom: 140, zIndex: 10, gap: 14 },
  action: { alignItems: 'center' },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 4 },
  bottom: { position: 'absolute', left: 20, right: 90, bottom: 28, zIndex: 10 },
  broker: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  meta: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4, marginBottom: 12 },
  progressTrack: { height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.28)', overflow: 'hidden' },
  progressFill: { height: '100%' },
  centerPlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
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
