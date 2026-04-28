import io from 'socket.io-client/dist/socket.io.js';
import type { Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://172.20.10.5:3002/chat';

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

type NewMessageCallback = (message: any) => void;
type StatusCallback = (data: { messageId: string; status: MessageStatus; conversationId: string }) => void;
type ReadCallback = (data: { conversationId: string; userId: string; messageId?: string }) => void;

class SocketService {
  private socket: Socket | null = null;
  private newMessageCallbacks: NewMessageCallback[] = [];
  private statusCallbacks: StatusCallback[] = [];
  private readCallbacks: ReadCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async connect() {
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
        this.newMessageCallbacks.forEach(cb => cb(message));
      });

      this.socket.on('messageDelivered', (data) => {
        this.statusCallbacks.forEach(cb => cb({ ...data, status: 'delivered' }));
      });

      this.socket.on('messageRead', (data) => {
        this.readCallbacks.forEach(cb => cb(data));
      });

    } catch (error) {
      console.error('Failed to connect socket:', error);
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
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

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
