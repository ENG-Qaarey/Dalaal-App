import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    if (reviewerId === dto.revieweeId) {
      throw new BadRequestException('You cannot review yourself');
    }

    const review = await this.reviewsRepository.create(reviewerId, dto);

    // Update profile rating and review count
    const stats = await this.reviewsRepository.getAverageRating(dto.revieweeId);
    await this.prisma.profile.update({
      where: { userId: dto.revieweeId },
      data: {
        rating: stats._avg.overallRating || 0,
        reviewCount: stats._count.id,
      },
    }).catch(() => {});

    return review;
  }

  async getRevieweeReviews(revieweeId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.reviewsRepository.findByRevieweeId(revieweeId, skip, limit),
      this.reviewsRepository.countByRevieweeId(revieweeId),
    ]);
    return {
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async respondToReview(userId: string, reviewId: string, response: string) {
    const review = await this.reviewsRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.revieweeId !== userId) {
      throw new ForbiddenException('You can only respond to reviews about you');
    }
    return this.reviewsRepository.respondToReview(reviewId, response);
  }

  async getListingReviews(listingId: string) {
    return this.reviewsRepository.findByListingId(listingId);
  }

  async getRatingSummary(revieweeId: string) {
    return this.reviewsRepository.getAverageRating(revieweeId);
  }
}
