import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  visible: boolean;
  colors: any;
  onClose: () => void;
  onCapture: (uri: string) => void;
};

export default function ChatCameraModal({ visible, colors, onClose, onCapture }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = React.useState<CameraType>('back');
  const [flash, setFlash] = React.useState<FlashMode>('off');
  const [capturing, setCapturing] = React.useState(false);
  const cameraRef = React.useRef<CameraView | null>(null);

  React.useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission().catch(() => null);
    }
  }, [visible, permission?.granted, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (photo?.uri) {
        onCapture(photo.uri);
      }
      onClose();
    } finally {
      setCapturing(false);
    }
  };

  const handlePickFromGallery = async () => {
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    onCapture(uri);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.root}>
        {!permission?.granted ? (
          <View style={styles.center}>
            <Text style={styles.permissionText}>Camera permission is required.</Text>
            <TouchableOpacity style={[styles.permissionBtn, { backgroundColor: colors.brandBlue }]} onPress={requestPermission}>
              <Text style={styles.permissionBtnText}>Enable Camera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing={cameraType} flash={flash}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.topBtn} onPress={onClose}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={styles.topRight}>
                <TouchableOpacity
                  style={styles.topBtn}
                  onPress={() => setFlash((prev) => (prev === 'off' ? 'on' : 'off'))}
                >
                  <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.topBtn}
                  onPress={() => setCameraType((prev) => (prev === 'back' ? 'front' : 'back'))}
                >
                  <Ionicons name="camera-reverse-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.sideAction} onPress={handlePickFromGallery}>
                <Ionicons name="images-outline" size={26} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.shutterOuter} onPress={handleCapture} disabled={capturing}>
                {capturing ? (
                  <ActivityIndicator color="#111" />
                ) : (
                  <View style={styles.shutterInner} />
                )}
              </TouchableOpacity>

              <View style={styles.sideAction} />
            </View>
          </CameraView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  permissionText: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  permissionBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  permissionBtnText: { color: '#fff', fontWeight: '700' },
  topBar: {
    marginTop: 54,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topRight: { flexDirection: 'row', gap: 10 },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  sideAction: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff22',
  },
  shutterInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
});
