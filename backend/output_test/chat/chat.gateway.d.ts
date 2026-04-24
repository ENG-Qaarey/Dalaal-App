import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, data: {
        userId: string;
    }): void;
    handleMessage(client: Socket, data: {
        conversationId: string;
        userId: string;
        content: string;
        mediaUrl?: string;
    }): Promise<void>;
}
