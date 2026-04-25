import React from 'react';
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  colors: any;
  images: string[];
  activeIndex: number;
  onChangeIndex: (nextIndex: number) => void;
  caption: string;
  onCaptionChange: (value: string) => void;
  onClose: () => void;
  onSend: () => void;
};

export default function ChatMediaPreviewModal({
  visible,
  colors,
  images,
  activeIndex,
  onChangeIndex,
  caption,
  onCaptionChange,
  onClose,
  onSend,
}: Props) {
  const imageUri = images[activeIndex] || null;
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.root}>
        {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" /> : null}

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.counterText}>
            {images.length > 0 ? `${activeIndex + 1}/${images.length}` : '0/0'}
          </Text>
        </View>

        {images.length > 1 ? (
          <View style={styles.navRow}>
            <TouchableOpacity style={[styles.navBtn, !hasPrev && styles.navBtnDisabled]} onPress={() => hasPrev && onChangeIndex(activeIndex - 1)}>
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navBtn, !hasNext && styles.navBtnDisabled]} onPress={() => hasNext && onChangeIndex(activeIndex + 1)}>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.bottomBar}>
          <TextInput
            value={caption}
            onChangeText={onCaptionChange}
            placeholder="Add a caption..."
            placeholderTextColor="#9CA3AF"
            style={[styles.captionInput, { borderColor: colors.brandBorder, color: '#fff' }]}
          />
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.brandBlue }]} onPress={onSend}>
            <Ionicons name="send" size={19} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  image: { flex: 1, width: '100%' },
  topBar: {
    position: 'absolute',
    top: 52,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  navRow: {
    position: 'absolute',
    top: '48%',
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111AA',
  },
  navBtnDisabled: { opacity: 0.35 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111AA',
  },
  bottomBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  captionInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: '#111111CC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  sendBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
