import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto';
export declare class NotificationsService {
    private readonly notificationsRepository;
    constructor(notificationsRepository: NotificationsRepository);
    create(userId: string, dto: CreateNotificationDto): Promise<{
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
    getMyNotifications(userId: string, page?: number, limit?: number): Promise<{
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
    getUnreadCount(userId: string): Promise<number>;
}
