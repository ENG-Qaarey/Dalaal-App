import { PrismaService } from '../database/prisma.service';
export declare class ChatRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createConversation(userId: string, participantId: string, listingId?: string, title?: string): Promise<{
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
    findUserConversations(userId: string): Promise<({
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
    findConversationById(id: string): Promise<({
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
    }) | null>;
    createMessage(conversationId: string, senderId: string, content: string, mediaUrl?: string): Promise<{
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
    findMessages(conversationId: string, skip?: number, take?: number): Promise<({
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
}
