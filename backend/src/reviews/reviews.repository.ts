import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(reviewerId: string, data: any) {
    return this.prisma.review.create({
      data: {
        reviewerId,
        ...data,
      },
    });
  }

  async findByRevieweeId(revieweeId: string, skip = 0, take = 20) {
    return this.prisma.review.findMany({
      where: { revieweeId },
      include: { reviewer: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  async findByListingId(listingId: string) {
    return this.prisma.review.findMany({
      where: { listingId },
      include: { reviewer: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAverageRating(revieweeId: string) {
    return this.prisma.review.aggregate({
      where: { revieweeId },
      _avg: { overallRating: true },
      _count: { id: true },
    });
  }
}
