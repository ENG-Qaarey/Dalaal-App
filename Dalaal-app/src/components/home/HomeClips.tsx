import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

type Clip = {
  id: string;
  price: string;
  title: string;
  location: string;
  tag: string;
  video: string;
};

type Props = {
  clips: Clip[];
  playingClipId: string | null;
  onClipPress: (clip: Clip) => void;
  colors: any;
};

export default function HomeClips({ clips, playingClipId, onClipPress, colors }: Props) {
  return (
    <>
      <View style={styles.clipSectionHeader}>
        <View style={[styles.clipIconBox, { borderColor: colors.brandBorder, backgroundColor: colors.surface }]}>
          <Ionicons name="play-circle-outline" size={24} color={colors.textMain} />
        </View>
        <View>
          <Text style={[styles.clipTitle, { color: colors.textMain }]}>Clips</Text>
          <Text style={[styles.clipSubtitle, { color: colors.textMuted }]}>Autoplay in-view preview</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.clipsScroll}
        contentContainerStyle={{ paddingLeft: 14, paddingRight: 4 }}
      >
        {clips.map((clip) => (
          <TouchableOpacity 
            key={clip.id} 
            activeOpacity={0.9} 
            style={styles.clipCard}
            onPress={() => onClipPress(clip)}
          >
            <Video
              source={{ uri: clip.video }}
              style={styles.clipVideo}
              isLooping
              isMuted={true}
              shouldPlay={playingClipId === clip.id}
              resizeMode={ResizeMode.COVER}
            />
            
            <View style={styles.clipTagTopLeft}>
              <View style={styles.liveDot} />
              <Text style={styles.clipTagText}>LIVE</Text>
            </View>

            <View style={styles.clipTagTopRight}>
              <Ionicons 
                name={playingClipId === clip.id ? "pause" : "play"} 
                size={12} 
                color="#fff" 
              />
              <Text style={[styles.clipTagText, { marginLeft: 4 }]}>
                {playingClipId === clip.id ? "Playing" : "Paused"}
              </Text>
            </View>
            
            <LinearGradient 
              colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']} 
              style={styles.clipInfoGradient}
            >
              <View style={styles.clipMetaRow}>
                <Text style={styles.clipPrice}>{clip.price}</Text>
                <View style={styles.clipViews}>
                  <Ionicons name="eye-outline" size={12} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.clipViewsText}>24k</Text>
                </View>
              </View>
              <Text style={styles.clipName} numberOfLines={1}>{clip.title}</Text>
              <Text style={styles.clipLoc} numberOfLines={1}>{clip.location}</Text>
            </LinearGradient>

            {playingClipId !== clip.id && (
              <View style={styles.clipPlayOverlay}>
                <View style={styles.clipPlayBtnInner}>
                  <Ionicons name="play" size={32} color="#fff" style={{ marginLeft: 4 }} />
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  clipSectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginTop: 12, marginBottom: 12 },
  clipIconBox: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  clipTitle: { fontSize: 18, fontWeight: '800' },
  clipSubtitle: { fontSize: 12, fontWeight: '500' },
  clipsScroll: { marginBottom: 16 },
  clipCard: { width: 140, height: 220, borderRadius: 16, marginRight: 12, overflow: 'hidden', position: 'relative' },
  clipVideo: { width: '100%', height: '100%' },
  clipTagTopLeft: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  clipTagTopRight: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  clipTagText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#ff3b30', marginRight: 4 },
  clipInfoGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', justifyContent: 'flex-end', padding: 10 },
  clipMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  clipPrice: { color: '#fff', fontSize: 14, fontWeight: '900' },
  clipViews: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  clipViewsText: { color: '#fff', fontSize: 10, fontWeight: '600', marginLeft: 3 },
  clipName: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 0 },
  clipLoc: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500', marginTop: 1 },
  clipPlayOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  clipPlayBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)' },
});
