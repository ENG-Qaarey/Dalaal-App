import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: any, page?: number, limit?: number): Promise<{
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
    getUnreadCount(user: any): Promise<{
        count: number;
    }>;
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
    markAllAsRead(user: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
