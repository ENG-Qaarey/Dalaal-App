import React from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';

type Props = {
  visible: boolean;
  mediaItems: Array<{ id: string; kind: 'image' | 'video'; uri: string }>;
  viewerIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function MediaViewer({
  visible,
  mediaItems,
  viewerIndex,
  onClose,
  onIndexChange,
}: Props) {
  const windowWidth = Dimensions.get('window').width;
  const galleryScrollRef = React.useRef<ScrollView | null>(null);

  React.useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        galleryScrollRef.current?.scrollTo({ x: viewerIndex * windowWidth, animated: false });
      });
    }
  }, [visible, viewerIndex, windowWidth]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.viewerRoot}>
        <TouchableOpacity style={styles.viewerClose} onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.viewerCount}>
          {mediaItems.length > 0 ? `${viewerIndex + 1}/${mediaItems.length}` : '0/0'}
        </Text>
        <ScrollView
          ref={galleryScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const width = event.nativeEvent.layoutMeasurement.width || 1;
            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            onIndexChange(nextIndex);
          }}
        >
          {mediaItems.map((item) => (
            <View key={item.id} style={[styles.viewerSlide, { width: windowWidth }]}>
              {item.kind === 'image' ? (
                <ScrollView
                  style={styles.zoomWrap}
                  contentContainerStyle={styles.zoomContent}
                  minimumZoomScale={1}
                  maximumZoomScale={4}
                  bouncesZoom={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  centerContent
                >
                  <Image source={{ uri: item.uri }} style={styles.viewerImage} resizeMode="contain" />
                </ScrollView>
              ) : (
                <Video source={{ uri: item.uri }} style={styles.viewerImage} useNativeControls resizeMode={ResizeMode.CONTAIN} shouldPlay />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewerRoot: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  viewerClose: {
    position: 'absolute',
    top: 52,
    right: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111AA',
  },
  viewerImage: { width: '100%', height: '100%' },
  viewerSlide: { height: '100%' },
  zoomWrap: { width: '100%', height: '100%' },
  zoomContent: { flexGrow: 1, justifyContent: 'center' },
  viewerCount: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    zIndex: 1,
    backgroundColor: '#111111AA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
});
