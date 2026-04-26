import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../../constants/theme';
import { useAppTheme } from '../../../context/theme-context';
import ConversationHeader from '../../../components/chat/ConversationHeader';
import ChatWindow, { ChatMessage } from '../../../components/chat/ChatWindow';
import ChatCameraModal from '../../../components/chat/ChatCameraModal';
import ChatMediaPreviewModal from '../../../components/chat/ChatMediaPreviewModal';
import ChatComposer from '../../../components/chat/ChatComposer';
import CallSessionModal from '../../../components/chat/CallSessionModal';
import OnboardingBackground from '../../../components/OnboardingBackground';
import { socketService } from '../../../services/socket';
import { chatService } from '../../../services/chat';
import { useAuthStore } from '../../../store/authStore';
import { useChatStore } from '../../../store/chatStore';

export default function Conversation() {
  const router = useRouter();
  const { id: conversationId, name, role, online, imageUri } = useLocalSearchParams<{
    id: string;
    name?: string;
    role?: string;
    online?: string;
    imageUri?: string;
  }>();
  const { scheme } = useAppTheme();
  const C = Colors[scheme];
  const user = useAuthStore((s) => s.user);
  const addMessageToStore = useChatStore((s) => s.addMessage);

  const userName = name || 'User';
  const isOnline = online === '1';
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isVoiceLocked, setIsVoiceLocked] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [pendingImageCaption, setPendingImageCaption] = useState('');
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [pendingFile, setPendingFile] = useState<{ uri: string; name: string } | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [mediaPreviewOpen, setMediaPreviewOpen] = useState(false);
  const [callMode, setCallMode] = useState<'audio' | 'video' | null>(null);
  const recordingTicker = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const isStartingRecordingRef = useRef(false);
  const pendingStopAfterStartRef = useRef<boolean | null>(null);
  const pendingVoiceLockRef = useRef(false);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      setupSocket();
    }
    return () => {
      socketService.offNewMessage();
    };
  }, [conversationId]);

  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    return () => {
      if (recordingTicker.current) {
        clearInterval(recordingTicker.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => null);
      }
    };
  }, []);

  const pushSystemMessage = useCallback((messageText: string) => {
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

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(conversationId!);
      const mappedMessages: ChatMessage[] = data.map((msg: any) => ({
        id: msg.id,
        text: msg.content || '',
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: msg.senderId === user?.id,
        status: 'read',
        imageUri: msg.mediaUrl,
      }));
      setMessages(mappedMessages.reverse());
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = async () => {
    await socketService.connect();
    if (user?.id) {
      socketService.join(user.id);
    }
    socketService.onNewMessage((message) => {
      if (message.conversationId === conversationId) {
        const newMessage: ChatMessage = {
          id: message.id,
          text: message.content || '',
          time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mine: message.senderId === user?.id,
          status: 'read',
          imageUri: message.mediaUrl,
        };
        setMessages((prev) => [...prev, newMessage]);
        addMessageToStore(conversationId!, message);
      }
    });
  };

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed && !pendingFile && pendingImages.length === 0) return;

    if (conversationId && user?.id) {
      socketService.sendMessage({
        conversationId,
        userId: user.id,
        content: trimmed,
        mediaUrl: pendingImages[0], // Simplified for now
      });
    }

    setText('');
    setPendingImages([]);
    setPendingImageCaption('');
    setPendingFile(null);
  };

  const sendPendingImage = () => {
    if (pendingImages.length === 0) return;
    sendMessage();
    setMediaPreviewOpen(false);
  };

  const handleAttach = async () => {
    const ensureGalleryPermission = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Gallery permission', 'Please allow gallery access to pick images.');
        return false;
      }
      return true;
    };

    const pickSingleImage = async () => {
      try {
        const allowed = await ensureGalleryPermission();
        if (!allowed) return;
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.9,
          allowsMultipleSelection: false,
        });
        if (result.canceled) return;
        const uri = result.assets?.[0]?.uri;
        if (!uri) return;
        setPendingImages([uri]);
        setPreviewImageIndex(0);
        setPendingImageCaption('');
        setPendingFile(null);
      } catch {
        Alert.alert('Attachment failed', 'Could not pick image.');
      }
    };

    const pickMultipleImages = async () => {
      try {
        const allowed = await ensureGalleryPermission();
        if (!allowed) return;
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.9,
          allowsMultipleSelection: true,
          selectionLimit: 10,
        });
        if (result.canceled) return;
        const uris = (result.assets || []).map((asset) => asset.uri).filter(Boolean) as string[];
        if (uris.length === 0) return;
        setPendingImages((prev) => {
          const next = [...prev, ...uris];
          if (prev.length === 0) setPreviewImageIndex(0);
          return next;
        });
        setPendingImageCaption('');
        setPendingFile(null);
      } catch {
        Alert.alert('Attachment failed', 'Could not pick multiple images.');
      }
    };

    const pickFile = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: true,
          multiple: false,
        });
        if (result.canceled) return;
        const asset = result.assets?.[0];
        if (!asset?.uri) return;
        setPendingFile({ uri: asset.uri, name: asset.name || 'Attached file' });
        setPendingImages([]);
        setPreviewImageIndex(0);
        setPendingImageCaption('');
        setMediaPreviewOpen(false);
      } catch {
        Alert.alert('Attachment failed', 'Could not open file picker.');
      }
    };

    Alert.alert('Attach', 'Choose how you want to select:', [
      { text: 'Single image', onPress: () => void pickSingleImage() },
      { text: 'Multiple images', onPress: () => void pickMultipleImages() },
      { text: 'File', onPress: () => void pickFile() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleCamera = async () => {
    setCameraOpen(true);
  };

  const startVoiceRecording = async () => {
    try {
      if (recordingRef.current || isStartingRecordingRef.current) return;
      if (text.trim() || pendingFile || pendingImages.length > 0) return;
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
      const durationMs = status.durationMillis ?? 0;
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

  const startAudioCall = React.useCallback(async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Microphone permission', 'Please allow microphone access for calls.');
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    setCallMode('audio');
  }, []);

  const startVideoCall = React.useCallback(async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      Alert.alert('Camera permission', 'Please allow camera access for video calls.');
      return;
    }
    const micPermission = await Audio.requestPermissionsAsync();
    if (!micPermission.granted) {
      Alert.alert('Microphone permission', 'Please allow microphone access for video calls.');
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    setCallMode('video');
  }, []);

  const reactToMessage = React.useCallback((messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reaction: emoji,
            }
          : m
      )
    );
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      <ConversationHeader
        colors={C}
        userName={userName}
        userRole={role}
        isOnline={isOnline}
        userImageUri={imageUri}
        onBack={() => router.back()}
        onAudioCall={() => void startAudioCall()}
        onVideoCall={() => void startVideoCall()}
      />
      <KeyboardAvoidingView
        style={styles.keyboardWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.body}>
          <ChatWindow colors={C} messages={messages} onReactToMessage={reactToMessage} />
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
          pendingImageUri={pendingImages[0] || null}
          pendingImageCount={pendingImages.length}
          pendingFileName={pendingFile?.name || null}
          onEditPendingImage={() => {
            if (pendingImages.length === 0) return;
            setPreviewImageIndex(0);
            setMediaPreviewOpen(true);
          }}
          onClearPendingAttachment={() => {
            setPendingImages([]);
            setPreviewImageIndex(0);
            setPendingImageCaption('');
            setPendingFile(null);
          }}
          isRecording={!!recording}
          isVoiceLocked={isVoiceLocked}
          recordingSeconds={recordingSeconds}
          canSend={!!text.trim() || !!pendingFile || pendingImages.length > 0}
        />
        <ChatCameraModal
          visible={cameraOpen}
          colors={C}
          onClose={() => setCameraOpen(false)}
          onCapture={(uri) => {
            setPendingImages((prev) => {
              const next = [...prev, uri];
              if (prev.length === 0) setPreviewImageIndex(0);
              return next;
            });
            setPendingImageCaption('');
            setPendingFile(null);
          }}
        />
        <ChatMediaPreviewModal
          visible={mediaPreviewOpen}
          colors={C}
          images={pendingImages}
          activeIndex={previewImageIndex}
          onChangeIndex={setPreviewImageIndex}
          caption={pendingImageCaption}
          onCaptionChange={setPendingImageCaption}
          onClose={() => {
            setMediaPreviewOpen(false);
          }}
          onSend={sendPendingImage}
        />
        <CallSessionModal
          visible={!!callMode}
          mode={callMode}
          userName={userName}
          userImageUri={imageUri}
          isOnline={isOnline}
          colors={C}
          onEnd={() => setCallMode(null)}
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
