import React from 'react';
import { PanResponder, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  colors: any;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach: () => void;
  onCamera: () => void;
  onVoiceHoldStart: () => void;
  onVoiceHoldEnd: (cancelled: boolean, force?: boolean) => void;
  onVoiceLock: () => void;
  onVoiceLockedSend: () => void;
  onVoiceLockedCancel: () => void;
  isRecording?: boolean;
  isVoiceLocked?: boolean;
  canSend?: boolean;
  recordingSeconds?: number;
};

export default function ChatComposer({
  colors,
  value,
  onChangeText,
  onSend,
  onAttach,
  onCamera,
  onVoiceHoldStart,
  onVoiceHoldEnd,
  onVoiceLock,
  onVoiceLockedSend,
  onVoiceLockedCancel,
  isRecording = false,
  isVoiceLocked = false,
  canSend = false,
  recordingSeconds = 0,
}: Props) {
  const HOLD_TO_RECORD_MS = 180;
  const LOCK_THRESHOLD = 38;
  const CANCEL_THRESHOLD = -55;
  const CANCEL_RESET_THRESHOLD = -30;
  const [touchStartX, setTouchStartX] = React.useState(0);
  const [touchStartY, setTouchStartY] = React.useState(0);
  const [cancelArmed, setCancelArmed] = React.useState(false);
  const [gestureLocked, setGestureLocked] = React.useState(false);
  const cancelArmedRef = React.useRef(false);
  const gestureLockedRef = React.useRef(false);
  const holdTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingStartedByHoldRef = React.useRef(false);
  const lastTouchXRef = React.useRef(0);
  const lastTouchYRef = React.useRef(0);

  const timerLabel = React.useMemo(() => {
    const mins = Math.floor(recordingSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (recordingSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [recordingSeconds]);

  const handleGestureRelease = React.useCallback(
    (endX: number, endY: number) => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (!recordingStartedByHoldRef.current) {
        setCancelArmed(false);
        cancelArmedRef.current = false;
        return;
      }
      const dx = endX - touchStartX;
      const dy = touchStartY - endY;
      const shouldLock = dy > LOCK_THRESHOLD;
      const shouldCancel = dx < CANCEL_THRESHOLD;
      const cancelRequested = shouldCancel || cancelArmedRef.current;

      if (cancelRequested) {
        onVoiceHoldEnd(true, true);
      } else if (!isVoiceLocked && !gestureLockedRef.current && shouldLock) {
        setGestureLocked(true);
        gestureLockedRef.current = true;
        onVoiceLock();
      } else if (!isVoiceLocked && !gestureLockedRef.current) {
        onVoiceHoldEnd(false, false);
      }
      setCancelArmed(false);
      cancelArmedRef.current = false;
      recordingStartedByHoldRef.current = false;
    },
    [touchStartX, touchStartY, isVoiceLocked, onVoiceHoldEnd, onVoiceLock]
  );

  const micPanResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          setTouchStartX(pageX);
          setTouchStartY(pageY);
          lastTouchXRef.current = pageX;
          lastTouchYRef.current = pageY;
          setCancelArmed(false);
          setGestureLocked(false);
          cancelArmedRef.current = false;
          gestureLockedRef.current = false;
          recordingStartedByHoldRef.current = false;
          if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
          }
          holdTimerRef.current = setTimeout(() => {
            recordingStartedByHoldRef.current = true;
            onVoiceHoldStart();
          }, HOLD_TO_RECORD_MS);
        },
        onPanResponderMove: (event) => {
          const { pageX, pageY } = event.nativeEvent;
          lastTouchXRef.current = pageX;
          lastTouchYRef.current = pageY;
          if (!recordingStartedByHoldRef.current) return;

          const dx = pageX - touchStartX;
          const dy = touchStartY - pageY;
          if (dx < CANCEL_THRESHOLD && !cancelArmedRef.current) {
            setCancelArmed(true);
            cancelArmedRef.current = true;
          }
          if (dx > CANCEL_RESET_THRESHOLD && cancelArmedRef.current) {
            setCancelArmed(false);
            cancelArmedRef.current = false;
          }
          const movingMostlyUp = dy > Math.abs(dx) + 14;
          if (dy > LOCK_THRESHOLD && movingMostlyUp && !cancelArmedRef.current && !gestureLockedRef.current && !isVoiceLocked) {
            setGestureLocked(true);
            gestureLockedRef.current = true;
            onVoiceLock();
          }
        },
        onPanResponderRelease: () => {
          handleGestureRelease(lastTouchXRef.current, lastTouchYRef.current);
        },
        onPanResponderTerminate: () => {
          handleGestureRelease(lastTouchXRef.current, lastTouchYRef.current);
        },
      }),
    [CANCEL_RESET_THRESHOLD, CANCEL_THRESHOLD, HOLD_TO_RECORD_MS, LOCK_THRESHOLD, handleGestureRelease, isVoiceLocked, onVoiceHoldStart, onVoiceLock, touchStartX, touchStartY]
  );

  return (
    <View style={[styles.wrap, { borderTopColor: colors.brandBorder, backgroundColor: colors.surface }]}>
      {isRecording && !isVoiceLocked ? (
        <View style={[styles.lockRail, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
          <Ionicons name="chevron-up" size={20} color={colors.textMuted} />
          <Ionicons name="mic-outline" size={16} color={colors.textMuted} />
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.sideBtn, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}
        onPress={isRecording && isVoiceLocked ? onVoiceLockedCancel : onAttach}
        disabled={isRecording && !isVoiceLocked}
      >
        <Ionicons name={isRecording && isVoiceLocked ? 'trash-outline' : 'attach'} size={16} color={colors.textMain} />
      </TouchableOpacity>

      <View style={[styles.inputWrap, { borderColor: colors.brandBorder, backgroundColor: colors.tableRow }]}>
        {isRecording ? (
          <View style={styles.recordingRow}>
            <Ionicons name="mic" size={17} color="#EF476F" />
            <Text style={[styles.recordingTime, { color: colors.textMain }]}>{timerLabel}</Text>
            <Text style={[styles.recordingHint, { color: cancelArmed ? '#EF476F' : colors.textMuted }]}>
              {isVoiceLocked ? 'Locked - tap send' : cancelArmed ? 'Release to cancel' : 'slide to cancel / up to lock'}
            </Text>
          </View>
        ) : (
          <>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="Type a message"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.textMain }]}
              multiline
            />
            <TouchableOpacity onPress={onCamera}>
              <Ionicons name="camera-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {isRecording && isVoiceLocked ? (
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.brandBlue }]} onPress={onVoiceLockedSend}>
          <Ionicons name="send" size={15} color={colors.surface} />
        </TouchableOpacity>
      ) : canSend ? (
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.brandBlue }]} onPress={onSend}>
          <Ionicons name="send" size={15} color={colors.surface} />
        </TouchableOpacity>
      ) : (
        <View
          style={[styles.sideBtn, { backgroundColor: colors.tableRow, borderColor: colors.brandBorder }]}
          {...micPanResponder.panHandlers}
        >
          <Ionicons name="mic" size={16} color={isRecording ? '#EF476F' : colors.textMain} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sideBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockRail: {
    position: 'absolute',
    right: 8,
    bottom: 44,
    width: 44,
    height: 128,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  inputWrap: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: { flex: 1, fontSize: 13, maxHeight: 92, paddingVertical: 0, textAlignVertical: 'center' },
  recordingRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  recordingTime: { fontSize: 15, fontWeight: '700', minWidth: 50 },
  recordingHint: { fontSize: 12, fontWeight: '700' },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
