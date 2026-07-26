import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, RespondReviewDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public, Permissions } from '../common/decorators';
import { Permission } from '../common/enums';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Permissions(Permission.REVIEW_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, dto);
  }

  @Get('user/:id')
  @Public()
  @Permissions(Permission.REVIEW_VIEW)
  @ApiOperation({ summary: 'Get reviews for a user' })
  async findByRevieweeId(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.reviewsService.getRevieweeReviews(id, +page, +limit);
  }

  @Get('listing/:id')
  @Public()
  @Permissions(Permission.REVIEW_VIEW)
  @ApiOperation({ summary: 'Get reviews for a listing' })
  async findByListingId(@Param('id') id: string) {
    return this.reviewsService.getListingReviews(id);
  }

  @Put(':id/respond')
  @Permissions(Permission.REVIEW_RESPOND)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to a review' })
  async respond(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: RespondReviewDto,
  ) {
    return this.reviewsService.respondToReview(user.id, id, dto.response);
  }
}
