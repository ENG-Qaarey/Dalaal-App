import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UserRole } from '../common/enums';
import { AnalyticsPeriod } from './dto';

type DateRange = {
  from: Date;
  to: Date;
  previousFrom: Date;
  previousTo: Date;
  label: AnalyticsPeriod;
};

const BROKER_ROLES: UserRole[] = [
  UserRole.VERIFIED_DALAAL,
  UserRole.REGULAR_DALAAL,
  UserRole.PROPERTY_OWNER,
  UserRole.VEHICLE_OWNER,
];

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(period: AnalyticsPeriod = '30d'): DateRange {
    const days = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }[period];
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    const previousTo = new Date(from.getTime());
    const previousFrom = new Date(previousTo.getTime() - days * 24 * 60 * 60 * 1000);
    return { from, to, previousFrom, previousTo, label: period };
  }

  private changePercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  private toNumber(value: Prisma.Decimal | number | null | undefined): number {
    if (value == null) return 0;
    return Number(value);
  }

  async getDashboardStats() {
    const overview = await this.getOverview('30d');
    return {
      userCount: overview.users.total,
      listingCount: overview.listings.active,
      activeEscrowCount: overview.escrow.activeCount,
      totalVolume: overview.payments.completedVolume,
    };
  }

  async getOverview(period: AnalyticsPeriod = '30d') {
    const range = this.getDateRange(period);
    const { from, to, previousFrom, previousTo } = range;

    const [
      totalUsers,
      newUsers,
      prevNewUsers,
      activeListings,
      newListings,
      prevNewListings,
      listingsByType,
      activeEscrowCount,
      activeEscrowVolume,
      periodEscrowVolume,
      prevEscrowVolume,
      periodPaymentVolume,
      prevPaymentVolume,
      totalViews,
      totalInquiries,
      brokerCount,
      newBrokers,
      prevNewBrokers,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: from, lte: to } } }),
      this.prisma.user.count({ where: { createdAt: { gte: previousFrom, lte: previousTo } } }),
      this.prisma.listing.count({ where: { status: 'ACTIVE' } }),
      this.prisma.listing.count({ where: { createdAt: { gte: from, lte: to } } }),
      this.prisma.listing.count({ where: { createdAt: { gte: previousFrom, lte: previousTo } } }),
      this.prisma.listing.groupBy({
        by: ['type'],
        where: { status: 'ACTIVE' },
        _count: { _all: true },
      }),
      this.prisma.escrow.count({ where: { status: 'HOLDING' } }),
      this.prisma.escrow.aggregate({
        where: { status: 'HOLDING' },
        _sum: { amount: true },
      }),
      this.prisma.escrow.aggregate({
        where: { createdAt: { gte: from, lte: to } },
        _sum: { amount: true },
      }),
      this.prisma.escrow.aggregate({
        where: { createdAt: { gte: previousFrom, lte: previousTo } },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED', completedAt: { gte: from, lte: to } },
        _sum: { amount: true },
      }),
      this.prisma.payment.aggregate({
        where: { status: 'COMPLETED', completedAt: { gte: previousFrom, lte: previousTo } },
        _sum: { amount: true },
      }),
      this.prisma.listing.aggregate({ _sum: { viewCount: true } }),
      this.prisma.listing.aggregate({ _sum: { inquiryCount: true } }),
      this.prisma.user.count({ where: { role: { in: BROKER_ROLES } } }),
      this.prisma.user.count({
        where: { role: { in: BROKER_ROLES }, createdAt: { gte: from, lte: to } },
      }),
      this.prisma.user.count({
        where: { role: { in: BROKER_ROLES }, createdAt: { gte: previousFrom, lte: previousTo } },
      }),
    ]);

    const propertyCount =
      listingsByType.find((item) => item.type === 'PROPERTY')?._count._all ?? 0;
    const vehicleCount =
      listingsByType.find((item) => item.type === 'VEHICLE')?._count._all ?? 0;

    const views = this.toNumber(totalViews._sum.viewCount);
    const inquiries = this.toNumber(totalInquiries._sum.inquiryCount);
    const conversionRate = views > 0 ? Math.round((inquiries / views) * 1000) / 10 : 0;

    const currentPaymentVolume = this.toNumber(periodPaymentVolume._sum.amount);
    const previousPaymentVolume = this.toNumber(prevPaymentVolume._sum.amount);
    const currentEscrowVolume = this.toNumber(periodEscrowVolume._sum.amount);
    const previousEscrowVolumeAmount = this.toNumber(prevEscrowVolume._sum.amount);

    return {
      period: { from: from.toISOString(), to: to.toISOString(), label: range.label },
      users: {
        total: totalUsers,
        new: newUsers,
        brokers: brokerCount,
        newBrokers,
        changePercent: this.changePercent(newUsers, prevNewUsers),
        brokerChangePercent: this.changePercent(newBrokers, prevNewBrokers),
      },
      listings: {
        active: activeListings,
        new: newListings,
        byType: { PROPERTY: propertyCount, VEHICLE: vehicleCount },
        changePercent: this.changePercent(newListings, prevNewListings),
      },
      escrow: {
        activeCount: activeEscrowCount,
        activeVolume: this.toNumber(activeEscrowVolume._sum.amount),
        periodVolume: currentEscrowVolume,
        changePercent: this.changePercent(currentEscrowVolume, previousEscrowVolumeAmount),
      },
      payments: {
        completedVolume: currentPaymentVolume,
        changePercent: this.changePercent(currentPaymentVolume, previousPaymentVolume),
      },
      conversion: {
        views,
        inquiries,
        rate: conversionRate,
      },
    };
  }

  async getTimeseries(
    metric: 'revenue' | 'escrow' | 'users' | 'listings' = 'revenue',
    period: AnalyticsPeriod = '90d',
    granularity: 'day' | 'week' | 'month' = 'month',
  ) {
    const range = this.getDateRange(period);
    const trunc = granularity === 'day' ? 'day' : granularity === 'week' ? 'week' : 'month';

    let points: { date: string; value: number; escrow?: number }[] = [];

    if (metric === 'revenue' || metric === 'escrow') {
      const [revenueRows, escrowRows] = await Promise.all([
        this.prisma.$queryRaw<{ date: Date; value: Prisma.Decimal }[]>`
          SELECT date_trunc(${trunc}, "completedAt") AS date, COALESCE(SUM(amount), 0) AS value
          FROM payments
          WHERE status = 'COMPLETED'
            AND "completedAt" >= ${range.from}
            AND "completedAt" <= ${range.to}
          GROUP BY 1
          ORDER BY 1
        `,
        this.prisma.$queryRaw<{ date: Date; value: Prisma.Decimal }[]>`
          SELECT date_trunc(${trunc}, "createdAt") AS date, COALESCE(SUM(amount), 0) AS value
          FROM escrows
          WHERE "createdAt" >= ${range.from}
            AND "createdAt" <= ${range.to}
          GROUP BY 1
          ORDER BY 1
        `,
      ]);

      const escrowMap = new Map(
        escrowRows.map((row) => [row.date.toISOString(), this.toNumber(row.value)]),
      );

      if (metric === 'revenue') {
        points = revenueRows.map((row) => ({
          date: row.date.toISOString(),
          value: this.toNumber(row.value),
          escrow: escrowMap.get(row.date.toISOString()) ?? 0,
        }));
      } else {
        points = escrowRows.map((row) => ({
          date: row.date.toISOString(),
          value: this.toNumber(row.value),
        }));
      }
    } else if (metric === 'users') {
      const [userRows, brokerRows] = await Promise.all([
        this.prisma.$queryRaw<{ date: Date; value: bigint }[]>`
          SELECT date_trunc(${trunc}, "createdAt") AS date, COUNT(*)::bigint AS value
          FROM users
          WHERE "createdAt" >= ${range.from}
            AND "createdAt" <= ${range.to}
          GROUP BY 1
          ORDER BY 1
        `,
        this.prisma.$queryRaw<{ date: Date; value: bigint }[]>`
          SELECT date_trunc(${trunc}, "createdAt") AS date, COUNT(*)::bigint AS value
          FROM users
          WHERE role IN ('VERIFIED_DALAAL', 'REGULAR_DALAAL', 'PROPERTY_OWNER', 'VEHICLE_OWNER')
            AND "createdAt" >= ${range.from}
            AND "createdAt" <= ${range.to}
          GROUP BY 1
          ORDER BY 1
        `,
      ]);

      const brokerMap = new Map(
        brokerRows.map((row) => [row.date.toISOString(), Number(row.value)]),
      );

      points = userRows.map((row) => ({
        date: row.date.toISOString(),
        value: Number(row.value),
        escrow: brokerMap.get(row.date.toISOString()) ?? 0,
      }));
    } else {
      const listingRows = await this.prisma.$queryRaw<{ date: Date; value: bigint }[]>`
        SELECT date_trunc(${trunc}, "createdAt") AS date, COUNT(*)::bigint AS value
        FROM listings
        WHERE "createdAt" >= ${range.from}
          AND "createdAt" <= ${range.to}
        GROUP BY 1
        ORDER BY 1
      `;

      points = listingRows.map((row) => ({
        date: row.date.toISOString(),
        value: Number(row.value),
      }));
    }

    return {
      metric,
      granularity,
      period: { from: range.from.toISOString(), to: range.to.toISOString(), label: range.label },
      points: points.map((point) => ({
        date: point.date,
        value: point.value,
        ...(point.escrow != null ? { secondary: point.escrow } : {}),
      })),
    };
  }

  async getListingsBreakdown(
    groupBy: 'type' | 'city' | 'status' = 'type',
    period: AnalyticsPeriod = '30d',
  ) {
    const range = this.getDateRange(period);
    const where = { createdAt: { gte: range.from, lte: range.to } };

    const grouped = await this.prisma.listing.groupBy({
      by: [groupBy],
      where,
      _count: { _all: true },
    });

    const sorted = [...grouped].sort(
      (a, b) => (b._count?._all ?? 0) - (a._count?._all ?? 0),
    );
    const total = sorted.reduce((sum, item) => sum + (item._count?._all ?? 0), 0);

    return {
      groupBy,
      period: { from: range.from.toISOString(), to: range.to.toISOString(), label: range.label },
      items: sorted.map((item) => {
        const count = item._count?._all ?? 0;
        return {
          key: String(item[groupBy]),
          count,
          percent: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
        };
      }),
    };
  }

  async getBrokerStats(
    period: AnalyticsPeriod = '30d',
    limit = 10,
    sortBy: 'listings' | 'revenue' | 'leads' = 'listings',
  ) {
    const range = this.getDateRange(period);

    const brokers = await this.prisma.user.findMany({
      where: { role: { in: BROKER_ROLES } },
      include: {
        profile: true,
        listings: {
          where: { createdAt: { gte: range.from, lte: range.to } },
          select: {
            id: true,
            inquiryCount: true,
            viewCount: true,
          },
        },
        receivedPayments: {
          where: {
            status: 'COMPLETED',
            completedAt: { gte: range.from, lte: range.to },
          },
          select: { amount: true },
        },
      },
      take: 100,
    });

    const items = brokers
      .map((broker) => {
        const name = [broker.profile?.firstName, broker.profile?.lastName]
          .filter(Boolean)
          .join(' ')
          .trim() || broker.email;

        const listings = broker.listings.length;
        const leads = broker.listings.reduce((sum, listing) => sum + listing.inquiryCount, 0);
        const revenue = broker.receivedPayments.reduce(
          (sum, payment) => sum + this.toNumber(payment.amount),
          0,
        );

        return {
          userId: broker.id,
          name,
          role: broker.role,
          listings,
          leads,
          revenue,
          rating: broker.profile?.rating ?? 0,
          reviewCount: broker.profile?.reviewCount ?? 0,
        };
      })
      .filter((item) => item.listings > 0 || item.leads > 0 || item.revenue > 0)
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, limit);

    return {
      period: { from: range.from.toISOString(), to: range.to.toISOString(), label: range.label },
      sortBy,
      items,
    };
  }
}
