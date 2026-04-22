import { Injectable } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    return this.reviewsRepository.create(reviewerId, dto);
  }

  async getRevieweeReviews(revieweeId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.reviewsRepository.findByRevieweeId(revieweeId, skip, limit);
  }

  async getListingReviews(listingId: string) {
    return this.reviewsRepository.findByListingId(listingId);
  }

  async getRatingSummary(revieweeId: string) {
    return this.reviewsRepository.getAverageRating(revieweeId);
  }
}
