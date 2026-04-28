import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { Audio } from 'expo-av';
import OnboardingBackground from '../OnboardingBackground';

const RINGTONE_ASSET = require('../../assets/audio/freesound_community-ring-tone-68676.mp3');

type Props = {
  visible: boolean;
  mode: 'audio' | 'video' | null;
  direction: 'incoming' | 'outgoing';
  status: 'ringing' | 'ongoing';
  durationSeconds?: number;
  userName: string;
  userImageUri?: string;
  isOnline: boolean;
  colors: any;
  onAccept?: () => void;
  onDecline?: () => void;
  onEnd: () => void;
};

function hexToRgb(hex?: string) {
  if (!hex) return null;
  const cleaned = hex.replace('#', '').trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;

  if (full.length !== 6) return null;
  const int = Number.parseInt(full, 16);
  if (Number.isNaN(int)) return null;

  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function isLightColor(hex?: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness >= 160;
}

const formatDuration = (seconds: number) => {
  const total = Math.max(0, seconds);
  const mins = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const secs = (total % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export default function CallSessionModal({
  visible,
  mode,
  direction,
  status,
  durationSeconds = 0,
  userName,
  userImageUri,
  isOnline,
  colors,
  onAccept,
  onDecline,
  onEnd,
}: Props) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [speakerOn, setSpeakerOn] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [cameraFacing, setCameraFacing] = React.useState<'front' | 'back'>('front');
  const ringtoneRef = React.useRef<Audio.Sound | null>(null);
  const vibrationLoopRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const isMutedRef = React.useRef(isMuted);

  React.useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  React.useEffect(() => {
    if (!visible) {
      setIsMuted(false);
      setSpeakerOn(true);
      setVideoEnabled(true);
      setCameraFacing('front');
    }
  }, [visible]);

  React.useEffect(() => {
    if (!visible) return;
    void Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: !speakerOn,
    });
  }, [speakerOn, visible]);

  React.useEffect(() => {
    if (!ringtoneRef.current) return;
    void ringtoneRef.current.setVolumeAsync(isMuted ? 0 : 1);
  }, [isMuted]);

  React.useEffect(() => {
    const cleanupRing = async () => {
      if (vibrationLoopRef.current) {
        clearInterval(vibrationLoopRef.current);
        vibrationLoopRef.current = null;
      }
      Vibration.cancel();
      if (ringtoneRef.current) {
        try {
          await ringtoneRef.current.stopAsync();
          await ringtoneRef.current.unloadAsync();
        } catch {
          // ignore cleanup errors
        }
        ringtoneRef.current = null;
      }
    };

    if (!visible || status !== 'ringing') {
      void cleanupRing();
      return;
    }

    let cancelled = false;
    const startRing = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          RINGTONE_ASSET,
          { shouldPlay: true, isLooping: true, volume: isMutedRef.current ? 0 : 1 }
        );
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        ringtoneRef.current = sound;
      } catch {
        vibrationLoopRef.current = setInterval(() => {
          Vibration.vibrate([0, 300, 200], false);
        }, 900);
      }
    };

    void startRing();
    return () => {
      cancelled = true;
      void cleanupRing();
    };
  }, [visible, status]);

  const label = React.useMemo(() => formatDuration(durationSeconds), [durationSeconds]);
  const isLiveVideo = mode === 'video' && status === 'ongoing' && videoEnabled;
  const isLightTheme = isLightColor(colors?.surface);
  const headingColor = isLightTheme ? colors?.textMain ?? '#16223a' : '#fff';
  const subTextColor = isLightTheme ? colors?.textMuted ?? '#5b6b86' : '#D1D5DB';
  const timerColor = isLightTheme ? colors?.brandBlueDark ?? '#144a95' : '#C7D2FE';
  const controlBarBg = isLightTheme ? 'rgba(255,255,255,0.9)' : '#18181B';
  const controlBarBorder = isLightTheme ? 'rgba(22,34,58,0.10)' : 'transparent';
  const neutralControlBg = isLightTheme ? '#E8EEF8' : '#3F3F46';
  const mutedControlBg = isLightTheme ? '#D7DFED' : '#27272A';
  const neutralIconColor = isLightTheme ? colors?.textMain ?? '#111827' : '#fff';
  const overlayColor = isLiveVideo
    ? (isLightTheme ? '#00000044' : '#00000088')
    : (isLightTheme ? '#FFFFFF22' : '#00000033');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onEnd}>
      <View style={[styles.root, { backgroundColor: isLiveVideo ? '#000' : colors.surface }]}>
        {!isLiveVideo ? (
          <OnboardingBackground
            primary={colors.brandBlue ?? '#1e5fb8'}
            secondary={colors.brandOrange ?? '#f28c28'}
            soft={colors.brandBlueSoft ?? '#e7f1ff'}
          />
        ) : null}

        {isLiveVideo ? <CameraView style={StyleSheet.absoluteFillObject} facing={cameraFacing} /> : null}

        <View style={[styles.darkOverlay, { backgroundColor: overlayColor }]} />

        <View style={styles.overlay}>
          <View style={styles.topMeta}>
            <Text style={[styles.nameSmall, { color: headingColor }]}>{userName}</Text>
            <Text style={[styles.state, { color: subTextColor }]}>
              {status === 'ringing'
                ? direction === 'incoming'
                  ? 'Incoming call...'
                  : isOnline
                  ? 'Ringing...'
                  : 'Calling...'
                : 'On call'}
            </Text>
          </View>

          <View style={styles.center}>
            <View style={styles.avatarCircle}>
              {userImageUri ? (
                <Image source={{ uri: userImageUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={62} color={isLightTheme ? '#EEF2FF' : '#D8D4F8'} />
              )}
            </View>
            {status === 'ongoing' ? (
              <Text style={[styles.timer, { color: timerColor }]}>{label}</Text>
            ) : null}
          </View>

          {status === 'ringing' && direction === 'incoming' ? (
            <View style={styles.incomingActions}>
              <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineBtn} onPress={onDecline}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.controlsBar, { backgroundColor: controlBarBg, borderColor: controlBarBorder }]}>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: mode === 'video' ? neutralControlBg : mutedControlBg }]}
                disabled={mode !== 'video'}
                onPress={() => {
                  if (mode !== 'video') return;
                  setCameraFacing((prev) => (prev === 'front' ? 'back' : 'front'));
                }}
              >
                <Ionicons name="camera-reverse-outline" size={20} color={neutralIconColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: videoEnabled ? neutralControlBg : '#DC2626' }]}
                onPress={() => setVideoEnabled((v) => !v)}
              >
                <Ionicons name={videoEnabled ? 'videocam' : 'videocam-off'} size={20} color={videoEnabled ? neutralIconColor : '#fff'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: speakerOn ? '#fff' : neutralControlBg }]}
                onPress={() => setSpeakerOn((s) => !s)}
              >
                <Ionicons name={speakerOn ? 'volume-high' : 'volume-mute'} size={20} color={speakerOn ? '#111827' : neutralIconColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: isMuted ? '#DC2626' : neutralControlBg }]}
                onPress={() => setIsMuted((m) => !m)}
              >
                <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={20} color={isMuted ? '#fff' : neutralIconColor} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, { backgroundColor: '#E11D48' }]} onPress={onEnd}>
                <Ionicons name="call" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05070B' },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000088' },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 84,
    paddingBottom: 46,
  },
  topMeta: { alignItems: 'center' },
  nameSmall: { fontSize: 32, fontWeight: '800', color: '#fff' },
  state: { marginTop: 6, fontSize: 18, color: '#D1D5DB', fontWeight: '600' },
  center: { alignItems: 'center' },
  avatarCircle: {
    width: 214,
    height: 214,
    borderRadius: 107,
    backgroundColor: '#4C3F9A',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  timer: { marginTop: 12, fontSize: 16, color: '#C7D2FE', fontWeight: '700' },
  controlsBar: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  acceptText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  declineBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  declineText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});