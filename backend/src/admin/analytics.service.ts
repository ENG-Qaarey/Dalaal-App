import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [userCount, listingCount, activeEscrowCount, totalVolume] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.listing.count({ where: { status: 'ACTIVE' } }),
      this.prisma.escrow.count({ where: { status: 'HOLDING' } }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      userCount,
      listingCount,
      activeEscrowCount,
      totalVolume: totalVolume._sum.amount || 0,
    };
  }
}
