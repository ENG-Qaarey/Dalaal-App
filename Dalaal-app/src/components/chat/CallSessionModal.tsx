import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { Audio } from 'expo-av';

const RINGTONE_ASSET = require('../../assets/audio/freesound_community-ring-tone-68676.mp3');

type Props = {
  visible: boolean;
  mode: 'audio' | 'video' | null;
  userName: string;
  userImageUri?: string;
  isOnline: boolean;
  colors: any;
  onEnd: () => void;
};

export default function CallSessionModal({ visible, mode, userName, userImageUri, isOnline, colors, onEnd }: Props) {
  const [seconds, setSeconds] = React.useState(0);
  const [phase, setPhase] = React.useState<'ringing' | 'no_answer'>('ringing');
  const [isMuted, setIsMuted] = React.useState(false);
  const [speakerOn, setSpeakerOn] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [cameraFacing, setCameraFacing] = React.useState<'front' | 'back'>('front');
  const ringtoneRef = React.useRef<Audio.Sound | null>(null);
  const vibrationLoopRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    if (!visible) {
      setSeconds(0);
      setPhase('ringing');
      setIsMuted(false);
      setSpeakerOn(true);
      setVideoEnabled(true);
      setCameraFacing('front');
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [visible]);

  React.useEffect(() => {
    if (!visible) return;
    if (seconds >= 60 && phase === 'ringing') {
      setPhase('no_answer');
    }
  }, [seconds, phase, visible]);

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

    if (!visible || phase !== 'ringing') {
      void cleanupRing();
      return;
    }

    let cancelled = false;
    const startRing = async () => {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          RINGTONE_ASSET,
          { shouldPlay: true, isLooping: true, volume: isMuted ? 0 : 1 }
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
  }, [visible, phase, isMuted]);

  const label = React.useMemo(() => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [seconds]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onEnd}>
      <View style={[styles.root, { backgroundColor: mode === 'video' ? '#000' : colors.surface }]}>
        {mode === 'video' && phase === 'ringing' && videoEnabled ? (
          <CameraView style={StyleSheet.absoluteFillObject} facing={cameraFacing} />
        ) : null}

        <View style={styles.darkOverlay} />
        {phase === 'ringing' ? (
          <View style={styles.overlay}>
            <View style={styles.topMeta}>
              <Text style={styles.nameSmall}>{userName}</Text>
              <Text style={styles.state}>{isOnline ? 'Ringing...' : 'Calling...'}</Text>
            </View>
            <View style={styles.center}>
              <View style={styles.avatarCircle}>
                {userImageUri ? (
                  <Image source={{ uri: userImageUri }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={62} color="#D8D4F8" />
                )}
              </View>
              <Text style={styles.timer}>{label}</Text>
            </View>
            <View style={styles.controlsBar}>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: mode === 'video' ? '#3F3F46' : '#27272A' }]}
                disabled={mode !== 'video'}
                onPress={() => {
                  if (mode !== 'video') return;
                  setCameraFacing((prev) => (prev === 'front' ? 'back' : 'front'));
                }}
              >
                <Ionicons name="camera-reverse-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: videoEnabled ? '#3F3F46' : '#DC2626' }]}
                onPress={() => setVideoEnabled((v) => !v)}
              >
                <Ionicons name={videoEnabled ? 'videocam' : 'videocam-off'} size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: speakerOn ? '#fff' : '#3F3F46' }]}
                onPress={() => setSpeakerOn((s) => !s)}
              >
                <Ionicons name={speakerOn ? 'volume-high' : 'volume-mute'} size={20} color={speakerOn ? '#111827' : '#fff'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlBtn, { backgroundColor: isMuted ? '#DC2626' : '#3F3F46' }]}
                onPress={() => setIsMuted((m) => !m)}
              >
                <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, { backgroundColor: '#E11D48' }]} onPress={onEnd}>
                <Ionicons name="call" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.overlayNoAnswer}>
            <View style={styles.avatarCircleSmall}>
              <Ionicons name="person" size={44} color="#D8D4F8" />
            </View>
            <Text style={styles.nameLarge}>{userName}</Text>
            <Text style={styles.noAnswerText}>No answer</Text>
            <View style={styles.noAnswerActions}>
              <TouchableOpacity style={styles.noAnswerBtn} onPress={onEnd}>
                <View style={[styles.noAnswerIcon, { backgroundColor: '#fff' }]}>
                  <Ionicons name="close" size={24} color="#111827" />
                </View>
                <Text style={styles.noAnswerLabel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noAnswerBtn} onPress={onEnd}>
                <View style={[styles.noAnswerIcon, { backgroundColor: '#3F3F46' }]}>
                  <Ionicons name="mic" size={24} color="#fff" />
                </View>
                <Text style={styles.noAnswerLabel}>Record voice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.noAnswerBtn}
                onPress={() => {
                  setSeconds(0);
                  setPhase('ringing');
                }}
              >
                <View style={[styles.noAnswerIcon, { backgroundColor: '#22C55E' }]}>
                  <Ionicons name="call" size={24} color="#fff" />
                </View>
                <Text style={styles.noAnswerLabel}>Call again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  overlayNoAnswer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 120,
  },
  avatarCircleSmall: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#4C3F9A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameLarge: { marginTop: 24, fontSize: 48, fontWeight: '900', color: '#fff' },
  noAnswerText: { marginTop: 6, fontSize: 22, fontWeight: '700', color: '#D1D5DB' },
  noAnswerActions: {
    marginTop: 'auto',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noAnswerBtn: { alignItems: 'center', width: '31%' },
  noAnswerIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAnswerLabel: { marginTop: 10, fontSize: 19, color: '#E5E7EB', fontWeight: '600', textAlign: 'center' },
});
