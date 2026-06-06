import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { UserRole } from '../common/enums';
import {
  AnalyticsPeriodQueryDto,
  BreakdownQueryDto,
  BrokersQueryDto,
  TimeseriesQueryDto,
} from './dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.MODERATOR)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly moderationService: ModerationService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get platform analytics overview' })
  async getAnalyticsOverview(@Query() query: AnalyticsPeriodQueryDto) {
    return this.analyticsService.getOverview(query.period);
  }

  @Get('analytics/timeseries')
  @ApiOperation({ summary: 'Get platform analytics time-series' })
  async getAnalyticsTimeseries(@Query() query: TimeseriesQueryDto) {
    return this.analyticsService.getTimeseries(query.metric, query.period, query.granularity);
  }

  @Get('analytics/listings/breakdown')
  @ApiOperation({ summary: 'Get listings breakdown by type, city, or status' })
  async getListingsBreakdown(@Query() query: BreakdownQueryDto) {
    return this.analyticsService.getListingsBreakdown(query.groupBy, query.period);
  }

  @Get('analytics/brokers')
  @ApiOperation({ summary: 'Get top broker performance stats' })
  async getBrokerStats(@Query() query: BrokersQueryDto) {
    return this.analyticsService.getBrokerStats(query.period, query.limit, query.sortBy);
  }

  @Get('pending-listings')
  @ApiOperation({ summary: 'Get listings pending review' })
  async getPendingListings() {
    return this.moderationService.getPendingListings();
  }

  @Post('listings/:id/approve')
  @ApiOperation({ summary: 'Approve a listing' })
  async approveListing(@Param('id') id: string) {
    return this.moderationService.approveListing(id);
  }

  @Post('listings/:id/reject')
  @ApiOperation({ summary: 'Reject a listing' })
  async rejectListing(@Param('id') id: string, @Body('reason') reason: string) {
    return this.moderationService.rejectListing(id, reason);
  }
}
