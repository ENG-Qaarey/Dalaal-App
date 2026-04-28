import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import { ChatService } from './chat.service';
import { v4 as uuidv4 } from 'uuid';

type CallSession = {
  callId: string;
  conversationId: string;
  callerId: string;
  mode: 'audio' | 'video';
  startedAt: number;
  acceptedAt?: number;
};

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private connectedUsers = new Map<string, string>();
  private userSockets = new Map<string, Set<string>>();
  private activeCalls = new Map<string, CallSession>();
  private redisClient: any | null = null;
  private redisInitialized = false;
  private readonly useRedisCallSessions: boolean;

  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {
    this.useRedisCallSessions = this.configService.get<string>('USE_REDIS_CALL_SESSIONS') === 'true';
  }

  private async getRedisClient() {
    if (!this.useRedisCallSessions) return null;
    if (this.redisInitialized) return this.redisClient;
    this.redisInitialized = true;
    try {
      const redisModule = await import('redis');
      const client = redisModule.createClient({
        socket: {
          host: this.configService.get<string>('redis.host'),
          port: this.configService.get<number>('redis.port'),
        },
        password: this.configService.get<string>('redis.password') || undefined,
      });
      client.on('error', (error: unknown) => {
        this.logger.warn(`Redis call session client error: ${String(error)}`);
      });
      await client.connect();
      this.redisClient = client;
      return this.redisClient;
    } catch (error) {
      this.logger.warn('Redis call session store unavailable; using in-memory fallback');
      this.redisClient = null;
      return null;
    }
  }

  private callSessionKey(callId: string) {
    return `chat:call_session:${callId}`;
  }

  private async getCallSession(callId: string): Promise<CallSession | null> {
    const redis = await this.getRedisClient();
    if (!redis) return this.activeCalls.get(callId) ?? null;
    const raw = await redis.get(this.callSessionKey(callId));
    return raw ? (JSON.parse(raw) as CallSession) : null;
  }

  private async setCallSession(session: CallSession) {
    const redis = await this.getRedisClient();
    if (!redis) {
      this.activeCalls.set(session.callId, session);
      return;
    }
    await redis.set(this.callSessionKey(session.callId), JSON.stringify(session), { EX: 7200 });
  }

  private async deleteCallSession(callId: string) {
    const redis = await this.getRedisClient();
    if (!redis) {
      this.activeCalls.delete(callId);
      return;
    }
    await redis.del(this.callSessionKey(callId));
  }

  private async setCallAcceptedAt(callId: string, acceptedAt: number): Promise<CallSession | null> {
    const redis = await this.getRedisClient();
    if (!redis) {
      const session = this.activeCalls.get(callId);
      if (!session) return null;
      if (!session.acceptedAt) {
        session.acceptedAt = acceptedAt;
        this.activeCalls.set(callId, session);
      }
      return session;
    }

    const lockKey = `${this.callSessionKey(callId)}:lock`;
    const lockToken = uuidv4();
    const lock = await redis.set(lockKey, lockToken, { NX: true, PX: 3000 });
    if (!lock) {
      return this.getCallSession(callId);
    }

    try {
      const raw = await redis.get(this.callSessionKey(callId));
      if (!raw) return null;
      const session = JSON.parse(raw) as CallSession;
      if (!session.acceptedAt) {
        session.acceptedAt = acceptedAt;
        await redis.set(this.callSessionKey(callId), JSON.stringify(session), { EX: 7200 });
      }
      return session;
    } finally {
      const currentToken = await redis.get(lockKey);
      if (currentToken === lockToken) {
        await redis.del(lockKey);
      }
    }
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketIds] of this.userSockets.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        if (socketIds.size === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)?.add(client.id);
    this.connectedUsers.set(data.userId, client.id);
    this.logger.log(`User ${data.userId} joined with socket ${client.id}`);
  }

  @SubscribeMessage('markRead')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string; messageId?: string },
  ) {
    await this.chatService.markMessagesAsRead(data.conversationId, data.userId, data.messageId);
    
    const conversation = await this.chatService.getConversations(data.userId);
    const currentConv = conversation.find(c => c.id === data.conversationId);
    
    if (currentConv) {
      currentConv.participants.forEach(p => {
        const socketIds = this.userSockets.get(p.userId);
        if (socketIds) {
          socketIds.forEach(socketId => {
            this.server.to(socketId).emit('messageRead', {
              conversationId: data.conversationId,
              userId: data.userId,
              messageId: data.messageId,
            });
          });
        }
      });
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string; content: string; mediaUrl?: string; tempId?: string },
  ) {
    try {
      const message = await this.chatService.sendMessage(data.conversationId, data.userId, {
        content: data.content,
        mediaUrl: data.mediaUrl,
      });

      await this.emitMessageToParticipants(message, data.conversationId, data.userId, data.tempId);
      
      return { success: true, message };
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }

  @SubscribeMessage('call:start')
  async handleCallStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string; mode: 'audio' | 'video'; callId?: string },
  ) {
    try {
      const conversation = await this.chatService.getConversationById(data.conversationId, data.userId);
      if (!conversation) return { success: false, error: 'Conversation not found' };

      const isParticipant = conversation.participants.some(p => p.userId === data.userId);
      if (!isParticipant) return { success: false, error: 'Not a participant in this conversation' };

      const callId = data.callId || uuidv4();
      const startedAt = Date.now();
      const session = { callId, conversationId: data.conversationId, callerId: data.userId, mode: data.mode, startedAt };
      await this.setCallSession(session);

      this.emitCallEvent(conversation, 'call:incoming', {
        callId,
        conversationId: data.conversationId,
        callerId: data.userId,
        mode: data.mode,
        startedAt,
      }, data.userId);

      return { success: true, callId };
    } catch (error) {
      this.logger.error('Failed to start call:', error);
      return { success: false, error: 'Failed to start call' };
    }
  }

  @SubscribeMessage('call:accept')
  async handleCallAccept(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; conversationId: string; userId: string },
  ) {
    const session = await this.getCallSession(data.callId);
    if (!session) return { success: false, error: 'Call not found' };
    if (session.conversationId !== data.conversationId) return { success: false, error: 'Invalid conversation' };

    const conversation = await this.chatService.getConversationById(session.conversationId, data.userId);
    if (!conversation) return { success: false, error: 'Conversation not found' };
    const isParticipant = conversation.participants.some((p) => p.userId === data.userId);
    if (!isParticipant || data.userId === session.callerId) {
      return { success: false, error: 'Not authorized' };
    }

    const updatedSession = await this.setCallAcceptedAt(data.callId, Date.now());
    if (!updatedSession) return { success: false, error: 'Call not found' };
    if (conversation) {
      this.emitCallEvent(conversation, 'call:accepted', {
        callId: updatedSession.callId,
        conversationId: updatedSession.conversationId,
        userId: data.userId,
        acceptedAt: updatedSession.acceptedAt,
      });
    }

    return { success: true };
  }

  @SubscribeMessage('call:decline')
  async handleCallDecline(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; conversationId: string; userId: string },
  ) {
    const session = await this.getCallSession(data.callId);
    if (!session) return { success: false, error: 'Call not found' };
    const conversation = await this.chatService.getConversationById(session.conversationId);
    if (!conversation) return { success: false, error: 'Conversation not found' };
    const isParticipant = conversation.participants.some((p) => p.userId === data.userId);
    if (!isParticipant) {
      return { success: false, error: 'Not authorized' };
    }

    await this.finalizeCall(session, 'declined');
    if (conversation) {
      this.emitCallEvent(conversation, 'call:declined', {
        callId: session.callId,
        conversationId: session.conversationId,
        userId: data.userId,
      });
    }

    return { success: true };
  }

  @SubscribeMessage('call:end')
  async handleCallEnd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { callId: string; conversationId: string; userId: string; reason?: 'ended' | 'timeout' | 'cancelled' },
  ) {
    const session = await this.getCallSession(data.callId);
    if (!session) return { success: false, error: 'Call not found' };
    const conversation = await this.chatService.getConversationById(session.conversationId);
    if (!conversation) return { success: false, error: 'Conversation not found' };
    const isParticipant = conversation.participants.some((p) => p.userId === data.userId);
    if (!isParticipant) {
      return { success: false, error: 'Not authorized' };
    }

    await this.finalizeCall(session, data.reason || 'ended');
    if (conversation) {
      this.emitCallEvent(conversation, 'call:ended', {
        callId: session.callId,
        conversationId: session.conversationId,
        userId: data.userId,
      });
    }

    return { success: true };
  }

  private emitCallEvent(
    conversation: any,
    event: string,
    payload: any,
    excludeUserId?: string,
  ) {
    conversation.participants.forEach((participant: any) => {
      if (excludeUserId && participant.userId === excludeUserId) return;
      const socketIds = this.userSockets.get(participant.userId);
      if (!socketIds) return;
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit(event, payload);
      });
    });
  }

  private async finalizeCall(
    session: CallSession,
    reason: 'ended' | 'timeout' | 'cancelled' | 'declined',
  ) {
    const current = await this.getCallSession(session.callId);
    if (!current) return;
    await this.deleteCallSession(session.callId);

    const durationSeconds = current.acceptedAt ? Math.max(0, Math.floor((Date.now() - current.acceptedAt) / 1000)) : 0;
    const status = current.acceptedAt
      ? 'answered'
      : reason === 'declined'
      ? 'declined'
      : 'missed';

    const content = `CALL|${status}|${current.mode}|${durationSeconds}`;
    const systemMessage = await this.chatService.createSystemMessage(current.conversationId, current.callerId, content);
    await this.emitMessageToParticipants(systemMessage, current.conversationId, current.callerId);
  }

  async emitMessageToParticipants(message: any, conversationId: string, senderId: string, tempId?: string) {
    const conversation = await this.chatService.getConversationById(conversationId);
    if (!conversation) return;

    const messagePayload = {
      ...message,
      conversationId,
      tempId,
    };

    conversation.participants.forEach((participant) => {
      const socketIds = this.userSockets.get(participant.userId);
      if (!socketIds) return;
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit('newMessage', messagePayload);
      });
    });
  }

  @SubscribeMessage('messageAck')
  handleMessageAck(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; conversationId: string; userId: string; senderId?: string },
  ) {
    if (!data.senderId) return { success: true };
    const senderSocketIds = this.userSockets.get(data.senderId);
    if (!senderSocketIds) return { success: true };
    senderSocketIds.forEach((socketId) => {
      this.server.to(socketId).emit('messageDelivered', {
        messageId: data.messageId,
        conversationId: data.conversationId,
      });
    });

    return { success: true };
  }

  async emitMessageDeleted(conversationId: string, messageId: string, senderId?: string) {
    const conversation = await this.chatService.getConversationById(conversationId);
    if (!conversation) return;
    conversation.participants.forEach((participant) => {
      const socketIds = this.userSockets.get(participant.userId);
      if (!socketIds) return;
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit('messageDeleted', {
          conversationId,
          messageId,
          senderId,
        });
      });
    });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string; isTyping: boolean },
  ) {
    const socketIds = this.userSockets.get(data.userId);
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.server.to(socketId).emit('userTyping', {
          conversationId: data.conversationId,
          userId: data.userId,
          isTyping: data.isTyping,
        });
      });
    }
  }
}
