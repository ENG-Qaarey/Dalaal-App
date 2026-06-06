import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AnalyticsPeriod } from '../admin/dto';

type DateRange = {
  from: Date;
  to: Date;
  previousFrom: Date;
  previousTo: Date;
  label: AnalyticsPeriod;
};

@Injectable()
export class AgentsService {
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

  private formatRelativeTime(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }

  async getMyStats(userId: string, period: AnalyticsPeriod = '30d') {
    const range = this.getDateRange(period);
    const { from, to, previousFrom, previousTo } = range;

    const [listings, profile] = await Promise.all([
      this.prisma.listing.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          status: true,
          viewCount: true,
          favoriteCount: true,
          inquiryCount: true,
          createdAt: true,
        },
      }),
      this.prisma.profile.findUnique({ where: { userId } }),
    ]);

    const listingIds = listings.map((listing) => listing.id);

    const [periodLeads, prevLeads] = await Promise.all([
      listingIds.length
        ? this.prisma.conversation.count({
            where: {
              listingId: { in: listingIds },
              createdAt: { gte: from, lte: to },
            },
          })
        : Promise.resolve(0),
      listingIds.length
        ? this.prisma.conversation.count({
            where: {
              listingId: { in: listingIds },
              createdAt: { gte: previousFrom, lte: previousTo },
            },
          })
        : Promise.resolve(0),
    ]);

    const activeListings = listings.filter((listing) => listing.status === 'ACTIVE').length;
    const totalViews = listings.reduce((sum, listing) => sum + listing.viewCount, 0);
    const totalFavorites = listings.reduce((sum, listing) => sum + listing.favoriteCount, 0);
    const totalInquiries = listings.reduce((sum, listing) => sum + listing.inquiryCount, 0);
    const conversionRate =
      totalViews > 0 ? Math.round((totalInquiries / totalViews) * 1000) / 10 : 0;

    const recentLeads = await this.getRecentLeads(userId, 5);

    return {
      period: { from: from.toISOString(), to: to.toISOString(), label: range.label },
      views: {
        total: totalViews,
        changePercent: 0,
      },
      favorites: {
        total: totalFavorites,
        changePercent: 0,
      },
      leads: {
        total: periodLeads,
        active: totalInquiries,
        changePercent: this.changePercent(periodLeads, prevLeads),
      },
      conversion: {
        rate: conversionRate,
        changePercent: 0,
      },
      activeListings,
      profile: {
        rating: profile?.rating ?? 0,
        reviewCount: profile?.reviewCount ?? 0,
        responseRate: profile?.responseRate ?? 0,
        totalListings: profile?.totalListings ?? listings.length,
      },
      listingBreakdown: listings
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 10)
        .map((listing) => ({
          id: listing.id,
          title: listing.title,
          status: listing.status,
          views: listing.viewCount,
          favorites: listing.favoriteCount,
          inquiries: listing.inquiryCount,
        })),
      recentLeads,
    };
  }

  async getRecentLeads(userId: string, limit = 10) {
    const listings = await this.prisma.listing.findMany({
      where: { userId },
      select: { id: true, title: true },
    });
    const listingIds = listings.map((listing) => listing.id);
    const listingTitles = new Map(listings.map((listing) => [listing.id, listing.title]));

    if (!listingIds.length) {
      return [];
    }

    const conversations = await this.prisma.conversation.findMany({
      where: {
        listingId: { in: listingIds },
      },
      include: {
        participants: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return conversations.map((conversation) => {
      const leadParticipant = conversation.participants.find(
        (participant) => participant.userId !== userId,
      );
      const profile = leadParticipant?.user.profile;
      const name =
        [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim() ||
        leadParticipant?.user.email ||
        'Unknown lead';

      const hasReplied = (conversation.messageCount ?? 0) > 0;
      const status = hasReplied ? 'Contacted' : 'New';

      return {
        id: conversation.id,
        name,
        property:
          (conversation.listingId && listingTitles.get(conversation.listingId)) ||
          conversation.title ||
          'Listing inquiry',
        time: this.formatRelativeTime(conversation.createdAt),
        status,
        createdAt: conversation.createdAt.toISOString(),
      };
    });
  }

  async getMyListings(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { userId };

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          property: true,
          vehicle: true,
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data: listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
