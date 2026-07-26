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
      include: {
        reviewer: { include: { profile: true } },
        listing: {
          select: {
            id: true,
            title: true,
            type: true,
            city: true,
            featuredImage: true,
          },
        },
      },
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

  async respondToReview(reviewId: string, response: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        response,
        respondedAt: new Date(),
      },
      include: { reviewer: { include: { profile: true } } },
    });
  }

  async findById(reviewId: string) {
    return this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reviewer: { include: { profile: true } } },
    });
  }

  async countByRevieweeId(revieweeId: string) {
    return this.prisma.review.count({ where: { revieweeId } });
  }

  async getAverageRating(revieweeId: string) {
    return this.prisma.review.aggregate({
      where: { revieweeId },
      _avg: { overallRating: true },
      _count: { id: true },
    });
  }
}
