import React from 'react';
import { Modal, StyleSheet, Vibration, View } from 'react-native';
import { Audio } from 'expo-av';
import OnboardingBackground from '../OnboardingBackground';

// Sub-components
import CallHeader from './CallComponents/CallHeader';
import CallAvatar from './CallComponents/CallAvatar';
import CallIncomingActions from './CallComponents/CallIncomingActions';
import CallControls from './CallComponents/CallControls';
import CallVideoView from './CallComponents/CallVideoView';

let RTCView: any = null;
try {
  const webrtc = require('react-native-webrtc');
  RTCView = webrtc.RTCView;
} catch (e) {
  RTCView = null;
}

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
  localStream?: any;
  remoteStream?: any;
  onToggleMute?: (muted: boolean) => void;
  onToggleVideo?: (enabled: boolean) => void;
  onSwitchCamera?: () => void;
};

function hexToRgb(hex?: string) {
  if (!hex) return null;
  const cleaned = hex.replace('#', '').trim();
  const full = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned;
  if (full.length !== 6) return null;
  const int = Number.parseInt(full, 16);
  if (Number.isNaN(int)) return null;
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function isLightColor(hex?: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness >= 160;
}

const formatDuration = (seconds: number) => {
  const total = Math.max(0, seconds);
  const mins = Math.floor(total / 60).toString().padStart(2, '0');
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
  localStream,
  remoteStream,
  onToggleMute,
  onToggleVideo,
  onSwitchCamera,
}: Props) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [speakerOn, setSpeakerOn] = React.useState(true);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [cameraFacing, setCameraFacing] = React.useState<'front' | 'back'>('front');
  const ringtoneRef = React.useRef<Audio.Sound | null>(null);
  const vibrationLoopRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const isMutedRef = React.useRef(isMuted);

  React.useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

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
      allowsRecordingIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: !speakerOn,
    });
  }, [speakerOn, visible, status]);

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
        } catch { /* ignore */ }
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
        if (cancelled) { await sound.unloadAsync(); return; }
        ringtoneRef.current = sound;
      } catch {
        vibrationLoopRef.current = setInterval(() => { Vibration.vibrate([0, 300, 200], false); }, 900);
      }
    };
    void startRing();
    return () => { cancelled = true; void cleanupRing(); };
  }, [visible, status]);

  const [isSignaling, setIsSignaling] = React.useState(false);
  React.useEffect(() => {
    if (visible && status === 'ringing' && direction === 'outgoing') {
      setIsSignaling(true);
      const timer = setTimeout(() => setIsSignaling(false), 1500);
      return () => clearTimeout(timer);
    } else { setIsSignaling(false); }
  }, [visible, status, direction]);

  const label = React.useMemo(() => formatDuration(durationSeconds), [durationSeconds]);
  const canUseVideoControls = mode === 'video' && status === 'ongoing';
  const isLiveVideo = mode === 'video' && status === 'ongoing' && videoEnabled && (localStream || remoteStream);
  
  const isLightTheme = isLightColor(colors?.surface);
  const theme = {
    headingColor: isLightTheme ? colors?.textMain ?? '#16223a' : '#fff',
    subTextColor: isLightTheme ? colors?.textMuted ?? '#5b6b86' : '#D1D5DB',
    timerColor: isLightTheme ? colors?.brandBlueDark ?? '#144a95' : '#C7D2FE',
    controlBarBg: isLightTheme ? 'rgba(255,255,255,0.9)' : '#18181B',
    controlBarBorder: isLightTheme ? 'rgba(22,34,58,0.10)' : 'transparent',
    neutralControlBg: isLightTheme ? '#E8EEF8' : '#3F3F46',
    mutedControlBg: isLightTheme ? '#D7DFED' : '#27272A',
    neutralIconColor: isLightTheme ? colors?.textMain ?? '#111827' : '#fff',
    overlayColor: isLiveVideo ? (isLightTheme ? '#00000044' : '#00000088') : (isLightTheme ? '#FFFFFF22' : '#00000033'),
  };

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

        {isLiveVideo ? (
          <CallVideoView
            RTCView={RTCView}
            remoteStream={remoteStream}
            localStream={localStream}
            videoEnabled={videoEnabled}
            cameraFacing={cameraFacing}
          />
        ) : null}

        <View style={[styles.darkOverlay, { backgroundColor: theme.overlayColor }]} />

        <View style={styles.overlay}>
          <CallHeader
            userName={userName}
            status={status}
            direction={direction}
            isOnline={isOnline}
            isSignaling={isSignaling}
            headingColor={theme.headingColor}
            subTextColor={theme.subTextColor}
          />

          <CallAvatar
            userImageUri={userImageUri}
            status={status}
            label={label}
            timerColor={theme.timerColor}
            isLightTheme={isLightTheme}
          />

          {status === 'ringing' && direction === 'incoming' ? (
            <CallIncomingActions onAccept={onAccept} onDecline={onDecline} />
          ) : (
            <CallControls
              mode={mode}
              speakerOn={speakerOn}
              isMuted={isMuted}
              videoEnabled={videoEnabled}
              canUseVideoControls={canUseVideoControls}
              neutralControlBg={theme.neutralControlBg}
              mutedControlBg={theme.mutedControlBg}
              neutralIconColor={theme.neutralIconColor}
              controlBarBg={theme.controlBarBg}
              controlBarBorder={theme.controlBarBorder}
              onSwitchCamera={() => {
                if (onSwitchCamera) onSwitchCamera();
                setCameraFacing((p) => (p === 'front' ? 'back' : 'front'));
              }}
              onToggleVideo={() => {
                const next = !videoEnabled;
                setVideoEnabled(next);
                if (onToggleVideo) onToggleVideo(next);
              }}
              onToggleSpeaker={() => setSpeakerOn(!speakerOn)}
              onToggleMute={() => {
                const next = !isMuted;
                setIsMuted(next);
                if (onToggleMute) onToggleMute(next);
              }}
              onEnd={onEnd}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05070B' },
  darkOverlay: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 84,
    paddingBottom: 46,
  },
});