import io from 'socket.io-client/dist/socket.io.js';
import type { Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

// Use the same IP as the API
const SOCKET_URL = 'http://172.20.10.5:3001/chat';

class SocketService {
  private socket: Socket | null = null;

  async connect() {
    if (this.socket?.connected) return;

    const token = await SecureStore.getItemAsync('accessToken');
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat socket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat socket');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  join(userId: string) {
    this.socket?.emit('join', { userId });
  }

  sendMessage(data: { conversationId: string; userId: string; content: string; mediaUrl?: string }) {
    this.socket?.emit('sendMessage', data);
  }

  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('newMessage', callback);
  }

  offNewMessage() {
    this.socket?.off('newMessage');
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
