import React from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Sub-components
import MessageSystem from './ChatComponents/MessageSystem';
import MessageText from './ChatComponents/MessageText';
import MessageMedia from './ChatComponents/MessageMedia';
import MessageAudio from './ChatComponents/MessageAudio';
import MessageFile from './ChatComponents/MessageFile';
import MessageMenu from './ChatComponents/MessageMenu';
import MediaViewer from './ChatComponents/MediaViewer';

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
  const [playingMessageId, setPlayingMessageId] = React.useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [reactionTargetId, setReactionTargetId] = React.useState<string | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);
  const soundRef = React.useRef<Audio.Sound | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  const safeMessages = React.useMemo(() => {
    const seen = new Set<string>();
    const deduped: ChatMessage[] = [];
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      const key = msg.id || `msg-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(msg);
    }
    return deduped.reverse();
  }, [messages]);

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
    () => safeMessages.find((message) => message.id === reactionTargetId) || null,
    [safeMessages, reactionTargetId]
  );

  React.useEffect(() => {
    if (autoScrollToBottom && scrollViewRef.current && safeMessages.length > 0) {
      setTimeout(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); }, 100);
    }
  }, [safeMessages.length, autoScrollToBottom]);

  React.useEffect(() => {
    if (!scrollViewRef.current) return;
    setTimeout(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); }, 300);
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
    () => safeMessages
      .map((msg) => {
        if (msg.imageUri) return { id: msg.id, kind: 'image' as const, uri: msg.imageUri };
        if (msg.videoUri) return { id: msg.id, kind: 'video' as const, uri: msg.videoUri };
        return null;
      })
      .filter(Boolean) as Array<{ id: string; kind: 'image' | 'video'; uri: string }>,
    [safeMessages]
  );

  const openViewer = React.useCallback((messageId: string) => {
    const index = mediaItems.findIndex((item) => item.id === messageId);
    if (index < 0) return;
    setViewerIndex(index);
    setViewerOpen(true);
  }, [mediaItems]);

  const formatSeconds = React.useCallback((seconds?: number) => {
    const total = Math.max(1, seconds ?? 0);
    const mins = Math.floor(total / 60).toString().padStart(2, '0');
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

  const togglePlayAudio = React.useCallback(async (message: ChatMessage) => {
    if (!message.audioUri) return;
    try {
      if (soundRef.current && playingMessageId === message.id) {
        await soundRef.current.stopAsync(); await soundRef.current.unloadAsync();
        soundRef.current = null; setPlayingMessageId(null); return;
      }
      if (soundRef.current) { await soundRef.current.stopAsync(); await soundRef.current.unloadAsync(); }
      const { sound } = await Audio.Sound.createAsync({ uri: message.audioUri }, { shouldPlay: true });
      soundRef.current = sound; setPlayingMessageId(message.id);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish) { sound.unloadAsync().catch(() => null); soundRef.current = null; setPlayingMessageId(null); }
      });
    } catch { setPlayingMessageId(null); }
  }, [playingMessageId]);

  const renderMessageText = React.useCallback((text: string, isMine: boolean) => {
    if (!text) return null;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0; let match;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      const linkText = match[1]; const url = match[2];
      parts.push(
        <Text key={match.index} style={{ textDecorationLine: 'underline', fontWeight: '900', color: isMine ? '#fff' : colors.brandBlue }}
          onPress={() => { if (url.startsWith('listing:')) { const id = url.replace('listing:', ''); router.push(`/listings-detail?id=${id}`); } }}>
          {linkText}
        </Text>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts.length > 0 ? parts : text;
  }, [colors, router]);

  return (
    <>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive"
        onMomentumScrollEnd={(e) => {
          if (e.nativeEvent.contentOffset.y <= 10 && onEndReached && !loadingMore) onEndReached();
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
          setShowScrollToBottom(!isAtBottom);
          Animated.timing(fadeAnim, { toValue: !isAtBottom ? 1 : 0, duration: 200, useNativeDriver: true }).start();
        }}
        onScroll={(e) => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
          setShowScrollToBottom(!isAtBottom);
        }}
        scrollEventThrottle={16}
      >
        <View style={styles.messageList}>
          {safeMessages.map((msg, index) => {
            const previous = index > 0 ? safeMessages[index - 1] : null;
            const currentDate = dateLabelFor(msg.createdAt);
            const previousDate = previous ? dateLabelFor(previous.createdAt) : '';
            const showDateSeparator = !!currentDate && currentDate !== previousDate;
            const callLog = parseCallLog(msg);

            let content;
            if (callLog) {
              const durationLabel = callLog.durationSeconds > 0 ? formatSeconds(callLog.durationSeconds) : '';
              content = callLog.status === 'answered' ? `Call ended${durationLabel ? ` • ${durationLabel}` : ''}` : callLog.status === 'declined' ? 'Call declined' : `Missed ${callLog.mode} call`;
            }

            return (
              <View key={msg.id}>
                {showDateSeparator ? <MessageSystem type="date" content={currentDate} colors={colors} /> : null}
                {callLog ? (
                  <MessageSystem type="call" content={content!} time={msg.time} colors={colors} />
                ) : (
                  <View style={[styles.row, msg.mine ? styles.rowMine : styles.rowOther]}>
                    <View style={[styles.messageColumn, msg.mine ? styles.messageColumnMine : styles.messageColumnOther]}>
                      <TouchableOpacity activeOpacity={1} onLongPress={() => setReactionTargetId(msg.id)}
                        style={[styles.bubble, { backgroundColor: msg.mine ? SENT_BUBBLE_COLOR : colors.tableRow, borderColor: msg.mine ? SENT_BUBBLE_BORDER_COLOR : colors.brandBorder }]}
                      >
                        <MessageMedia msgId={msg.id} imageUri={msg.imageUri} videoUri={msg.videoUri} mine={!!msg.mine} colors={colors} onOpenViewer={openViewer} />
                        {msg.text ? <MessageText text={msg.text} mine={!!msg.mine} time={msg.time} status={msg.status} colors={colors} renderText={renderMessageText} /> : null}
                        {msg.fileName ? <MessageFile fileName={msg.fileName} mine={!!msg.mine} colors={colors} /> : null}
                        {msg.audioUri ? (
                          <MessageAudio msgId={msg.id} audioDurationSeconds={msg.audioDurationSeconds} isPlaying={playingMessageId === msg.id} mine={!!msg.mine} colors={colors} onTogglePlay={() => togglePlayAudio(msg)} formatSeconds={formatSeconds} />
                        ) : null}
                        {!msg.text ? (
                          <View style={styles.metaRow}>
                            {msg.time ? <Text style={[styles.timeText, { color: msg.mine ? colors.surface + 'CC' : colors.textMuted }]}>{msg.time}</Text> : null}
                            {msg.mine ? <Ionicons name={msg.status === 'read' ? 'checkmark-done' : msg.status === 'delivered' ? 'checkmark-done' : 'checkmark'} size={14} color={msg.status === 'read' ? '#7DD3FC' : colors.surface + 'CC'} /> : null}
                          </View>
                        ) : null}
                      </TouchableOpacity>
                      {msg.reaction ? (
                        <View style={styles.reactionBubble}>
                          <Text style={styles.reactionBubbleText}>{msg.reaction}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        {loadingMore && <View style={styles.loadingMore}><Text style={styles.loadingMoreText}>Loading...</Text></View>}
      </ScrollView>

      {showScrollToBottom && (
        <Animated.View style={[styles.scrollToBottomContainer, { opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }, { translateY: shakeAnim }] }]}>
          <TouchableOpacity style={[styles.scrollToBottomBtn, { backgroundColor: colors.brandBlue }]} onPress={() => scrollViewRef.current?.scrollToEnd({ animated: true })} activeOpacity={0.8}>
            <Ionicons name="arrow-down" size={18} color={colors.surface} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <MessageMenu
        visible={!!selectedMessage}
        selectedMessage={selectedMessage}
        colors={colors}
        onClose={() => setReactionTargetId(null)}
        onReact={(emoji) => { if (selectedMessage) onReactToMessage?.(selectedMessage.id, emoji); setReactionTargetId(null); }}
        onDeleteForMe={(id) => onDeleteMessage?.(id)}
        onDeleteForEveryone={(id) => onDeleteMessageForEveryone?.(id)}
      />

      <MediaViewer
        visible={viewerOpen}
        mediaItems={mediaItems}
        viewerIndex={viewerIndex}
        onClose={() => setViewerOpen(false)}
        onIndexChange={setViewerIndex}
      />
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
  bubble: { width: '100%', minWidth: 0, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 8, flexShrink: 1, flexWrap: 'wrap', overflow: 'hidden' },
  metaRow: { marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', minHeight: 16 },
  timeText: { fontSize: 10, marginRight: 3, lineHeight: 12 },
  reactionBubble: {
    position: 'absolute', minWidth: 28, height: 24, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 4,
    backgroundColor: '#111827', borderColor: '#374151', right: 4, bottom: -8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 2,
  },
  reactionBubbleText: { fontSize: 13 },
  loadingMore: { padding: 10, alignItems: 'center' },
  loadingMoreText: { fontSize: 12, color: '#888' },
  scrollToBottomContainer: { position: 'absolute', right: 8, bottom: 8 },
  scrollToBottomBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 6 },
});
