import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ChatItem = {
  id: string;
  name: string;
  role: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
  pinned: boolean;
  imageUri?: string;
};

type Props = {
  chats: ChatItem[];
  colors: any;
  onPressChat: (chat: ChatItem) => void;
};

const initialsFor = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();

export default function ChatList({ chats, colors, onPressChat }: Props) {
  return (
    <View style={styles.chatList}>
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          activeOpacity={0.9}
          onPress={() => onPressChat(chat)}
          style={[styles.chatCard, { backgroundColor: colors.surface, borderColor: colors.brandBorder, shadowColor: colors.textMain }]}
        >
          <View style={styles.chatLeft}>
            <View style={[styles.chatAvatar, { backgroundColor: colors.tableRow }]}>
              <Text style={[styles.chatInitials, { color: colors.textMain }]}>{initialsFor(chat.name)}</Text>
              {chat.online ? <View style={[styles.onlineDot, { backgroundColor: colors.brandOrange }]} /> : null}
            </View>
          </View>
          <View style={styles.chatBody}>
            <View style={styles.chatTopRow}>
              <View style={styles.chatTitleRow}>
                <Text style={[styles.chatName, { color: colors.textMain }]} numberOfLines={1}>
                  {chat.name}
                </Text>
                {chat.pinned ? <Ionicons name="star" size={12} color={colors.brandOrange} style={{ marginLeft: 6 }} /> : null}
              </View>
              <Text style={[styles.chatTime, { color: colors.textMuted }]}>{chat.time}</Text>
            </View>
            <Text style={[styles.chatRole, { color: colors.textMuted }]} numberOfLines={1}>
              {chat.role}
            </Text>
            <Text style={[styles.chatMessage, { color: colors.textMain }]} numberOfLines={1}>
              {chat.message}
            </Text>
          </View>
          <View style={styles.chatMeta}>
            {chat.unread > 0 ? (
              <View style={[styles.unreadBadge, { backgroundColor: colors.brandBlue }]}>
                <Text style={[styles.unreadText, { color: colors.surface }]}>{chat.unread}</Text>
              </View>
            ) : (
              <Ionicons name="checkmark-done" size={14} color={colors.textMuted} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chatList: { gap: 10, marginBottom: 10 },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    shadowOpacity: 0.06,
    elevation: 2,
  },
  chatLeft: { marginRight: 10 },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInitials: { fontSize: 14, fontWeight: '900' },
  onlineDot: { position: 'absolute', right: 6, top: 6, width: 8, height: 8, borderRadius: 999 },
  chatBody: { flex: 1 },
  chatTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatTitleRow: { flexDirection: 'row', alignItems: 'center', maxWidth: '75%' },
  chatName: { fontSize: 12, fontWeight: '900' },
  chatTime: { fontSize: 9 },
  chatRole: { marginTop: 2, fontSize: 9 },
  chatMessage: { marginTop: 4, fontSize: 10, fontWeight: '700' },
  chatMeta: { marginLeft: 8, alignItems: 'center' },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { fontSize: 10, fontWeight: '900' },
});
