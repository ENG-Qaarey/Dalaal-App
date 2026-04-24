import { PrismaService } from '../database/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        userCount: number;
        listingCount: number;
        activeEscrowCount: number;
        totalVolume: number | import("@prisma/client/runtime/library").Decimal;
    }>;
}
