import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
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
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const clearActiveConversation = useChatStore((s) => s.clearActiveConversation);

  const userName = name || 'User';
  const isOnline = online === '1';
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isVoiceLocked, setIsVoiceLocked] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [pendingImageCaption, setPendingImageCaption] = useState('');
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [pendingFile, setPendingFile] = useState<{ uri: string; name: string } | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [mediaPreviewOpen, setMediaPreviewOpen] = useState(false);
  const [callSession, setCallSession] = useState<{
    callId: string;
    mode: 'audio' | 'video';
    status: 'ringing' | 'ongoing';
    direction: 'incoming' | 'outgoing';
    startedAt: number;
    acceptedAt?: number;
  } | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [composerFocusTick, setComposerFocusTick] = useState(0);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callSessionRef = useRef<typeof callSession>(null);
  const loadingMoreRef = useRef(false);
  loadingMoreRef.current = loadingMore;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const recordingTicker = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const isStartingRecordingRef = useRef(false);
  const pendingVoiceLockRef = useRef(false);
  const pendingStopAfterStartRef = useRef<boolean | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatTime = useCallback(
    (value?: string | Date) => new Date(value || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    []
  );

  const buildMessage = useCallback(
    (message: any, mine: boolean): ChatMessage => ({
      id: message.id,
      text: message.content || '',
      time: formatTime(message.createdAt),
      createdAt: message.createdAt,
      type: message.type,
      mine,
      status: mine ? 'sent' : 'read',
      imageUri: message.mediaUrl,
    }),
    [formatTime]
  );

  const sortMessages = useCallback((items: ChatMessage[]) => {
    return [...items].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });
  }, []);

  const syncPreviewAfterDelete = useCallback(async () => {
    if (!conversationId) return;
    try {
      const latest = await chatService.getMessages(conversationId, 1, 1);
      useChatStore.getState().updateConversationPreview(conversationId, latest?.[0]);
    } catch {
      // ignore preview refresh errors
    }
  }, [conversationId]);

  const loadMessages = useCallback(async (loadMore: boolean = false) => {
    const currentPage = loadMore ? page + 1 : 1;
    
    if (loadMore) {
      if (loadingMoreRef.current) return;
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const data = await chatService.getMessages(conversationId!, currentPage, 30);
      const mappedMessages: ChatMessage[] = data.map((msg: any) => ({
        id: msg.id,
        text: msg.content || '',
        time: formatTime(msg.createdAt),
        createdAt: msg.createdAt,
        type: msg.type,
        mine: msg.senderId === user?.id,
        status: 'read',
        imageUri: msg.mediaUrl,
      }));
      
      const newMessages = loadMore 
        ? [...mappedMessages.reverse(), ...messagesRef.current]
        : mappedMessages.reverse();
      
      setMessages(sortMessages(newMessages));
      setHasMore(data.length === 30);
      setPage(currentPage);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
}, [conversationId, user?.id, page, formatTime, sortMessages]);

useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    callSessionRef.current = callSession;
  }, [callSession]);

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

  useEffect(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (!callSession || callSession.status !== 'ongoing') {
      setCallDurationSeconds(0);
      return;
    }

    const initialAcceptedAt = callSession.acceptedAt ?? Date.now();
    callTimerRef.current = setInterval(() => {
      const seconds = Math.max(0, Math.floor((Date.now() - initialAcceptedAt) / 1000));
      setCallDurationSeconds(seconds);
    }, 1000);

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    };
  }, [callSession]);

  useEffect(() => {
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    if (!callSession || callSession.status !== 'ringing' || callSession.direction !== 'outgoing') {
      return;
    }

    callTimeoutRef.current = setTimeout(() => {
      if (!callSessionRef.current || callSessionRef.current.callId !== callSession.callId) return;
      if (conversationId && user?.id) {
        socketService.endCall({
          callId: callSession.callId,
          conversationId,
          userId: user.id,
          reason: 'timeout',
        });
      }
      setCallSession(null);
      setCallDurationSeconds(0);
    }, 45000);

    return () => {
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }
    };
  }, [callSession, conversationId, user?.id]);

  useFocusEffect(
    useCallback(() => {
      if (!conversationId || !user?.id) return () => undefined;
      void loadMessages(false);
      useChatStore.getState().markConversationRead(conversationId);
      return () => undefined;
    }, [conversationId, user?.id, loadMessages])
  );

  useEffect(() => {
    if (!conversationId || !user?.id) return;

    setActiveConversation(conversationId);
    useChatStore.getState().markConversationRead(conversationId);

    const handleNewMessage = (message: any) => {
      if (message.conversationId === conversationId) {
        if (message.senderId === user.id) {
          // Replace temp message with real one (deduplication)
          setMessages((prev) => {
            const exists = prev.some(m => m.id === message.id);
            if (exists) return prev;
            if (message.tempId) {
              const replaced = prev.map(m =>
                m.id === message.tempId
                  ? { ...m, id: message.id, status: 'sent' as const, time: formatTime(message.createdAt), createdAt: message.createdAt }
                  : m
              );
              return sortMessages(replaced);
            }

            return sortMessages([...prev, buildMessage(message, true)]);
          });
        } else {
          const newMessage = buildMessage(message, false);
          setMessages((prev) => {
            if (prev.some(m => m.id === message.id)) return prev;
            return sortMessages([...prev, newMessage]);
          });
          
          // Mark as read
          socketService.markRead(conversationId, user.id, message.id);
        }
      }
    };

    const handleMessageDelivered = (data: { messageId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => 
          prev.map(m => m.id === data.messageId ? { ...m, status: 'delivered' as const } : m)
        );
      }
    };

    const handleMessageRead = (data: { conversationId: string; userId: string; messageId?: string }) => {
      if (data.conversationId === conversationId && data.userId === user.id) {
        setMessages((prev) => 
          prev.map(m => m.status !== 'sending' ? { ...m, status: 'read' as const } : m)
        );
      }
    };

    const handleIncomingCall = (data: { callId: string; conversationId: string; callerId: string; mode: 'audio' | 'video'; startedAt: number }) => {
      if (data.conversationId !== conversationId) return;
      const existing = callSessionRef.current;
      if (existing && existing.status === 'ongoing') {
        socketService.declineCall({ callId: data.callId, conversationId: data.conversationId, userId: user.id });
        return;
      }
      setCallSession({
        callId: data.callId,
        mode: data.mode,
        status: 'ringing',
        direction: 'incoming',
        startedAt: data.startedAt || Date.now(),
      });
    };

    const handleCallAccepted = (data: { callId: string; conversationId: string; userId: string; acceptedAt?: number }) => {
      if (data.conversationId !== conversationId) return;
      const current = callSessionRef.current;
      if (!current || current.callId !== data.callId) return;
      setCallSession({
        ...current,
        status: 'ongoing',
        acceptedAt: data.acceptedAt || Date.now(),
      });
    };

    const handleCallDeclined = (data: { callId: string; conversationId: string; userId: string }) => {
      if (data.conversationId !== conversationId) return;
      const current = callSessionRef.current;
      if (!current || current.callId !== data.callId) return;
      setCallSession(null);
      setCallDurationSeconds(0);
    };

    const handleCallEnded = (data: { callId: string; conversationId: string; userId: string }) => {
      if (data.conversationId !== conversationId) return;
      const current = callSessionRef.current;
      if (!current || current.callId !== data.callId) return;
      setCallSession(null);
      setCallDurationSeconds(0);
    };

    const handleMessageDeleted = (data: { messageId: string; conversationId: string }) => {
      if (data.conversationId !== conversationId) return;
      setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
      void syncPreviewAfterDelete();
    };

    const handleUserTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (data.conversationId !== conversationId) return;
      if (data.userId === user.id) return;
      setIsPeerTyping(data.isTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (data.isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsPeerTyping(false);
          typingTimeoutRef.current = null;
        }, 2200);
      }
    };

    const setup = async () => {
      await socketService.connect(user.id);
      
      socketService.onNewMessage(handleNewMessage);
      socketService.onMessageStatus(handleMessageDelivered);
      socketService.onMessageRead(handleMessageRead);
      socketService.onMessageDeleted(handleMessageDeleted);
      socketService.onIncomingCall(handleIncomingCall);
      socketService.onCallAccepted(handleCallAccepted);
      socketService.onCallDeclined(handleCallDeclined);
      socketService.onCallEnded(handleCallEnded);
      socketService.onUserTyping(handleUserTyping);
    };

    setup();

    return () => {
      socketService.offNewMessage(handleNewMessage);
      socketService.offMessageStatus(handleMessageDelivered);
      socketService.offMessageRead(handleMessageRead);
      socketService.offMessageDeleted(handleMessageDeleted);
      socketService.offIncomingCall(handleIncomingCall);
      socketService.offCallAccepted(handleCallAccepted);
      socketService.offCallDeclined(handleCallDeclined);
      socketService.offCallEnded(handleCallEnded);
      socketService.offUserTyping(handleUserTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setIsPeerTyping(false);
      clearActiveConversation();
    };
  }, [conversationId, user?.id, syncPreviewAfterDelete]);

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

  const performDelete = useCallback(
    async (messageId: string, scope: 'self' | 'all') => {
      let removedMessage: ChatMessage | null = null;
      setMessages((prev) => {
        const toRemove = prev.find((msg) => msg.id === messageId) || null;
        removedMessage = toRemove;
        return prev.filter((msg) => msg.id !== messageId);
      });
      try {
        await chatService.deleteMessage(messageId, scope);
      } catch (error: any) {
        if (removedMessage) {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === removedMessage?.id)) return prev;
            return sortMessages([...prev, removedMessage as ChatMessage]);
          });
        }
        Alert.alert('Delete failed', error?.message || 'Could not delete message.');
      } finally {
        await syncPreviewAfterDelete();
      }
    },
    [sortMessages, syncPreviewAfterDelete]
  );

  const deleteMessageForMe = useCallback((messageId: string) => {
    Alert.alert('Delete message', 'Delete this message for you only?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void performDelete(messageId, 'self') },
    ]);
  }, [performDelete]);

  const deleteMessageForEveryone = useCallback((messageId: string) => {
    Alert.alert('Delete for everyone', 'This will remove the message for all participants.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void performDelete(messageId, 'all') },
    ]);
  }, [performDelete]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed && !pendingFile && pendingImages.length === 0) return;

    const tempId = `temp_${Date.now()}`;
    const nowIso = new Date().toISOString();
    const myMessage: ChatMessage = {
      id: tempId,
      text: trimmed,
      time: formatTime(nowIso),
      createdAt: nowIso,
      mine: true,
      status: 'sending',
      imageUri: pendingImages[0],
    };
    
    setMessages((prev) => [...prev, myMessage]);

    if (conversationId && user?.id) {
      socketService.sendTyping({ conversationId, userId: user.id, isTyping: false });
      useChatStore.getState().applyIncomingMessage({
        id: tempId,
        conversationId,
        senderId: user.id,
        content: trimmed,
        mediaUrl: pendingImages[0],
        createdAt: nowIso,
      });
      if (socketService.isConnected()) {
        socketService.sendMessage({
          conversationId,
          userId: user.id,
          content: trimmed,
          mediaUrl: pendingImages[0],
          tempId,
        });
      } else {
        try {
          const saved = await chatService.sendMessage(conversationId, {
            content: trimmed,
            mediaUrl: pendingImages[0],
            tempId,
          });
          setMessages((prev) => {
            const replaced = prev.map((msg) =>
              msg.id === tempId
                ? { ...msg, id: saved.id, status: 'sent' as const, time: formatTime(saved.createdAt), createdAt: saved.createdAt }
                : msg
            );
            return sortMessages(replaced);
          });
        } catch (error: any) {
          Alert.alert('Message failed', error?.message || 'Could not send message.');
        }
      }
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

  const beginCall = useCallback(
    (mode: 'audio' | 'video') => {
      if (!conversationId || !user?.id) return;
      const callId = `call_${Date.now()}`;
      setCallSession({
        callId,
        mode,
        status: 'ringing',
        direction: 'outgoing',
        startedAt: Date.now(),
      });
      socketService.startCall({
        callId,
        conversationId,
        userId: user.id,
        mode,
      });
    },
    [conversationId, user?.id]
  );

  const acceptCall = useCallback(async () => {
    if (!callSession || !conversationId || !user?.id) return;
    if (callSession.mode === 'video') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert('Camera permission', 'Please allow camera access to accept video calls.');
        return;
      }
    }
    const micPermission = await Audio.requestPermissionsAsync();
    if (!micPermission.granted) {
      Alert.alert('Microphone permission', 'Please allow microphone access to accept calls.');
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    socketService.acceptCall({
      callId: callSession.callId,
      conversationId,
      userId: user.id,
    });
    setCallSession({
      ...callSession,
      status: 'ongoing',
      acceptedAt: Date.now(),
    });
  }, [callSession, conversationId, user?.id]);

  const declineCall = useCallback(() => {
    if (!callSession || !conversationId || !user?.id) return;
    socketService.declineCall({
      callId: callSession.callId,
      conversationId,
      userId: user.id,
    });
    setCallSession(null);
    setCallDurationSeconds(0);
  }, [callSession, conversationId, user?.id]);

  const endCall = useCallback(() => {
    if (!callSession || !conversationId || !user?.id) return;
    socketService.endCall({
      callId: callSession.callId,
      conversationId,
      userId: user.id,
      reason: 'ended',
    });
    setCallSession(null);
    setCallDurationSeconds(0);
  }, [callSession, conversationId, user?.id]);

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
    beginCall('audio');
  }, [beginCall]);

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
    beginCall('video');
  }, [beginCall]);

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

  const handleComposerChange = useCallback(
    (value: string) => {
      setText(value);
      if (!conversationId || !user?.id) return;
      socketService.sendTyping({
        conversationId,
        userId: user.id,
        isTyping: value.trim().length > 0,
      });
    },
    [conversationId, user?.id]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.surface }]}>
      <OnboardingBackground primary={C.brandBlue} secondary={C.brandOrange} soft={C.brandBlueSoft} />
      <ConversationHeader
        colors={C}
        userName={userName}
        userRole={role}
        isOnline={isOnline}
        typingText={isPeerTyping ? 'Typing...' : null}
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
          <ChatWindow 
            colors={C} 
            messages={messages} 
            onReactToMessage={reactToMessage}
            onDeleteMessage={deleteMessageForMe}
            onDeleteMessageForEveryone={deleteMessageForEveryone}
            onEndReached={() => hasMore && !loadingMore && loadMessages(true)}
            loadingMore={loadingMore}
            autoScrollToBottom={true}
            scrollToBottomSignal={composerFocusTick}
          />
        </View>
        <ChatComposer
          colors={C}
          value={text}
          onChangeText={handleComposerChange}
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
          onInputFocus={() => setComposerFocusTick((value) => value + 1)}
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
          visible={!!callSession}
          mode={callSession?.mode || null}
          direction={callSession?.direction || 'outgoing'}
          status={callSession?.status || 'ringing'}
          durationSeconds={callDurationSeconds}
          userName={userName}
          userImageUri={imageUri}
          isOnline={isOnline}
          colors={C}
          onAccept={acceptCall}
          onDecline={declineCall}
          onEnd={endCall}
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
