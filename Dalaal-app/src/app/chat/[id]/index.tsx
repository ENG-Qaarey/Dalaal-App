import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../../constants/theme';
import { useAppTheme } from '../../../context/theme-context';
import ConversationHeader from '../../../components/chat/ConversationHeader';
import ChatWindow, { ChatMessage } from '../../../components/chat/ChatWindow';
import ChatComposer from '../../../components/chat/ChatComposer';

export default function Conversation() {
  const router = useRouter();
  const { name, role, online } = useLocalSearchParams<{
    name?: string;
    role?: string;
    online?: string;
  }>();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const userName = name || 'User';
  const isOnline = online === '1';
  const [text, setText] = React.useState('');
  const [recording, setRecording] = React.useState<Audio.Recording | null>(null);
  const [recordingSeconds, setRecordingSeconds] = React.useState(0);
  const [isVoiceLocked, setIsVoiceLocked] = React.useState(false);
  const [pendingImageUri, setPendingImageUri] = React.useState<string | null>(null);
  const recordingTicker = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = React.useRef<Audio.Recording | null>(null);
  const recordingStartedAtRef = React.useRef<number | null>(null);
  const isStartingRecordingRef = React.useRef(false);
  const pendingStopAfterStartRef = React.useRef<boolean | null>(null);
  const pendingVoiceLockRef = React.useRef(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 'm1', text: `Hi, this is ${userName}.`, time: '10:21', mine: false },
    { id: 'm2', text: 'Great, let us continue here.', time: '10:22', mine: true },
  ]);
  const pushSystemMessage = React.useCallback((messageText: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: true,
      },
    ]);
  }, []);

  React.useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  React.useEffect(() => {
    return () => {
      if (recordingTicker.current) {
        clearInterval(recordingTicker.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => null);
      }
    };
  }, []);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed && !pendingImageUri) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        text: trimmed,
        imageUri: pendingImageUri || undefined,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: true,
      },
    ]);
    setText('');
    setPendingImageUri(null);
  };

  const handleAttach = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Gallery permission', 'Please allow gallery access to pick photos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      setPendingImageUri(asset.uri);
    } catch {
      Alert.alert('Gallery failed', 'Could not open photo gallery.');
    }
  };

  const handleCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Camera permission', 'Please allow camera access to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      setPendingImageUri(asset.uri);
    } catch {
      Alert.alert('Camera failed', 'Could not open camera.');
    }
  };

  const startVoiceRecording = async () => {
    try {
      if (recordingRef.current || isStartingRecordingRef.current) return;
      if (text.trim() || pendingImageUri) return;
      pendingVoiceLockRef.current = false;
      pendingStopAfterStartRef.current = null;
      isStartingRecordingRef.current = true;

      if (Platform.OS === 'web') {
        Alert.alert('Not supported', 'Voice recording is not supported on web in this app.');
        isStartingRecordingRef.current = false;
        return;
      }

      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Microphone permission', 'Please allow microphone access to record voice messages.');
        isStartingRecordingRef.current = false;
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = newRecording;
      setRecording(newRecording);
      setIsVoiceLocked(pendingVoiceLockRef.current);
      setRecordingSeconds(0);
      recordingStartedAtRef.current = Date.now();
      if (recordingTicker.current) clearInterval(recordingTicker.current);
      recordingTicker.current = setInterval(() => {
        if (!recordingStartedAtRef.current) return;
        const elapsed = Math.max(0, Math.floor((Date.now() - recordingStartedAtRef.current) / 1000));
        setRecordingSeconds(elapsed);
      }, 250);
      isStartingRecordingRef.current = false;

      if (pendingStopAfterStartRef.current !== null) {
        const shouldCancel = pendingStopAfterStartRef.current;
        pendingStopAfterStartRef.current = null;
        await finishVoiceRecording(shouldCancel, newRecording);
      }
    } catch {
      setRecording(null);
      recordingRef.current = null;
      setIsVoiceLocked(false);
      pendingVoiceLockRef.current = false;
      pendingStopAfterStartRef.current = null;
      isStartingRecordingRef.current = false;
      Alert.alert('Voice message failed', 'Could not start or stop recording.');
    }
  };

  const finishVoiceRecording = async (cancelled: boolean, targetRecording?: Audio.Recording) => {
    const activeRecording = targetRecording ?? recordingRef.current;
    if (!activeRecording) return;
    try {
      await activeRecording.stopAndUnloadAsync();
      const status = await activeRecording.getStatusAsync();
      const uri = activeRecording.getURI();
      const durationMs = status.isLoaded ? status.durationMillis ?? 0 : 0;
      const seconds = Math.max(1, Math.round(durationMs / 1000));
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      if (recordingTicker.current) {
        clearInterval(recordingTicker.current);
        recordingTicker.current = null;
      }
      setRecording(null);
      recordingRef.current = null;
      setIsVoiceLocked(false);
      setRecordingSeconds(0);
      recordingStartedAtRef.current = null;
      pendingVoiceLockRef.current = false;
      pendingStopAfterStartRef.current = null;
      isStartingRecordingRef.current = false;

      if (cancelled) return;
      if (!uri) {
        pushSystemMessage(`Voice message (${seconds}s)`);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          text: '',
          audioUri: uri,
          audioDurationSeconds: seconds,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mine: true,
        },
      ]);
    } catch {
      if (recordingTicker.current) {
        clearInterval(recordingTicker.current);
        recordingTicker.current = null;
      }
      setRecording(null);
      recordingRef.current = null;
      setIsVoiceLocked(false);
      setRecordingSeconds(0);
      recordingStartedAtRef.current = null;
      pendingVoiceLockRef.current = false;
      pendingStopAfterStartRef.current = null;
      isStartingRecordingRef.current = false;
      Alert.alert('Voice message failed', 'Could not finish recording.');
    }
  };

  const stopVoiceRecording = async (cancelled: boolean, force = false) => {
    if (!force && (isVoiceLocked || pendingVoiceLockRef.current)) return;
    if (!recordingRef.current && isStartingRecordingRef.current) {
      pendingStopAfterStartRef.current = cancelled;
      return;
    }
    await finishVoiceRecording(cancelled);
  };

  const lockVoiceRecording = () => {
    pendingVoiceLockRef.current = true;
    setIsVoiceLocked(true);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]}>
      <ConversationHeader colors={C} userName={userName} userRole={role} isOnline={isOnline} onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.body}>
          <ChatWindow colors={C} messages={messages} />
        </View>
        <ChatComposer
          colors={C}
          value={text}
          onChangeText={setText}
          onSend={sendMessage}
          onAttach={handleAttach}
          onCamera={handleCamera}
          onVoiceHoldStart={startVoiceRecording}
          onVoiceHoldEnd={stopVoiceRecording}
          onVoiceLock={lockVoiceRecording}
          onVoiceLockedSend={() => finishVoiceRecording(false)}
          onVoiceLockedCancel={() => finishVoiceRecording(true)}
          isRecording={!!recording}
          isVoiceLocked={isVoiceLocked}
          recordingSeconds={recordingSeconds}
          canSend={!!text.trim() || !!pendingImageUri}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  keyboardWrap: { flex: 1 },
  body: { flex: 1 },
});
