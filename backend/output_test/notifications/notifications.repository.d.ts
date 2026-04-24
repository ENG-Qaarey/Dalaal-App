import { PrismaService } from '../database/prisma.service';
export declare class NotificationsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
        readAt: Date | null;
        body: string;
        actionUrl: string | null;
    }>;
    findByUserId(userId: string, skip?: number, take?: number): Promise<{
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
        readAt: Date | null;
        body: string;
        actionUrl: string | null;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
        readAt: Date | null;
        body: string;
        actionUrl: string | null;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    countUnread(userId: string): Promise<number>;
}
