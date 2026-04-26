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
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    this.connectedUsers.set(data.userId, client.id);
    this.logger.log(`User ${data.userId} joined with socket ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; userId: string; content: string; mediaUrl?: string },
  ) {
    const message = await this.chatService.sendMessage(data.conversationId, data.userId, {
      content: data.content,
      mediaUrl: data.mediaUrl,
    });

    const conversation = await this.chatService.getConversations(data.userId); // Simplified
    const currentConv = conversation.find(c => c.id === data.conversationId);
    
    if (currentConv) {
      currentConv.participants.forEach(p => {
        const socketId = this.connectedUsers.get(p.userId);
        if (socketId) {
          this.server.to(socketId).emit('newMessage', message);
        }
      });
    }
  }
}
