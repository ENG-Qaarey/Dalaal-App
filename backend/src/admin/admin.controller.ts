import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { UserRole } from '../common/enums';

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
