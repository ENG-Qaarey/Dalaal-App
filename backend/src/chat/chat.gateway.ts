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
import { WsJwtGuard } from '../common/guards/ws-jwt.guard';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto';

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

  constructor(private readonly chatService: ChatService) {}

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

      const conversation = await this.chatService.getConversations(data.userId);
      const currentConv = conversation.find(c => c.id === data.conversationId);
      
      if (currentConv) {
        const messagePayload = { 
          ...message, 
          conversationId: data.conversationId,
          tempId: data.tempId,
        };
        
        currentConv.participants.forEach(p => {
          const socketIds = this.userSockets.get(p.userId);
          if (socketIds) {
            socketIds.forEach(socketId => {
              this.server.to(socketId).emit('newMessage', messagePayload);
              
              if (p.userId !== data.userId) {
                this.server.to(socketId).emit('messageDelivered', {
                  messageId: message.id,
                  conversationId: data.conversationId,
                });
              }
            });
          }
        });
      }
      
      return { success: true, message };
    } catch (error) {
      this.logger.error('Failed to send message:', error);
      return { success: false, error: 'Failed to send message' };
    }
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
