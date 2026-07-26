import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReportDto, UpdateReportStatusDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reporterId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reporterId,
        reportedId: dto.reportedId || null,
        listingId: dto.listingId || null,
        type: dto.type,
        description: dto.description,
      },
      include: {
        reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        listing: { select: { id: true, title: true } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.report.findMany({
      where: { reporterId: userId },
      include: {
        reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        listing: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(reportId: string, dto: UpdateReportStatusDto) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    return this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: dto.status,
        resolution: dto.resolution || report.resolution,
        resolvedAt: dto.status === 'RESOLVED' || dto.status === 'DISMISSED' ? new Date() : report.resolvedAt,
      },
      include: {
        reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        listing: { select: { id: true, title: true } },
      },
    });
  }
}
