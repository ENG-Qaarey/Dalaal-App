import React from 'react';
import { Dimensions, FlatList, Image, Modal, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingBackground from '../OnboardingBackground';

type Props = {
  visible: boolean;
  clips: any[];
  selectedClip: any;
  setSelectedClip: (clip: any) => void;
  isModalPaused: boolean;
  setIsModalPaused: (paused: boolean) => void;
  isFullMuted: boolean;
  setIsFullMuted: (muted: boolean) => void;
  playbackStatus: any;
  setPlaybackStatus: (status: any) => void;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  isSaved: boolean;
  setIsSaved: (saved: boolean) => void;
  onClose: () => void;
  colors: any;
  insets: any;
  userAvatar?: string;
};

export default function HomeClipsPlayer({
  visible,
  clips,
  selectedClip,
  setSelectedClip,
  isModalPaused,
  setIsModalPaused,
  isFullMuted,
  setIsFullMuted,
  playbackStatus,
  setPlaybackStatus,
  isLiked,
  setIsLiked,
  isSaved,
  setIsSaved,
  onClose,
  colors,
  insets,
  userAvatar,
}: Props) {
  const window = Dimensions.get('window');
  const FALLBACK_AVATAR = 'https://i.pravatar.cc/160?img=14';

  if (!selectedClip) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.modalFull}>
        <LinearGradient colors={[colors.brandBlue, colors.brandOrange]} style={StyleSheet.absoluteFill} />
        <OnboardingBackground primary={colors.brandBlue} secondary={colors.brandOrange} soft={colors.brandBlueSoft} />
        
        <FlatList
          data={clips}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          initialScrollIndex={clips.findIndex(c => c.id === selectedClip.id)}
          getItemLayout={(_, index) => ({
            length: window.height,
            offset: window.height * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.y / window.height);
            setSelectedClip(clips[index]);
          }}
          renderItem={({ item }) => (
            <View style={{ height: window.height, width: window.width }}>
              <Video
                source={{ uri: item.video }}
                style={StyleSheet.absoluteFill}
                isLooping
                shouldPlay={selectedClip.id === item.id && !isModalPaused}
                isMuted={isFullMuted}
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={(status) => {
                  if (selectedClip.id === item.id) setPlaybackStatus(status);
                }}
              />
              
              <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.7)']} style={StyleSheet.absoluteFill} pointerEvents="none" />

              <TouchableOpacity activeOpacity={1} style={StyleSheet.absoluteFill} onPress={() => setIsModalPaused(!isModalPaused)}>
                {isModalPaused && selectedClip.id === item.id && (
                  <View style={styles.modalCenterPlay}>
                    <View style={styles.modalCenterPlayInner}>
                      <Ionicons name="play" size={48} color="#fff" style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              <View style={[styles.modalRightActions, { bottom: 80 + insets.bottom, right: 12 + insets.right }]}>
                <TouchableOpacity style={[styles.modalActionItem, { marginBottom: 12 }]} activeOpacity={0.7} onPress={() => setIsLiked(!isLiked)}>
                  <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                    <Ionicons name={isLiked ? "thumbs-up" : "thumbs-up-outline"} size={18} color={isLiked ? "#ff3b30" : "#fff"} />
                  </View>
                  <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalActionItem, { marginBottom: 12 }]} activeOpacity={0.7} onPress={() => setIsSaved(!isSaved)}>
                  <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                    <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={18} color={isSaved ? "#2F7CF6" : "#fff"} />
                  </View>
                  <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalActionItem, { marginBottom: 12 }]} activeOpacity={0.7}
                  onPress={async () => {
                    try {
                      await Share.share({
                        message: `Check out this amazing property tour: ${item.title} in ${item.location}!`,
                        url: item.video,
                      });
                    } catch (error) { console.log(error); }
                  }}
                >
                  <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                    <Ionicons name="share-social-outline" size={18} color="#fff" />
                  </View>
                  <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalActionItem, { marginBottom: 12 }]} activeOpacity={0.7} onPress={() => setIsFullMuted(!isFullMuted)}>
                  <View style={[styles.modalActionIconBox, { width: 34, height: 34, borderRadius: 17 }]}>
                    <Ionicons name={isFullMuted ? "volume-mute-outline" : "volume-medium-outline"} size={18} color="#fff" />
                  </View>
                  <Text style={[styles.modalActionText, { fontSize: 9, marginTop: 2 }]}>{isFullMuted ? "Muted" : "Sound"}</Text>
                </TouchableOpacity>
                <Image source={{ uri: userAvatar || FALLBACK_AVATAR }} style={[styles.modalSmallAvatar, { width: 34, height: 34, borderRadius: 10 }]} />
              </View>

              <View style={[styles.modalBottomContent, { paddingBottom: Math.max(insets.bottom, 20), left: 16 + insets.left, right: 70 + insets.right, bottom: 0 }]}>
                <View style={[styles.modalProfileRow, { marginBottom: 8 }]}>
                  <Image source={{ uri: 'https://i.pravatar.cc/160?img=32' }} style={[styles.modalAvatar, { width: 28, height: 28 }]} />
                  <Text style={[styles.modalProfileName, { fontSize: 13 }]}>Kiro Haaye Real Estate</Text>
                </View>
                <Text style={[styles.modalClipTitle, { fontSize: 16, marginBottom: 2 }]}>{item.title}</Text>
                <Text style={[styles.modalClipMeta, { fontSize: 12, marginBottom: 12 }]}>{item.location} • {item.price}</Text>
                
                <View style={styles.modalActionRow}>
                  <TouchableOpacity style={[styles.modalViewBtn, { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 }]} activeOpacity={0.8}>
                    <Ionicons name="home" size={14} color="#fff" />
                    <Text style={[styles.modalViewBtnText, { fontSize: 12 }]}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsModalPaused(!isModalPaused)} style={[styles.modalMiniPlay, { width: 30, height: 30 }]}>
                    <Ionicons name={isModalPaused ? "play" : "pause"} size={16} color="#fff" />
                  </TouchableOpacity>
                </View>

                {selectedClip.id === item.id && (
                  <View style={[styles.modalProgressWrap, { marginTop: 12 }]}>
                    <div style={styles.modalProgressBar}>
                      <View style={[styles.modalProgressFill, { width: playbackStatus.isLoaded && playbackStatus.durationMillis ? `${(playbackStatus.positionMillis / playbackStatus.durationMillis) * 100}%` : '0%' }]} />
                    </div>
                  </View>
                )}
              </View>
            </View>
          )}
        />
        
        <View style={[styles.modalTopNav, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: Math.max(insets.top, 10) }]}>
          <TouchableOpacity onPress={onClose} style={styles.modalBackBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.modalBackText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.modalTopRight}>
            <Ionicons name="search" size={22} color="#fff" style={{ marginRight: 20 }} />
            <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalFull: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  modalTopNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  modalBackBtn: { flexDirection: 'row', alignItems: 'center' },
  modalBackText: { color: '#fff', fontSize: 18, fontWeight: '600', marginLeft: 10 },
  modalTopRight: { flexDirection: 'row', alignItems: 'center' },
  modalRightActions: { position: 'absolute', right: 15, bottom: 100, alignItems: 'center' },
  modalActionItem: { alignItems: 'center', marginBottom: 20 },
  modalActionIconBox: { backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  modalActionText: { color: '#fff', fontWeight: '600' },
  modalSmallAvatar: { borderWidth: 1, borderColor: '#fff', marginTop: 10 },
  modalBottomContent: { position: 'absolute' },
  modalProfileRow: { flexDirection: 'row', alignItems: 'center' },
  modalAvatar: { marginRight: 10, borderWidth: 1, borderColor: '#fff' },
  modalProfileName: { color: '#fff', fontWeight: '700' },
  modalClipTitle: { color: '#fff', fontWeight: '800' },
  modalClipMeta: { color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  modalViewBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  modalViewBtnText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
  modalProgressWrap: { width: '100%' },
  modalProgressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  modalProgressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  modalCenterPlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' },
  modalCenterPlayInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  modalActionRow: { flexDirection: 'row', alignItems: 'center' },
  modalMiniPlay: { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
});
