import io from 'socket.io-client/dist/socket.io.js';
import type { Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const resolveDevHost = () => {
  const manifest = Constants.manifest as any;
  const manifest2 = (Constants as any).manifest2;
  const hostUri =
    Constants.expoConfig?.hostUri ||
    manifest?.debuggerHost ||
    manifest2?.extra?.expoClient?.hostUri;
  const host = hostUri?.split(':')[0];

  if (host) {
    return host;
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || `http://${resolveDevHost()}:3000/chat`;

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
type CallMode = 'audio' | 'video';

type NewMessageCallback = (message: any) => void;
type StatusCallback = (data: { messageId: string; status: MessageStatus; conversationId: string }) => void;
type ReadCallback = (data: { conversationId: string; userId: string; messageId?: string }) => void;
type MessageDeletedCallback = (data: { messageId: string; conversationId: string }) => void;
type IncomingCallCallback = (data: { callId: string; conversationId: string; callerId: string; mode: CallMode; startedAt: number }) => void;
type CallAcceptedCallback = (data: { callId: string; conversationId: string; userId: string; acceptedAt?: number }) => void;
type CallDeclinedCallback = (data: { callId: string; conversationId: string; userId: string }) => void;
type CallEndedCallback = (data: { callId: string; conversationId: string; userId: string }) => void;

class SocketService {
  private socket: Socket | null = null;
  private newMessageCallbacks: NewMessageCallback[] = [];
  private statusCallbacks: StatusCallback[] = [];
  private readCallbacks: ReadCallback[] = [];
  private messageDeletedCallbacks: MessageDeletedCallback[] = [];
  private incomingCallCallbacks: IncomingCallCallback[] = [];
  private callAcceptedCallbacks: CallAcceptedCallback[] = [];
  private callDeclinedCallbacks: CallDeclinedCallback[] = [];
  private callEndedCallbacks: CallEndedCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private userId: string | null = null;

  async connect(userId?: string) {
    if (userId) {
      this.setUserId(userId);
    }
    if (this.socket?.connected) return;

    try {
      const token = await SecureStore.getItemAsync('accessToken');
      
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to chat socket');
        this.reconnectAttempts = 0;
        if (this.userId) {
          this.join(this.userId);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from chat socket:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        this.reconnectAttempts++;
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
      });

      this.socket.on('newMessage', (message) => {
        if (message?.id && message?.conversationId && this.userId) {
          this.socket?.emit('messageAck', {
            messageId: message.id,
            conversationId: message.conversationId,
            userId: this.userId,
            senderId: message.senderId,
          });
        }
        this.newMessageCallbacks.forEach(cb => cb(message));
      });

      this.socket.on('messageDelivered', (data) => {
        this.statusCallbacks.forEach(cb => cb({ ...data, status: 'delivered' }));
      });

      this.socket.on('messageRead', (data) => {
        this.readCallbacks.forEach(cb => cb(data));
      });

      this.socket.on('messageDeleted', (data) => {
        this.messageDeletedCallbacks.forEach(cb => cb(data));
      });

      this.socket.on('call:incoming', (data) => {
        this.incomingCallCallbacks.forEach(cb => cb(data));
      });

      this.socket.on('call:accepted', (data) => {
        this.callAcceptedCallbacks.forEach(cb => cb(data));
      });

      this.socket.on('call:declined', (data) => {
        this.callDeclinedCallbacks.forEach(cb => cb(data));
      });

      this.socket.on('call:ended', (data) => {
        this.callEndedCallbacks.forEach(cb => cb(data));
      });

    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.userId = null;
  }

  setUserId(userId: string | null) {
    this.userId = userId;
    if (userId && this.socket?.connected) {
      this.join(userId);
    }
  }

  join(userId: string) {
    this.socket?.emit('join', { userId });
  }

  markRead(conversationId: string, userId: string, messageId?: string) {
    this.socket?.emit('markRead', { conversationId, userId, messageId });
  }

  sendMessage(data: { conversationId: string; userId: string; content: string; mediaUrl?: string; tempId?: string }) {
    this.socket?.emit('sendMessage', data);
  }

  startCall(data: { conversationId: string; userId: string; mode: CallMode; callId: string }) {
    this.socket?.emit('call:start', data);
  }

  acceptCall(data: { conversationId: string; userId: string; callId: string }) {
    this.socket?.emit('call:accept', data);
  }

  declineCall(data: { conversationId: string; userId: string; callId: string }) {
    this.socket?.emit('call:decline', data);
  }

  endCall(data: { conversationId: string; userId: string; callId: string; reason?: 'ended' | 'timeout' | 'cancelled' }) {
    this.socket?.emit('call:end', data);
  }

  onNewMessage(callback: NewMessageCallback) {
    this.newMessageCallbacks.push(callback);
  }

  offNewMessage(callback?: NewMessageCallback) {
    if (callback) {
      const index = this.newMessageCallbacks.indexOf(callback);
      if (index > -1) this.newMessageCallbacks.splice(index, 1);
    } else {
      this.newMessageCallbacks = [];
    }
  }

  onMessageStatus(callback: StatusCallback) {
    this.statusCallbacks.push(callback);
  }

  offMessageStatus(callback?: StatusCallback) {
    if (callback) {
      const index = this.statusCallbacks.indexOf(callback);
      if (index > -1) this.statusCallbacks.splice(index, 1);
    } else {
      this.statusCallbacks = [];
    }
  }

  onMessageRead(callback: ReadCallback) {
    this.readCallbacks.push(callback);
  }

  offMessageRead(callback?: ReadCallback) {
    if (callback) {
      const index = this.readCallbacks.indexOf(callback);
      if (index > -1) this.readCallbacks.splice(index, 1);
    } else {
      this.readCallbacks = [];
    }
  }

  onMessageDeleted(callback: MessageDeletedCallback) {
    this.messageDeletedCallbacks.push(callback);
  }

  offMessageDeleted(callback?: MessageDeletedCallback) {
    if (callback) {
      const index = this.messageDeletedCallbacks.indexOf(callback);
      if (index > -1) this.messageDeletedCallbacks.splice(index, 1);
    } else {
      this.messageDeletedCallbacks = [];
    }
  }

  onIncomingCall(callback: IncomingCallCallback) {
    this.incomingCallCallbacks.push(callback);
  }

  offIncomingCall(callback?: IncomingCallCallback) {
    if (callback) {
      const index = this.incomingCallCallbacks.indexOf(callback);
      if (index > -1) this.incomingCallCallbacks.splice(index, 1);
    } else {
      this.incomingCallCallbacks = [];
    }
  }

  onCallAccepted(callback: CallAcceptedCallback) {
    this.callAcceptedCallbacks.push(callback);
  }

  offCallAccepted(callback?: CallAcceptedCallback) {
    if (callback) {
      const index = this.callAcceptedCallbacks.indexOf(callback);
      if (index > -1) this.callAcceptedCallbacks.splice(index, 1);
    } else {
      this.callAcceptedCallbacks = [];
    }
  }

  onCallDeclined(callback: CallDeclinedCallback) {
    this.callDeclinedCallbacks.push(callback);
  }

  offCallDeclined(callback?: CallDeclinedCallback) {
    if (callback) {
      const index = this.callDeclinedCallbacks.indexOf(callback);
      if (index > -1) this.callDeclinedCallbacks.splice(index, 1);
    } else {
      this.callDeclinedCallbacks = [];
    }
  }

  onCallEnded(callback: CallEndedCallback) {
    this.callEndedCallbacks.push(callback);
  }

  offCallEnded(callback?: CallEndedCallback) {
    if (callback) {
      const index = this.callEndedCallbacks.indexOf(callback);
      if (index > -1) this.callEndedCallbacks.splice(index, 1);
    } else {
      this.callEndedCallbacks = [];
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
