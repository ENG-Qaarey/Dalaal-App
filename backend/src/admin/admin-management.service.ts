import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Users ──
  async getUsers(params: { q?: string; role?: string; status?: string; page?: number; limit?: number }) {
    const { q, role, status, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { profile: { firstName: { contains: q, mode: 'insensitive' } } },
        { profile: { lastName: { contains: q, mode: 'insensitive' } } },
      ];
    }
    if (role) {
      const roles = role.split(',').map(r => r.trim());
      where.role = roles.length === 1 ? roles[0] : { in: roles };
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          profile: true,
          _count: { select: { listings: true, messages: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: data.map(({ password, ...user }: any) => user),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        verification: true,
        _count: { select: { listings: true, messages: true, reviewsAsReviewee: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user as any;
    return result;
  }

  async updateUserStatus(userId: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
      select: { id: true, email: true, status: true, role: true },
    });
  }

  // ── Listings (admin) ──
  async getAllListings(params: { page?: number; limit?: number; status?: string; type?: string; q?: string }) {
    const { page = 1, limit = 20, status, type, q } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          property: true,
          vehicle: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ── Properties (admin) ──
  async getAllProperties(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        include: {
          listing: {
            select: { id: true, title: true, status: true, price: true, city: true, createdAt: true,
              user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { listing: { createdAt: 'desc' } },
      }),
      this.prisma.property.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ── Vehicles (admin) ──
  async getAllVehicles(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        include: {
          listing: {
            select: { id: true, title: true, status: true, price: true, city: true, createdAt: true,
              user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { listing: { createdAt: 'desc' } },
      }),
      this.prisma.vehicle.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ── Payments ──
  async getPayments(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          listing: { select: { id: true, title: true } },
          escrow: { select: { id: true, status: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ── Escrow ──
  async getEscrow(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.escrow.findMany({
        where,
        include: {
          buyer: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          seller: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          listing: { select: { id: true, title: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.escrow.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ── Reviews ──
  async getReviews(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        include: {
          reviewer: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          reviewee: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          listing: { select: { id: true, title: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async deleteReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    return this.prisma.review.delete({ where: { id: reviewId } });
  }

  // ── Reports ──
  async getReports(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          listing: { select: { id: true, title: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateReportStatus(reportId: string, status: string, resolution?: string) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        resolution: resolution || report.resolution,
        resolvedAt: status === 'RESOLVED' || status === 'DISMISSED' ? new Date() : report.resolvedAt,
      },
      include: {
        reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        listing: { select: { id: true, title: true } },
      },
    });
  }

  // ── Notifications ──
  async getNotifications(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        include: {
          user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ── Announcements ──
  async getAnnouncements() {
    return this.prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getActiveAnnouncements() {
    const now = new Date();
    return this.prisma.announcement.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        expiresAt: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(data: { title: string; content: string; type?: string; isActive?: boolean }) {
    return this.prisma.announcement.create({ data });
  }

  async updateAnnouncement(id: string, data: { title?: string; content?: string; type?: string; isActive?: boolean }) {
    const existing = await this.prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.update({ where: { id }, data });
  }

  async deleteAnnouncement(id: string) {
    const existing = await this.prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Announcement not found');
    return this.prisma.announcement.delete({ where: { id } });
  }

  // ── Contact Messages ──
  async getContactMessages(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.contactMessage.count(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateContactMessage(id: string, data: { status?: string; response?: string }) {
    const existing = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Contact message not found');
    return this.prisma.contactMessage.update({ where: { id }, data });
  }

  // ── FAQs ──
  async getFaqs() {
    return this.prisma.faq.findMany({ orderBy: { order: 'asc' } });
  }

  async createFaq(data: { question: string; answer: string; category?: string; language?: string }) {
    const maxOrder = await this.prisma.faq.aggregate({ _max: { order: true } });
    return this.prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category || 'General',
        language: data.language || 'so',
        order: (maxOrder._max?.order ?? 0) + 1,
      },
    });
  }

  async updateFaq(id: string, data: { question?: string; answer?: string; category?: string; order?: number; isActive?: boolean }) {
    const existing = await this.prisma.faq.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('FAQ not found');
    return this.prisma.faq.update({ where: { id }, data });
  }

  async deleteFaq(id: string) {
    const existing = await this.prisma.faq.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('FAQ not found');
    return this.prisma.faq.delete({ where: { id } });
  }

  // ── Audit Logs ──
  async getAuditLogs(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ]);

    const userIds = [...new Set(data.map((l: any) => l.userId).filter(Boolean))];
    const users = userIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } },
        })
      : [];
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const enriched = data.map((log: any) => {
      const user = log.userId ? userMap.get(log.userId) || null : null;
      const userName = user?.profile?.firstName || user?.email ? `${user?.profile?.firstName ?? ''} ${user?.profile?.lastName ?? ''}`.trim() : undefined;

      const oldValues = log.oldValues && typeof log.oldValues === 'object' ? log.oldValues : {};
      const newValues = log.newValues && typeof log.newValues === 'object' ? log.newValues : {};
      const changes = Object.entries({ ...oldValues, ...newValues }).reduce((acc, [key, value]) => {
        if (oldValues[key] === undefined && newValues[key] === undefined) return acc;
        const previous = oldValues[key];
        const next = newValues[key];
        if (previous === undefined) return `${acc}${acc ? '; ' : ''}${key}: created (${String(next)})`;
        if (next === undefined) return `${acc}${acc ? '; ' : ''}${key}: removed (${String(previous)})`;
        return `${acc}${acc ? '; ' : ''}${key}: ${String(previous)} -> ${String(next)}`;
      }, '');

      return {
        ...log,
        entity: log.entityType,
        user,
        userEmail: user?.email || null,
        userName: userName || user?.email || null,
        changes: changes || 'No field changes recorded',
      };
    });

    return { data: enriched, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async exportSystemReport() {
    const [users, listings, reports, auditLogs] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          status: true,
          createdAt: true,
          profile: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.listing.findMany({
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          price: true,
          city: true,
          createdAt: true,
          user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.findMany({
        select: {
          id: true,
          type: true,
          status: true,
          description: true,
          resolution: true,
          createdAt: true,
          resolvedAt: true,
          reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
          listing: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.findMany({
        select: {
          id: true,
          userId: true,
          action: true,
          entityType: true,
          entityId: true,
          ipAddress: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        users: users.length,
        listings: listings.length,
        reports: reports.length,
        auditLogs: auditLogs.length,
      },
      users,
      listings,
      reports,
      auditLogs,
    };
  }
}
