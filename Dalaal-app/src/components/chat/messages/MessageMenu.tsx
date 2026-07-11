import React from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  selectedMessage: any | null;
  colors: any;
  onClose: () => void;
  onReact: (emoji: string) => void;
  onDeleteForMe: (id: string) => void;
  onDeleteForEveryone?: (id: string) => void;
};

export default function MessageMenu({
  visible,
  selectedMessage,
  colors,
  onClose,
  onReact,
  onDeleteForMe,
  onDeleteForEveryone,
}: Props) {
  const reactionChoices = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.menuWrap}>
          <View style={[styles.reactionBar, { backgroundColor: colors.surface, borderColor: colors.brandBorder }]}>
            {reactionChoices.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.reactionBarBtn}
                onPress={() => onReact(emoji)}
              >
                <Text style={styles.reactionBarEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.reactionBarBtn} onPress={onClose}>
              <Ionicons name="add" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={[styles.actionMenu, { backgroundColor: colors.surface, borderColor: colors.brandBorder }]}>
            <TouchableOpacity style={styles.actionRow} onPress={onClose}>
              <Text style={[styles.actionText, { color: colors.textMain }]}>Reply</Text>
              <Ionicons name="arrow-undo-outline" size={17} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                if (selectedMessage?.text) {
                  Alert.alert('Copied', 'Message text copied style action selected.');
                }
                onClose();
              }}
            >
              <Text style={[styles.actionText, { color: colors.textMain }]}>Copy</Text>
              <Ionicons name="copy-outline" size={17} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow} onPress={onClose}>
              <Text style={[styles.actionText, { color: colors.textMain }]}>Info</Text>
              <Ionicons name="information-circle-outline" size={17} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionRow} onPress={onClose}>
              <Text style={[styles.actionText, { color: colors.textMain }]}>Star</Text>
              <Ionicons name="star-outline" size={17} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                if (selectedMessage) onDeleteForMe(selectedMessage.id);
                onClose();
              }}
            >
              <Text style={[styles.actionText, { color: '#E11D48' }]}>Delete for me</Text>
              <Ionicons name="trash-outline" size={17} color="#E11D48" />
            </TouchableOpacity>
            {selectedMessage?.mine ? (
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  if (selectedMessage && onDeleteForEveryone) onDeleteForEveryone(selectedMessage.id);
                  onClose();
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
  );
}

const styles = StyleSheet.create({
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
});
