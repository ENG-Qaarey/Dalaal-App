import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export type ChatMessage = {
  id: string;
  text: string;
  mine?: boolean;
  time?: string;
  imageUri?: string;
  audioUri?: string;
  audioDurationSeconds?: number;
};

type Props = {
  colors: any;
  messages: ChatMessage[];
};

export default function ChatWindow({ colors, messages }: Props) {
  const [playingMessageId, setPlayingMessageId] = React.useState<string | null>(null);
  const soundRef = React.useRef<Audio.Sound | null>(null);

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
                backgroundColor: msg.mine ? colors.brandBlue : colors.tableRow,
                borderColor: msg.mine ? colors.brandBlueDark : colors.brandBorder,
              },
            ]}
          >
            {msg.imageUri ? <Image source={{ uri: msg.imageUri }} style={styles.photo} resizeMode="cover" /> : null}
            {msg.text ? <Text style={[styles.messageText, { color: msg.mine ? colors.surface : colors.textMain }]}>{msg.text}</Text> : null}
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
            {msg.time ? (
              <Text style={[styles.timeText, { color: msg.mine ? colors.surface + 'CC' : colors.textMuted }]}>{msg.time}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
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
  timeText: { marginTop: 4, fontSize: 10, alignSelf: 'flex-end' },
});
