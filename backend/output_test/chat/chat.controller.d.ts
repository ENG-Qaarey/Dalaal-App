import { ChatService } from './chat.service';
import { CreateConversationDto, CreateMessageDto } from './dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createConversation(user: any, dto: CreateConversationDto): Promise<{
        participants: ({
            user: {
                profile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    currency: string | null;
                    city: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    avatar: string | null;
                    bio: string | null;
                    country: string | null;
                    isDiaspora: boolean;
                    language: string | null;
                    whatsappNumber: string | null;
                    telegramHandle: string | null;
                    totalListings: number;
                    rating: number | null;
                    reviewCount: number;
                    responseRate: number | null;
                } | null;
            } & {
                email: string;
                password: string | null;
                id: string;
                phone: string | null;
                googleId: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.UserStatus;
                emailVerified: boolean;
                phoneVerified: boolean;
                twoFactorEnabled: boolean;
                lastLoginAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            isAdmin: boolean;
            lastReadAt: Date | null;
            unreadCount: number;
            joinedAt: Date;
            conversationId: string;
            userId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string | null;
        title: string | null;
        isGroup: boolean;
        lastMessageAt: Date | null;
        messageCount: number;
    }>;
    getConversations(user: any): Promise<({
        participants: ({
            user: {
                profile: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    currency: string | null;
                    city: string | null;
                    firstName: string | null;
                    lastName: string | null;
                    avatar: string | null;
                    bio: string | null;
                    country: string | null;
                    isDiaspora: boolean;
                    language: string | null;
                    whatsappNumber: string | null;
                    telegramHandle: string | null;
                    totalListings: number;
                    rating: number | null;
                    reviewCount: number;
                    responseRate: number | null;
                } | null;
            } & {
                email: string;
                password: string | null;
                id: string;
                phone: string | null;
                googleId: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                status: import(".prisma/client").$Enums.UserStatus;
                emailVerified: boolean;
                phoneVerified: boolean;
                twoFactorEnabled: boolean;
                lastLoginAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            isAdmin: boolean;
            lastReadAt: Date | null;
            unreadCount: number;
            joinedAt: Date;
            conversationId: string;
            userId: string;
        })[];
        messages: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            conversationId: string;
            type: import(".prisma/client").$Enums.MessageType;
            content: string | null;
            mediaUrl: string | null;
            isRead: boolean;
            readAt: Date | null;
            senderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string | null;
        title: string | null;
        isGroup: boolean;
        lastMessageAt: Date | null;
        messageCount: number;
    })[]>;
    getMessages(id: string, user: any, page?: number, limit?: number): Promise<({
        sender: {
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                currency: string | null;
                city: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                bio: string | null;
                country: string | null;
                isDiaspora: boolean;
                language: string | null;
                whatsappNumber: string | null;
                telegramHandle: string | null;
                totalListings: number;
                rating: number | null;
                reviewCount: number;
                responseRate: number | null;
            } | null;
        } & {
            email: string;
            password: string | null;
            id: string;
            phone: string | null;
            googleId: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            emailVerified: boolean;
            phoneVerified: boolean;
            twoFactorEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
        type: import(".prisma/client").$Enums.MessageType;
        content: string | null;
        mediaUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        senderId: string;
    })[]>;
    sendMessage(id: string, user: any, dto: CreateMessageDto): Promise<{
        sender: {
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                currency: string | null;
                city: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                bio: string | null;
                country: string | null;
                isDiaspora: boolean;
                language: string | null;
                whatsappNumber: string | null;
                telegramHandle: string | null;
                totalListings: number;
                rating: number | null;
                reviewCount: number;
                responseRate: number | null;
            } | null;
        } & {
            email: string;
            password: string | null;
            id: string;
            phone: string | null;
            googleId: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            emailVerified: boolean;
            phoneVerified: boolean;
            twoFactorEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        conversationId: string;
        type: import(".prisma/client").$Enums.MessageType;
        content: string | null;
        mediaUrl: string | null;
        isRead: boolean;
        readAt: Date | null;
        senderId: string;
    }>;
}
