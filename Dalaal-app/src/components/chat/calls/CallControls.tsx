import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  mode: 'audio' | 'video' | null;
  speakerOn: boolean;
  isMuted: boolean;
  videoEnabled: boolean;
  canUseVideoControls: boolean;
  neutralControlBg: string;
  mutedControlBg: string;
  neutralIconColor: string;
  controlBarBg: string;
  controlBarBorder: string;
  onSwitchCamera?: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
  onToggleMute: () => void;
  onEnd: () => void;
};

export default function CallControls({
  mode,
  speakerOn,
  isMuted,
  videoEnabled,
  canUseVideoControls,
  neutralControlBg,
  mutedControlBg,
  neutralIconColor,
  controlBarBg,
  controlBarBorder,
  onSwitchCamera,
  onToggleVideo,
  onToggleSpeaker,
  onToggleMute,
  onEnd,
}: Props) {
  return (
    <View style={[styles.controlsBar, { backgroundColor: controlBarBg, borderColor: controlBarBorder }]}>
      <TouchableOpacity
        style={[styles.controlBtn, { backgroundColor: mode === 'video' ? neutralControlBg : mutedControlBg }]}
        disabled={mode !== 'video'}
        onPress={onSwitchCamera}
      >
        <Ionicons name="camera-reverse-outline" size={20} color={neutralIconColor} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.controlBtn, { backgroundColor: canUseVideoControls && videoEnabled ? neutralControlBg : '#DC2626' }]}
        disabled={!canUseVideoControls}
        onPress={onToggleVideo}
      >
        <Ionicons
          name={canUseVideoControls && videoEnabled ? 'videocam' : 'videocam-off'}
          size={20}
          color={canUseVideoControls && videoEnabled ? neutralIconColor : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlBtn, { backgroundColor: speakerOn ? '#fff' : neutralControlBg }]}
        onPress={onToggleSpeaker}
      >
        <Ionicons name={speakerOn ? 'volume-high' : 'volume-mute'} size={20} color={speakerOn ? '#111827' : neutralIconColor} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlBtn, { backgroundColor: isMuted ? '#DC2626' : neutralControlBg }]}
        onPress={onToggleMute}
      >
        <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={20} color={isMuted ? '#fff' : neutralIconColor} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.controlBtn, { backgroundColor: '#E11D48' }]} onPress={onEnd}>
        <Ionicons name="call" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsBar: {
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
});
