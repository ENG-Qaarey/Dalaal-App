import React from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio, ResizeMode, Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const SENT_BUBBLE_COLOR = '#60A5FA';
const SENT_BUBBLE_BORDER_COLOR = '#3B82F6';

export type ChatMessage = {
  id: string;
  text: string;
  mine?: boolean;
  time?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reaction?: string;
  imageUri?: string;
  videoUri?: string;
  fileName?: string;
  fileUri?: string;
  audioUri?: string;
  audioDurationSeconds?: number;
};

type Props = {
  colors: any;
  messages: ChatMessage[];
  onReactToMessage?: (messageId: string, emoji: string) => void;
};

export default function ChatWindow({ colors, messages, onReactToMessage }: Props) {
  const windowWidth = Dimensions.get('window').width;
  const [playingMessageId, setPlayingMessageId] = React.useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [reactionTargetId, setReactionTargetId] = React.useState<string | null>(null);
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const galleryScrollRef = React.useRef<ScrollView | null>(null);
  const reactionChoices = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  const selectedMessage = React.useMemo(
    () => messages.find((message) => message.id === reactionTargetId) || null,
    [messages, reactionTargetId]
  );

  const mediaItems = React.useMemo(
    () =>
      messages
        .map((msg) => {
          if (msg.imageUri) return { id: msg.id, kind: 'image' as const, uri: msg.imageUri };
          if (msg.videoUri) return { id: msg.id, kind: 'video' as const, uri: msg.videoUri };
          return null;
        })
        .filter(Boolean) as Array<{ id: string; kind: 'image' | 'video'; uri: string }>,
    [messages]
  );

  const openViewer = React.useCallback(
    (messageId: string) => {
      const index = mediaItems.findIndex((item) => item.id === messageId);
      if (index < 0) return;
      setViewerIndex(index);
      setViewerOpen(true);
      requestAnimationFrame(() => {
        galleryScrollRef.current?.scrollTo({ x: index * windowWidth, animated: false });
      });
    },
    [mediaItems, windowWidth]
  );

  React.useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => null);
      }
    };
  }, []);

  const formatSeconds = React.useCallback((seconds?: number) => {
    const total = Math.max(1, seconds ?? 0);
    const mins = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, []);

  const togglePlayAudio = React.useCallback(
    async (message: ChatMessage) => {
      if (!message.audioUri) return;
      try {
        if (soundRef.current && playingMessageId === message.id) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          setPlayingMessageId(null);
          return;
        }

        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          setPlayingMessageId(null);
        }

        const { sound } = await Audio.Sound.createAsync({ uri: message.audioUri }, { shouldPlay: true });
        soundRef.current = sound;
        setPlayingMessageId(message.id);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            sound.unloadAsync().catch(() => null);
            soundRef.current = null;
            setPlayingMessageId(null);
          }
        });
      } catch {
        setPlayingMessageId(null);
      }
    },
    [playingMessageId]
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.row, msg.mine ? styles.rowMine : styles.rowOther]}>
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: msg.mine ? SENT_BUBBLE_COLOR : colors.tableRow,
                  borderColor: msg.mine ? SENT_BUBBLE_BORDER_COLOR : colors.brandBorder,
                },
              ]}
            >
              {msg.imageUri ? (
                <TouchableOpacity activeOpacity={0.9} onPress={() => openViewer(msg.id)}>
                  <Image source={{ uri: msg.imageUri }} style={styles.photo} resizeMode="cover" />
                </TouchableOpacity>
              ) : null}
              {msg.videoUri ? (
                <TouchableOpacity
                  style={[styles.videoChip, { borderColor: msg.mine ? colors.surface + '55' : colors.brandBorder }]}
                  activeOpacity={0.9}
                  onPress={() => openViewer(msg.id)}
                >
                  <Ionicons name="play-circle" size={20} color={msg.mine ? colors.surface : colors.textMain} />
                  <Text style={[styles.videoChipText, { color: msg.mine ? colors.surface : colors.textMain }]}>Video</Text>
                </TouchableOpacity>
              ) : null}
            {msg.text ? (
              <View style={styles.inlineTextMetaRow}>
                <Text style={[styles.messageText, { color: msg.mine ? colors.surface : colors.textMain }]}>{msg.text}</Text>
                <View style={styles.inlineMeta}>
                  {msg.time ? (
                    <Text style={[styles.timeText, { color: msg.mine ? colors.surface + 'CC' : colors.textMuted }]}>{msg.time}</Text>
                  ) : null}
                  {msg.mine ? (
                    <Ionicons
                      name={msg.status === 'read' ? 'checkmark-done' : msg.status === 'delivered' ? 'checkmark-done' : 'checkmark'}
                      size={13}
                      color={msg.status === 'read' ? '#7DD3FC' : colors.surface + 'CC'}
                    />
                  ) : null}
                </View>
              </View>
            ) : null}
            {msg.fileName ? (
              <View
                style={[
                  styles.fileBubble,
                  { borderColor: msg.mine ? colors.surface + '55' : colors.brandBorder, backgroundColor: msg.mine ? colors.brandBlueDark : colors.surface },
                ]}
              >
                <Ionicons name="document-outline" size={16} color={msg.mine ? colors.surface : colors.textMain} />
                <Text style={[styles.fileText, { color: msg.mine ? colors.surface : colors.textMain }]} numberOfLines={1}>
                  {msg.fileName}
                </Text>
              </View>
            ) : null}
            {msg.audioUri ? (
              <TouchableOpacity
                style={[
                  styles.audioBubble,
                  { borderColor: msg.mine ? colors.surface + '55' : colors.brandBorder, backgroundColor: msg.mine ? colors.brandBlueDark : colors.surface },
                ]}
                onPress={() => togglePlayAudio(msg)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={playingMessageId === msg.id ? 'pause' : 'play'}
                  size={16}
                  color={msg.mine ? colors.surface : colors.textMain}
                />
                <Text style={[styles.audioText, { color: msg.mine ? colors.surface : colors.textMain }]}>
                  Voice message {formatSeconds(msg.audioDurationSeconds)}
                </Text>
              </TouchableOpacity>
            ) : null}
            {!msg.text ? (
              <TouchableOpacity activeOpacity={0.8} onLongPress={() => setReactionTargetId(msg.id)}>
                <View style={styles.metaRow}>
                  {msg.time ? (
                    <Text style={[styles.timeText, { color: msg.mine ? colors.surface + 'CC' : colors.textMuted }]}>{msg.time}</Text>
                  ) : null}
                  {msg.mine ? (
                    <Ionicons
                      name={msg.status === 'read' ? 'checkmark-done' : msg.status === 'delivered' ? 'checkmark-done' : 'checkmark'}
                      size={14}
                      color={msg.status === 'read' ? '#7DD3FC' : colors.surface + 'CC'}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            ) : null}
            {msg.reaction ? (
              <View
                style={[
                  styles.reactionBubble,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.brandBorder,
                    right: msg.mine ? 8 : undefined,
                    left: msg.mine ? undefined : 8,
                  },
                ]}
              >
                <Text style={styles.reactionBubbleText}>{msg.reaction}</Text>
              </View>
            ) : null}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!selectedMessage} transparent animationType="fade" onRequestClose={() => setReactionTargetId(null)}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setReactionTargetId(null)}>
          <View style={styles.menuWrap}>
            <View style={[styles.reactionBar, { backgroundColor: colors.surface, borderColor: colors.brandBorder }]}>
              {reactionChoices.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.reactionBarBtn}
                  onPress={() => {
                    if (!selectedMessage) return;
                    onReactToMessage?.(selectedMessage.id, emoji);
                    setReactionTargetId(null);
                  }}
                >
                  <Text style={styles.reactionBarEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.reactionBarBtn} onPress={() => setReactionTargetId(null)}>
                <Ionicons name="add" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.actionMenu, { backgroundColor: colors.surface, borderColor: colors.brandBorder }]}>
              <TouchableOpacity style={styles.actionRow} onPress={() => setReactionTargetId(null)}>
                <Text style={[styles.actionText, { color: colors.textMain }]}>Reply</Text>
                <Ionicons name="arrow-undo-outline" size={17} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  if (selectedMessage?.text) {
                    Alert.alert('Copied', 'Message text copied style action selected.');
                  }
                  setReactionTargetId(null);
                }}
              >
                <Text style={[styles.actionText, { color: colors.textMain }]}>Copy</Text>
                <Ionicons name="copy-outline" size={17} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionRow} onPress={() => setReactionTargetId(null)}>
                <Text style={[styles.actionText, { color: colors.textMain }]}>Info</Text>
                <Ionicons name="information-circle-outline" size={17} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionRow} onPress={() => setReactionTargetId(null)}>
                <Text style={[styles.actionText, { color: colors.textMain }]}>Star</Text>
                <Ionicons name="star-outline" size={17} color={colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionRow} onPress={() => setReactionTargetId(null)}>
                <Text style={[styles.actionText, { color: '#E11D48' }]}>Delete</Text>
                <Ionicons name="trash-outline" size={17} color="#E11D48" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={viewerOpen} transparent animationType="fade" onRequestClose={() => setViewerOpen(false)}>
        <View style={styles.viewerRoot}>
          <TouchableOpacity style={styles.viewerClose} onPress={() => setViewerOpen(false)}>
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
              setViewerIndex(nextIndex);
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
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 12, paddingBottom: 8 },
  row: { marginBottom: 8, flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '82%', borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8 },
  photo: { width: 180, height: 180, borderRadius: 10, marginBottom: 6 },
  messageText: { fontSize: 13, fontWeight: '700' },
  inlineTextMetaRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 6,
  },
  inlineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingBottom: 1,
  },
  fileBubble: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fileText: { flex: 1, fontSize: 12, fontWeight: '700' },
  videoChip: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoChipText: { fontSize: 12, fontWeight: '700' },
  audioBubble: {
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioText: { fontSize: 12, fontWeight: '700' },
  metaRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    minHeight: 16,
  },
  timeText: { fontSize: 10, marginRight: 3, lineHeight: 12 },
  reactionBubble: {
    position: 'absolute',
    bottom: -13,
    minWidth: 26,
    height: 22,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionBubbleText: { fontSize: 14 },
  menuOverlay: {
    flex: 1,
    backgroundColor: '#00000045',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingBottom: 22,
  },
  menuWrap: { gap: 8 },
  reactionBar: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  reactionBarBtn: { paddingHorizontal: 5, paddingVertical: 3 },
  reactionBarEmoji: { fontSize: 22 },
  actionMenu: {
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
  },
  actionRow: {
    minHeight: 42,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#9CA3AF55',
  },
  actionText: { fontSize: 16, fontWeight: '600' },
  viewerRoot: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
