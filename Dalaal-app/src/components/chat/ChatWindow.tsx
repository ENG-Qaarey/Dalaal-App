import React from 'react';
import { Alert, Animated, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio, ResizeMode, Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SENT_BUBBLE_COLOR = '#60A5FA';
const SENT_BUBBLE_BORDER_COLOR = '#3B82F6';

export type ChatMessage = {
  id: string;
  text: string;
  mine?: boolean;
  time?: string;
  createdAt?: string;
  type?: string;
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
  onDeleteMessage?: (messageId: string) => void;
  onDeleteMessageForEveryone?: (messageId: string) => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  autoScrollToBottom?: boolean;
  scrollToBottomSignal?: number;
};

export default function ChatWindow({
  colors,
  messages,
  onReactToMessage,
  onDeleteMessage,
  onDeleteMessageForEveryone,
  onEndReached,
  loadingMore,
  autoScrollToBottom = true,
  scrollToBottomSignal = 0,
}: Props) {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  const [playingMessageId, setPlayingMessageId] = React.useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [reactionTargetId, setReactionTargetId] = React.useState<string | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const galleryScrollRef = React.useRef<ScrollView | null>(null);
  const reactionChoices = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  const [showScrollToBottom, setShowScrollToBottom] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (showScrollToBottom) {
      const shake = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 6, duration: 300, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(shakeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(4800),
        ])
      );
      shake.start();
      return () => shake.stop();
    }
  }, [showScrollToBottom]);

  const selectedMessage = React.useMemo(
    () => messages.find((message) => message.id === reactionTargetId) || null,
    [messages, reactionTargetId]
  );

  React.useEffect(() => {
    if (autoScrollToBottom && scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, autoScrollToBottom]);

  React.useEffect(() => {
    if (!scrollViewRef.current) return;
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [scrollToBottomSignal]);

  const dateLabelFor = React.useCallback((value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMessageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.floor((startOfToday.getTime() - startOfMessageDay.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

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

  const parseCallLog = React.useCallback((message: ChatMessage) => {
    if (message.type !== 'SYSTEM' || !message.text?.startsWith('CALL|')) return null;
    const parts = message.text.split('|');
    const status = parts[1] || 'missed';
    const mode = parts[2] || 'audio';
    const durationSeconds = Number.parseInt(parts[3] || '0', 10) || 0;
    return { status, mode, durationSeconds };
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

  const renderMessageText = React.useCallback((text: string, isMine: boolean) => {
    if (!text) return null;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const url = match[2];
      
      parts.push(
        <Text
          key={match.index}
          style={{ textDecorationLine: 'underline', fontWeight: '900', color: isMine ? '#fff' : colors.brandBlue }}
          onPress={() => {
            if (url.startsWith('listing:')) {
              const id = url.replace('listing:', '');
              router.push(`/listings-detail?id=${id}`);
            }
          }}
        >
          {linkText}
        </Text>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }, [colors, router]);

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onMomentumScrollEnd={(e) => {
          if (e.nativeEvent.contentOffset.y <= 10 && onEndReached && !loadingMore) {
            onEndReached();
          }
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
          setShowScrollToBottom(!isAtBottom);
          Animated.timing(fadeAnim, {
            toValue: !isAtBottom ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }}
        onScroll={(e) => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
          setShowScrollToBottom(!isAtBottom);
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.messageList}>
        {messages.map((msg, index) => {
          const previous = index > 0 ? messages[index - 1] : null;
          const currentDate = dateLabelFor(msg.createdAt);
          const previousDate = previous ? dateLabelFor(previous.createdAt) : '';
          const showDateSeparator = !!currentDate && currentDate !== previousDate;
          const callLog = parseCallLog(msg);
          if (callLog) {
            const durationLabel = callLog.durationSeconds > 0 ? formatSeconds(callLog.durationSeconds) : '';
            const label =
              callLog.status === 'answered'
                ? `Call ended${durationLabel ? ` • ${durationLabel}` : ''}`
                : callLog.status === 'declined'
                ? 'Call declined'
                : `Missed ${callLog.mode} call`;
            return (
              <View key={msg.id}>
                {showDateSeparator ? (
                  <View style={styles.dateRow}>
                    <View style={[styles.dateBadge, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}>
                      <Text style={[styles.dateText, { color: colors.textMuted }]}>{currentDate}</Text>
                    </View>
                  </View>
                ) : null}
                <View style={styles.systemRow}>
                  <View style={[styles.callLog, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}
                  >
                    <Ionicons name="call" size={14} color={colors.textMain} />
                    <Text style={[styles.callLogText, { color: colors.textMain }]}>{label}</Text>
                  </View>
                  {msg.time ? <Text style={[styles.callLogTime, { color: colors.textMuted }]}>{msg.time}</Text> : null}
                </View>
              </View>
            );
          }

          return (
          <View key={msg.id}>
            {showDateSeparator ? (
              <View style={styles.dateRow}>
                <View style={[styles.dateBadge, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}>
                  <Text style={[styles.dateText, { color: colors.textMuted }]}>{currentDate}</Text>
                </View>
              </View>
            ) : null}
            <View style={[styles.row, msg.mine ? styles.rowMine : styles.rowOther]}>
              <View style={[styles.messageColumn, msg.mine ? styles.messageColumnMine : styles.messageColumnOther]}>
            <TouchableOpacity
              activeOpacity={1}
              onLongPress={() => setReactionTargetId(msg.id)}
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
                <View style={styles.textWrapper}>
                  <Text style={[styles.messageText, { color: msg.mine ? colors.surface : colors.textMain }]}>
                    {renderMessageText(msg.text, msg.mine || false)}
                  </Text>
                </View>
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
            ) : null}
            </TouchableOpacity>
            {msg.reaction ? (
              <View
                style={[
                  styles.reactionBubble,
                  {
                    backgroundColor: '#111827', // Dark background as requested
                    borderColor: '#374151',
                    right: 4,
                    bottom: -8,
                  },
                ]}
              >
                <Text style={styles.reactionBubbleText}>{msg.reaction}</Text>
              </View>
            ) : null}
            </View>
          </View>
          </View>
        );
        })}
        </View>
        {loadingMore && (
          <View style={styles.loadingMore}>
            <Text style={styles.loadingMoreText}>Loading...</Text>
          </View>
        )}
      </ScrollView>

      {showScrollToBottom && (
        <Animated.View
          style={[
            styles.scrollToBottomContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                { translateY: shakeAnim },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.scrollToBottomBtn, { backgroundColor: colors.brandBlue }]}
            onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-down" size={18} color={colors.surface} />
          </TouchableOpacity>
        </Animated.View>
      )}

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
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  if (!selectedMessage) return;
                  onDeleteMessage?.(selectedMessage.id);
                  setReactionTargetId(null);
                }}
              >
                <Text style={[styles.actionText, { color: '#E11D48' }]}>Delete for me</Text>
                <Ionicons name="trash-outline" size={17} color="#E11D48" />
              </TouchableOpacity>
              {selectedMessage?.mine ? (
                <TouchableOpacity
                  style={styles.actionRow}
                  onPress={() => {
                    if (!selectedMessage) return;
                    onDeleteMessageForEveryone?.(selectedMessage.id);
                    setReactionTargetId(null);
                  }}
                >
                  <Text style={[styles.actionText, { color: '#DC2626' }]}>Delete for everyone</Text>
                  <Ionicons name="trash" size={17} color="#DC2626" />
                </TouchableOpacity>
              ) : null}
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
  content: { padding: 12, paddingBottom: 8, minWidth: '100%' },
  messageList: { flexDirection: 'column', width: '100%', minWidth: 0 },
  row: { marginBottom: 8, flexDirection: 'row', flexShrink: 0, width: '100%', minWidth: 0 },
  rowMine: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  messageColumn: { maxWidth: '80%', minWidth: 0, position: 'relative', paddingTop: 10 },
  messageColumnMine: { alignItems: 'flex-end' },
  messageColumnOther: { alignItems: 'flex-start' },
  systemRow: { alignItems: 'center', marginVertical: 6 },
  dateRow: { alignItems: 'center', marginVertical: 6 },
  dateBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  dateText: { fontSize: 10, fontWeight: '700' },
  callLog: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  callLogText: { fontSize: 12, fontWeight: '700' },
  callLogTime: { marginTop: 4, fontSize: 10, fontWeight: '600' },
  bubble: { width: '100%', minWidth: 0, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8, flexShrink: 1, flexWrap: 'wrap', overflow: 'hidden' },
  photo: { width: 180, height: 180, borderRadius: 10, marginBottom: 6 },
  messageText: { fontSize: 13, fontWeight: '700', flexWrap: 'wrap', flexShrink: 1, includeFontPadding: false },
  textWrapper: { flexShrink: 1, maxWidth: '100%', minWidth: 0 },
  inlineTextMetaRow: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 6,
    flexShrink: 1,
    flexWrap: 'wrap',
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
    minWidth: 28,
    height: 24,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  reactionBubbleText: { fontSize: 13 },
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
  loadingMore: {
    padding: 10,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 12,
    color: '#888',
  },
  scrollToBottomContainer: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  scrollToBottomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
});
