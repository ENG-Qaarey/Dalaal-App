import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  async create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Get('user/:id')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a user' })
  async findByRevieweeId(@Param('id') id: string, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.reviewsService.getRevieweeReviews(id, +page, +limit);
  }

  @Get('listing/:id')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a listing' })
  async findByListingId(@Param('id') id: string) {
    return this.reviewsService.getListingReviews(id);
  }
}
