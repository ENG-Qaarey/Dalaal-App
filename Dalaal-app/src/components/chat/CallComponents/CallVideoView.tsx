import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  RTCView: any;
  remoteStream?: any;
  localStream?: any;
  videoEnabled: boolean;
  cameraFacing: 'front' | 'back';
};

export default function CallVideoView({
  RTCView,
  remoteStream,
  localStream,
  videoEnabled,
  cameraFacing,
}: Props) {
  if (!RTCView) {
    return (
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="person" size={120} color="#3F3F46" />
        <Text style={{ color: '#A1A1AA', marginTop: 16, fontSize: 16, textAlign: 'center', paddingHorizontal: 40 }}>
          Video not supported in Expo Go. Please use a Development Build.
        </Text>
      </View>
    );
  }

  return (
    <>
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={StyleSheet.absoluteFillObject}
          objectFit="cover"
          mirror={false}
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center' }]}>
          <Ionicons name="person" size={120} color="#3F3F46" />
          <Text style={{ color: '#A1A1AA', marginTop: 16, fontSize: 16 }}>Waiting for remote video...</Text>
        </View>
      )}

      {localStream && videoEnabled ? (
        <View style={styles.localVideoContainer}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
            mirror={cameraFacing === 'front'}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  localVideoContainer: {
    position: 'absolute',
    top: 84,
    right: 24,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
});
